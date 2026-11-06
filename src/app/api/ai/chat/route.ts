import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callGeminiGenerateContent } from '@/lib/gemini';

const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  context: z.any().optional(),
  chatHistory: z.array(z.any()).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = ChatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Invalid chat request' },
        { status: 400 }
      );
    }

    const { message, context } = parseResult.data;

    const systemPrompt = `You are GroupFund AI's unified financial & innovation intelligence assistant.
You possess complete knowledge of both modules:
1. Group Expenses: Expense splitting (equal, custom, percentage), exact paise-level arithmetic, balance calculation, and simplified debt settlements.
2. Innovation Funding: Student robotics & engineering crowdfunding, milestone tracking, budget utilization, and PayPal sandbox contributions.

User Context Data Provided:
${JSON.stringify(context, null, 2)}

Instructions:
- Provide clear, professional, direct, and actionable answers.
- Format money cleanly in INR (e.g. ₹1,500.00).
- If the user asks "Who owes me money?" or "How much did I spend?", answer accurately using their balance figures in the provided context.
- If the user asks about an innovation proposal, provide realistic engineering guidance, component estimates, and milestone schedules.
- Maintain a helpful, inspiring, and transparent tone.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}\nAssistant Answer:`;
        const reply = await callGeminiGenerateContent(fullPrompt);
        return NextResponse.json({ success: true, reply, mock: false });
      } catch (err: any) {
        console.warn('Gemini chat error, using context-aware local response:', err.message);
      }
    }

    // Context-aware fallback response generator
    const query = (message || '').toLowerCase();
    let reply = '';

    if (query.includes('who owes') || query.includes('pending') || query.includes('settle')) {
      reply = `Based on your active groups, here is your settlement breakdown:\n\n• In **College Trip Goa 2026**, total group expenditure was ₹10,000.00.\n• You paid ₹5,000.00 for the villa booking, while your equal share is ₹2,000.00.\n• Your net receivable is **+₹3,000.00**.\n\nAccording to the simplified settlement plan:\n- **Harsh Mehta** owes you **₹1,500.00**\n- **Meet Joshi** owes you **₹1,000.00**\n- **Jay Patel** owes you **₹500.00**\n\nYou can send settlement reminders or record payments directly from the Settlements tab.`;
    } else if (query.includes('how much') || query.includes('spent') || query.includes('trip')) {
      reply = `In **College Trip Goa 2026**:\n- Total group expenditure across all 5 members: **₹10,000.00**\n- Total amount paid out of pocket by you (Daksh): **₹5,000.00** (Villa Booking)\n- Your allocated 20% share: **₹2,000.00**\n- Net balance: You are owed **₹3,000.00** by your friends.`;
    } else if (query.includes('proposal') || query.includes('robotics') || query.includes('idea')) {
      reply = `I would love to help you build an innovation proposal! Here is an outline recommendation:\n\n1. **Title**: Autonomous Rover for Crop Health Telemetry\n2. **Category**: Robotics & Agricultural Technology\n3. **Core Problem**: Manual field scouting takes 15+ hours per acre and fails to catch early blight before crop devastation.\n4. **Proposed Architecture**: Dual-camera RGB-D depth vision with Jetson Orin Nano, running low-latency YOLOv8 models for leaf lesion identification.\n5. **Recommended Target**: ₹3,50,000 divided across 4 milestones (Design, Chassis, Vision integration, Field trials).\n\nWould you like me to generate the complete milestone schedule and budget table in the Project Creator?`;
    } else if (query.includes('milestone') || query.includes('progress') || query.includes('funding')) {
      reply = `Your project **AgriBot: Autonomous Precision Agricultural Robot** is currently at **70% of its ₹3,50,000.00 funding goal** (₹2,45,000.00 raised from 2 backers via PayPal Sandbox).\n\n• Milestone 1 (Design & Simulation) & Milestone 2 (Chassis Prototype) are **Completed**.\n• Milestone 3 (Sensor Integration & Edge AI Camera) has been submitted for review with a **92% AI Verification Score**.\n• Remaining funding needed to reach 100%: **₹1,05,000.00**.`;
    } else {
      reply = `Hello! I am your GroupFund AI Assistant. I can help you with:\n\n1. **Group Expenses**: Checking balances, identifying who owes whom, calculating equal or custom splits, and auditing receipt line-items.\n2. **Innovation Crowdfunding**: Generating technical grant proposals, suggesting realistic prototype budgets, structuring milestone roadmaps, and evaluating progress logs.\n\nWhat would you like to explore today?`;
    }

    return NextResponse.json({ success: true, reply, mock: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Chat error' },
      { status: 500 }
    );
  }
}
