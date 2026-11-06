import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function recordDemo() {
  const outputDir = path.resolve(process.cwd(), 'demo-recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Starting demo recording browser...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: 'demo-recordings/',
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  try {
    // a. Navigate to dashboard
    console.log('📍 a. Navigating to Dashboard...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);

    // b. Click Settings link in sidebar
    console.log('📍 b. Clicking Settings in sidebar...');
    await page.locator('a[href="/settings"]').first().click();
    await page.waitForTimeout(2000);

    // c. Click Replay Guided Tour button
    console.log('📍 c. Clicking Replay Guided Tour button...');
    await page.getByRole('button', { name: /Replay Guided Tour/i }).click();
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(2000);

    // d. Wait for Joyride tour and advance through steps
    console.log('📍 d. Waiting for Guided Tour...');
    await page.waitForSelector('.react-joyride__tooltip', { timeout: 15000 });

    for (let step = 1; step <= 4; step++) {
      console.log(`✨ Tour Step ${step}/5 -> pausing to show pitch content...`);
      await page.waitForTimeout(2500);
      const nextBtn = page.locator('button[data-action="primary"], .react-joyride__tooltip button:has-text("Next")').first();
      await nextBtn.click();
    }

    // Step 5: Finish tour
    console.log('✨ Tour Step 5/5 -> finishing tour...');
    await page.waitForTimeout(2500);
    const finishBtn = page.locator('button[data-action="primary"], .react-joyride__tooltip button:has-text("Get Started"), .react-joyride__tooltip button:has-text("Finish")').first();
    await finishBtn.click();
    await page.waitForTimeout(2000);

    // e. Navigate to /groups
    console.log('📍 e. Navigating to Groups...');
    await page.goto('http://localhost:3000/groups');
    await page.waitForTimeout(2000);

    // f. Click College Trip Goa 2026 group
    console.log('📍 f. Opening "College Trip Goa 2026" group...');
    await page.locator('text="College Trip Goa 2026"').first().click();

    // g. Wait 2 seconds for judge to read group breakdown & ₹10,000 total
    console.log('📍 g. Showing group expense settlement breakdown...');
    await page.waitForTimeout(2000);

    // h. Navigate to /discover
    console.log('📍 h. Navigating to Discover Projects...');
    await page.goto('http://localhost:3000/discover');
    await page.waitForTimeout(2000);

    // i. Click AgriBot project
    console.log('📍 i. Opening Autonomous AgriBot project...');
    await page.locator('text="Autonomous AgriBot"').first().click();

    // j. Wait 2 seconds
    console.log('📍 j. Showing project details & milestone budget...');
    await page.waitForTimeout(2000);

    // k. Scroll to PayPal contribution card
    console.log('📍 k. Scrolling to PayPal contribution card...');
    const contribInput = page.locator('input[type="number"]').first();
    await contribInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // l. Fill amount input with 100
    console.log('📍 l. Filling contribution amount: ₹100...');
    await contribInput.fill('100');
    await page.waitForTimeout(2000);

    // m. Click PayPal Sandbox Checkout button
    console.log('📍 m. Clicking PayPal Sandbox Checkout button...');
    const payPalButton = page.locator('button:has-text("PayPal"), button:has-text("Sandbox Checkout")').first();
    await payPalButton.click();

    // n. CRITICAL PAUSE: Wait for PayPal Sandbox URL
    console.log('📍 n. Waiting for PayPal Sandbox redirect...');
    await page.waitForURL('**/sandbox.paypal.com/**', { timeout: 60000 });
    console.log('✅ Reached PayPal Sandbox checkout!');

    // o. Pause for user to manually log in & approve
    console.log('⏸️  CRITICAL PAUSE: Script paused.');
    console.log('👉 Please complete the login and click "Pay" in the browser.');
    console.log('👉 Once submitted, click the "Resume" button (▶️) in Playwright Inspector.');
    await page.pause();

    // p. Wait for redirect back to app
    console.log('📍 p. Waiting for redirect back to GroupFund AI with capture token...');
    await page.waitForURL('**/projects/proj-agribot?token=**', { timeout: 60000 });

    // q. Wait 3 seconds for confetti to fire and finish
    console.log('🎉 q. PayPal capture verified! Confetti celebration...');
    await page.waitForTimeout(3000);

    // r. Wait 2 seconds for final viewing
    console.log('📍 r. Final verification pause...');
    await page.waitForTimeout(2000);
  } catch (err) {
    console.error('❌ Error during demo playback:', err);
  } finally {
    // s. Close browser context to flush and save video
    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const savedPath = await video.path();
      console.log('====================================================');
      console.log('🎬 DEMO VIDEO SAVED SUCCESSFULLY:');
      console.log(savedPath);
      console.log('====================================================');
    }
  }
}

recordDemo();
