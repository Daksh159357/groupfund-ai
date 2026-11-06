import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function captureScreenshots() {
  const screenshotsDir = path.resolve(process.cwd(), 'public/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('📸 Starting Devpost Screenshot Capture (3:2 Ratio: 1200x800)...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2, // HiDPI / Retina crispness
  });

  const page = await context.newPage();

  try {
    // 1. Dashboard Screenshot (mark tour completed first so modal doesn't overlay)
    console.log('📸 1. Capturing Dashboard...');
    await page.goto('http://localhost:3000/dashboard');
    await page.evaluate(() => {
      localStorage.setItem('groupfund_tour_completed', 'true');
    });
    await page.reload();
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'dashboard.png'),
    });
    console.log('✅ Saved public/screenshots/dashboard.png');

    // 2. Goa Trip Expenses Page
    console.log('📸 2. Capturing Goa Trip Expenses Page...');
    await page.goto('http://localhost:3000/groups/group-goa');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'goa-expenses.png'),
    });
    console.log('✅ Saved public/screenshots/goa-expenses.png');

    // 3. AgriBot Innovation Project Page
    console.log('📸 3. Capturing AgriBot Project Page...');
    await page.goto('http://localhost:3000/projects/proj-agribot');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'agribot-project.png'),
    });
    console.log('✅ Saved public/screenshots/agribot-project.png');

    // 4. PayPal Checkout Button Area
    console.log('📸 4. Capturing PayPal Checkout Card Area...');
    const contribCard = page.locator('input[type="number"], button:has-text("PayPal")').first();
    await contribCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'paypal-checkout.png'),
    });
    console.log('✅ Saved public/screenshots/paypal-checkout.png');

    console.log('🎉 All 4 Devpost screenshots captured in 3:2 ratio successfully!');
  } catch (err) {
    console.error('❌ Error capturing screenshots:', err);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
