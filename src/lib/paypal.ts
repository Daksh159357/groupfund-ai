export const INR_PER_USD = 83; // fixed demo rate; not live FX

/**
 * Returns dynamic PayPal configuration from environment variables
 */
export function getPayPalConfig() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  const environment = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isConfigured = Boolean(
    clientId &&
    clientId !== 'sb' &&
    !clientId.startsWith('your-') &&
    clientSecret &&
    !clientSecret.startsWith('your-')
  );
  const baseUrl =
    environment === 'production' || environment === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  return { clientId, clientSecret, environment, isConfigured, baseUrl, appUrl };
}

export const isPayPalConfigured = Boolean(
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'sb' &&
  !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.startsWith('your-') &&
  process.env.PAYPAL_CLIENT_SECRET &&
  !process.env.PAYPAL_CLIENT_SECRET.startsWith('your-')
);

/**
 * Generates an OAuth 2.0 access token using client credentials.
 * Generates a fresh token on each invocation (no global in-memory cache)
 * to guarantee that environment/client ID changes take effect immediately.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret, isConfigured, baseUrl } = getPayPalConfig();

  if (!isConfigured) {
    throw new Error('PayPal credentials not configured: Set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal auth error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a PayPal order server-side
 */
export async function createPayPalOrder(params: {
  amountValue?: string; // e.g. "1.20"
  amountPaise?: number; // e.g. 10000 (₹100)
  currencyCode?: string; // "USD"
  customId?: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}) {
  const { amountValue, amountPaise, currencyCode = 'USD', customId, description, returnUrl, cancelUrl } = params;
  const { isConfigured, baseUrl, appUrl } = getPayPalConfig();

  if (!isConfigured) {
    throw new Error('PayPal Sandbox is not configured. Configure NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local to enable real order creation.');
  }

  // Convert paise to USD: const usdValue = (amountPaise / 100 / INR_PER_USD).toFixed(2);
  const usdValue = amountPaise
    ? (amountPaise / 100 / INR_PER_USD).toFixed(2)
    : amountValue || '1.00';

  const targetReturnUrl = returnUrl || `${appUrl}/projects/${customId || ''}`;
  const targetCancelUrl = cancelUrl || `${appUrl}/dashboard?cancelled=true`;

  const accessToken = await getPayPalAccessToken();

  // Fresh unique request ID for EVERY checkout attempt to guarantee idempotency and avoid duplicate orders
  const requestId = crypto.randomUUID();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': requestId,
    },
    cache: 'no-store',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: customId || `gf-${Date.now()}`,
          custom_id: amountPaise ? String(amountPaise) : customId || '',
          description: description || 'GroupFund Innovation Contribution',
          amount: {
            currency_code: currencyCode,
            value: usdValue,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'GroupFund AI',
            user_action: 'PAY_NOW',
            return_url: targetReturnUrl,
            cancel_url: targetCancelUrl,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PayPal Order Creation failed: ${err}`);
  }

  return await response.json();
}

/**
 * Captures a PayPal order server-side
 */
export async function capturePayPalOrder(orderId: string) {
  const { isConfigured, baseUrl } = getPayPalConfig();

  if (!isConfigured) {
    throw new Error('PayPal Sandbox is not configured. Server-side capture requires valid PayPal credentials.');
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errText = await response.text();
    let errJson: any = null;
    try {
      errJson = JSON.parse(errText);
    } catch (_) {}

    const isAlreadyCaptured =
      errText.includes('ORDER_ALREADY_CAPTURED') ||
      errJson?.details?.some((d: any) => d.issue === 'ORDER_ALREADY_CAPTURED');

    const error: any = new Error(errJson?.message || errText || `PayPal Capture failed (${response.status})`);
    error.status = response.status;
    error.isAlreadyCaptured = isAlreadyCaptured;
    error.details = errJson;
    throw error;
  }

  return await response.json();
}
