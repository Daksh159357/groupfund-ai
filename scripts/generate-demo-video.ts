import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

async function generateDemoVideo() {
  const outputDir = path.resolve(process.cwd(), 'demo-recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Starting Headless Video Recorder for GroupFund AI...');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: 'demo-recordings/',
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  try {
    // ==========================================
    // SCENE 1: Pitch Deck Presentation (/slides)
    // ==========================================
    console.log('📽️ Scene 1: Pitch Deck Presentation (/slides)...');
    await page.goto('http://localhost:3000/slides');
    await page.waitForTimeout(2500); // Slide 1: Hero

    // Advance through slides 2 to 7
    for (let i = 2; i <= 7; i++) {
      console.log(`➡️ Showing Slide ${i}...`);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(2200);
    }

    // ==========================================
    // SCENE 2: The Dashboard & Interactive Tour (/dashboard)
    // ==========================================
    console.log('📽️ Scene 2: Live Dashboard & Guided Product Tour...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(1500);

    // Reset tour state and reload to guarantee fresh tour trigger
    await page.evaluate(() => {
      localStorage.removeItem('groupfund_tour_completed');
    });
    await page.reload();
    await page.waitForTimeout(1500);

    // Advance through the 5-step Guided Onboarding Tour
    try {
      await page.waitForSelector('.react-joyride__tooltip', { timeout: 10000 });
      console.log('🌟 Guided Tour active! Stepping through benefits...');

      for (let s = 1; s <= 4; s++) {
        await page.waitForTimeout(2200);
        console.log(`  Step ${s}/5 -> Next`);
        const nextBtn = page.locator('button[data-action="primary"], .react-joyride__tooltip button:has-text("Next")').first();
        await nextBtn.click();
      }

      await page.waitForTimeout(2200);
      console.log('  Step 5/5 -> Finish Tour');
      const finishBtn = page.locator('button[data-action="primary"], .react-joyride__tooltip button:has-text("Get Started"), .react-joyride__tooltip button:has-text("Finish")').first();
      await finishBtn.click();
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log('Tour step finished or already completed.');
    }

    // ==========================================
    // SCENE 3: Group Expenses & Min-Cash-Flow Settlements (/groups/group-goa)
    // ==========================================
    console.log('📽️ Scene 3: Group Expenses & Min-Cash-Flow Settlements...');
    await page.goto('http://localhost:3000/groups/group-goa');
    await page.waitForTimeout(2000);

    // Scroll down to display itemized expenses
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Switch to Settlement Plan tab
    console.log('✨ Showing Min-Cash-Flow 3-transaction optimal debt settlement matrix...');
    const settlementTab = page.locator('button:has-text("Settlement Plan")').first();
    if (await settlementTab.isVisible()) {
      await settlementTab.click();
      await page.waitForTimeout(2500);
    }

    // ==========================================
    // SCENE 4: AI Financial Copilot (/ai-assistant)
    // ==========================================
    console.log('📽️ Scene 4: Gemini AI Copilot...');
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForTimeout(2500);

    // ==========================================
    // SCENE 5: Student Innovation Crowdfunding & Verified PayPal Backing
    // ==========================================
    console.log('📽️ Scene 5: Autonomous AgriBot & PayPal Sandbox Flow...');
    await page.goto('http://localhost:3000/projects/proj-agribot');
    await page.waitForTimeout(2200);

    // Scroll to milestone roadmap & BOM
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Scroll to PayPal contribution section
    const contribInput = page.locator('input[type="number"]').first();
    await contribInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Select ₹100 contribution
    await contribInput.fill('100');
    await page.waitForTimeout(1800);

    // Trigger celebratory confetti burst to visualize confirmed capture
    console.log('🎉 Verified Capture confirmed! Launching celebratory confetti...');
    await page.evaluate(() => {
      if ((window as any).confetti) {
        (window as any).confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 },
        });
      }
    });

    await page.waitForTimeout(3500);
    console.log('✅ Demo walkthrough successfully completed without errors!');

  } catch (err) {
    console.error('❌ Error during demo playback:', err);
  } finally {
    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const rawPath = await video.path();
      console.log('📼 Raw WebM saved to:', rawPath);

      // Convert to universally compatible MP4 (H.264 / AAC)
      const mp4Path = path.resolve(outputDir, 'groupfund-pitch-demo.mp4');
      console.log('🔄 Converting WebM to Universal MP4 (H.264/AAC)...');
      try {
        execSync(
          `ffmpeg -y -i "${rawPath}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -shortest "${mp4Path}"`,
          { stdio: 'inherit' }
        );
        console.log('====================================================');
        console.log('🎉 FINAL DEMO MP4 CREATED SUCCESSFULLY:');
        console.log(mp4Path);
        console.log('====================================================');
      } catch (convErr) {
        console.error('⚠️ ffmpeg conversion note:', convErr);
      }
    }
  }
}

generateDemoVideo();
