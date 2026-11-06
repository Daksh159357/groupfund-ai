import { ReceiptScanData, BudgetItem, Milestone } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Calls Google Gemini REST endpoint directly with fallback handling
 */
export async function callGeminiGenerateContent(prompt: string, inlineData?: { mimeType: string; data: string }): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  // Model: gemini-2.5-flash or gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const parts: any[] = [{ text: prompt }];
  if (inlineData) {
    parts.push({
      inlineData: {
        mimeType: inlineData.mimeType,
        data: inlineData.data,
      },
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

/**
 * Intelligent fallback receipt parser when no API key is provided
 * Provides realistic high-confidence extraction for demonstration
 */
export function getMockReceiptScan(imageName?: string): ReceiptScanData {
  return {
    merchantName: 'Candolim Bay Bistro & Cafe',
    purchaseDate: new Date().toISOString().split('T')[0],
    items: [
      { name: 'Woodfired Pizza (Margherita)', quantity: 2, pricePaise: 95000 },
      { name: 'Fresh Lime Soda', quantity: 4, pricePaise: 32000 },
      { name: 'Grilled Sea Bass with Herbs', quantity: 2, pricePaise: 140000 },
      { name: 'Garlic Bread with Cheese', quantity: 2, pricePaise: 38000 },
    ],
    subtotalPaise: 305000,
    taxPaise: 15250, // 5% GST
    discountPaise: 0,
    totalPaise: 320250, // ₹3,202.50
    confidenceScore: 98,
    rawNotes: 'Detected printed invoice: GSTIN 30ABCDE1234F1Z5. Extracted 4 line items with 5% tax.',
    mock: true,
  };
}

/**
 * Generates an innovation project proposal template using Gemini or fallback
 */
export function getMockProposal(topic: string, category: string) {
  return {
    mock: true,
    title: `${topic}: Advanced Engineering Prototype`,
    shortDescription: `An innovative ${category.toLowerCase()} platform engineered by student researchers to deliver high-performance, cost-effective automation.`,
    problemStatement: `Current commercial alternatives in ${topic} are either prohibitively expensive for domestic implementation or lack autonomous adaptation for real-world environmental noise.`,
    proposedSolution: `Our system combines low-power edge compute microcontrollers, modular sensory telemetry, and real-time inference to achieve 40% efficiency gains at one-third the unit manufacturing cost.`,
    suggestedBudget: [
      { item: 'Sensory Telemetry & Microcontrollers', amountPaise: 6000000, notes: 'Core processing hardware' },
      { item: 'Precision Mechanical Actuators', amountPaise: 8000000, notes: 'Structural servos & drive gears' },
      { item: 'Chassis Fabrication & Rapid 3D Prototyping', amountPaise: 5000000, notes: 'Aluminum alloy frame' },
      { item: 'Power Supply & High-Capacity Battery Pack', amountPaise: 6000000, notes: 'Continuous duty cycle pack' },
    ],
    milestones: [
      {
        orderIndex: 1,
        title: 'System Architecture & Simulation',
        description: 'Complete block diagrams, circuit schematics, and kinematic simulations in software.',
        targetDate: '2026-09-01',
        budgetAllocatedPaise: 5000000,
      },
      {
        orderIndex: 2,
        title: 'Hardware Bench Prototyping',
        description: 'Breadboard validation, sensor calibration, and preliminary drive tests.',
        targetDate: '2026-10-15',
        budgetAllocatedPaise: 8000000,
      },
      {
        orderIndex: 3,
        title: 'Integrated Field Demonstration',
        description: 'Real-world testing in representative operational conditions and milestone audit.',
        targetDate: '2026-12-01',
        budgetAllocatedPaise: 12000000,
      },
    ],
  };
}
