import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callGeminiGenerateContent, getMockProposal } from '@/lib/gemini';

const AssistantRequestSchema = z.object({
  action: z.string().optional().default('generate_full_proposal'),
  topic: z.string().optional().default('Autonomous Robot'),
  category: z.string().optional().default('Robotics'),
  currentDraft: z.string().optional().default(''),
});

const ProposalOutputSchema = z.object({
  mock: z.boolean().optional(),
  title: z.string(),
  shortDescription: z.string(),
  problemStatement: z.string(),
  proposedSolution: z.string(),
  suggestedBudget: z.array(
    z.object({
      item: z.string(),
      amountPaise: z.number().int().nonnegative(),
      notes: z.string().optional(),
    })
  ).default([]),
  milestones: z.array(
    z.object({
      orderIndex: z.number().int(),
      title: z.string(),
      description: z.string(),
      targetDate: z.string().optional(),
      budgetAllocatedPaise: z.number().int().nonnegative().optional().default(0),
    })
  ).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = AssistantRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: 'Invalid assistant payload' }, { status: 400 });
    }

    const { action, topic, category, currentDraft } = parseResult.data;

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an expert engineering grant advisor and innovation proposal assistant for student teams and robotics innovators.
Action requested: ${action}
Project Topic: ${topic}
Category: ${category}
Current Draft / Details: ${currentDraft}

Return a STRICT JSON response ONLY with no markdown backticks, following this structure:
{
  "title": "Clear concise engineering project title",
  "shortDescription": "2 sentence high impact summary",
  "problemStatement": "Detailed real-world problem statement with metrics",
  "proposedSolution": "Technical proposed solution including hardware and software architecture",
  "suggestedBudget": [
    { "item": "Component Name", "amountPaise": 5000000, "notes": "Explanation" }
  ],
  "milestones": [
    { "orderIndex": 1, "title": "Milestone Title", "description": "Deliverables", "targetDate": "2026-10-01", "budgetAllocatedPaise": 5000000 }
  ]
}
Amounts must be integer paise (1 INR = 100 paise). The AI must provide suggestions and realistic milestones, without fabricating completed certifications.`;

        const responseText = await callGeminiGenerateContent(prompt);
        const jsonCleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonCleaned);
        const validated = ProposalOutputSchema.parse({ ...parsed, mock: false });

        return NextResponse.json({ success: true, data: validated });
      } catch (err: any) {
        console.warn('Gemini proposal call error, using local generator:', err.message);
      }
    }

    // High fidelity fallback proposal generator
    const fallback = getMockProposal(topic, category);
    return NextResponse.json({ success: true, data: fallback });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
