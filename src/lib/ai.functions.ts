import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callGateway(system: string, messages: { role: string; content: string }[]) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.5,
    }),
  });

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (res.status === 402) throw new Error("NO_CREDITS");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "I couldn't generate a response. Please try again.";
}

const messageSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) });

const TutorInput = z.object({
  mode: z.enum(["explain-concept", "explain-code", "hints-only", "examples", "complexity", "similar-questions"]),
  topic: z.string().max(120).optional(),
  problemTitle: z.string().max(200).optional(),
  messages: z.array(messageSchema).min(1).max(30),
});

const MODE_PROMPTS: Record<string, string> = {
  "explain-concept": "Explain the requested data-structure or algorithm concept clearly with intuition first, then detail. Use short paragraphs and examples.",
  "explain-code": "Carefully explain what the user's code does, step by step, then note its correctness and complexity.",
  "hints-only": "Give progressive HINTS ONLY. Never reveal the full solution or final code. Nudge the learner toward the insight.",
  examples: "Provide concrete worked examples with inputs and outputs that illuminate the concept.",
  complexity: "Analyze time and space complexity rigorously, explaining the reasoning behind each bound.",
  "similar-questions": "Suggest similar practice problems with a one-line description and difficulty for each.",
};

export const askTutor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TutorInput.parse(input))
  .handler(async ({ data }) => {
    const context = [
      data.topic ? `Current topic: ${data.topic}.` : "",
      data.problemTitle ? `Current problem: ${data.problemTitle}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const system = `You are AlgoFlow AI, a friendly, encouraging Data Structures & Algorithms tutor. ${context} ${MODE_PROMPTS[data.mode]} Use Markdown. Keep code in fenced blocks. Be concise but complete.`;
    const content = await callGateway(system, data.messages);
    return { content };
  });

const ExplainCodeInput = z.object({
  code: z.string().min(1).max(12000),
  language: z.string().max(40).default("javascript"),
});

export const explainMyCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExplainCodeInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert code reviewer for AlgoFlow AI. Analyze the user's ${data.language} code and respond in Markdown with these exact sections as headers:
## Complexity Analysis
## Bugs & Mistakes
## Edge Cases Missed
## Suggested Optimizations
## Better Approaches
Be specific and actionable. If a section has nothing to report, say so briefly.`;
    const content = await callGateway(system, [{ role: "user", content: data.code }]);
    return { content };
  });
