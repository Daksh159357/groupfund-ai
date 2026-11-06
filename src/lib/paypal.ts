const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_ENVIRONMENT = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();

export const INR_PER_USD = 83; // fixed demo rate; not live FX

export const isPayPalConfigured = Boolean(
  PAYPAL_CLIENT_ID &&
  PAYPAL_CLIENT_ID !== 'sb' &&
  !PAYPAL_CLIENT_ID.startsWith('your-') &&
  PAYPAL_CLIENT_SECRET &&
  !PAYPAL_CLIENT_SECRET.startsWith('your-')
);

const BASE_URL =
  (PAYPAL_ENVIRONMENT === 'production' || PAYPAL_ENVIRONMENT === 'live')
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Generates an OAuth 2.0 access token using client credentials
 */
export async function getPayPalAccessToken(): Promise<string> {
  if (!isPayPalConfigured) {
    throw new Error('PayPal credentials not configured: Set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
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

  if (!isPayPalConfigured) {
    throw new Error('PayPal Sandbox is not configured. Configure NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local to enable real order creation.');
  }

  // Convert paise to USD: const usdValue = (amountPaise / 100 / INR_PER_USD).toFixed(2);
  const usdValue = amountPaise
    ? (amountPaise / 100 / INR_PER_USD).toFixed(2)
    : amountValue || '1.00';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const targetReturnUrl = returnUrl || `${appUrl}/projects/${customId || ''}`;
  const targetCancelUrl = cancelUrl || `${appUrl}/projects/${customId || ''}?cancelled=true`;

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: customId || `gf-${Date.now()}`,
          custom_id: amountPaise ? String(amountPaise) : customId || '',
          description: description || 'GroupFund Innovation Contribution',
          amount: {
            currency_code: 'USD',
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
  if (!isPayPalConfigured) {
    throw new Error('PayPal Sandbox is not configured. Server-side capture requires valid PayPal credentials.');
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PayPal Capture failed: ${err}`);
  }

  return await response.json();
}
