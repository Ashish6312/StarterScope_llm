import Groq from "groq-sdk";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

const SYSTEM_PROMPT = `
You are StarterScope Assistant, a premium AI-powered market intelligence assistant.
Your goal is to provide structured, concise, and actionable insights for entrepreneurs.

MANDATORY RESPONSE FORMAT:
1. ### [Descriptive Title]
2. Bulleted list of key insights or data points.
3. A short, professional 1-2 sentence explanation or "Next Step".

STRICT RULES:
- Never use long paragraphs.
- Focus on: Market Trends, Business Opportunities, and Gap Analysis.
- For "Business Gap Analyzer" requests (City + Industry):
  - Provide: Market Demand Insights, Competition Level, Opportunity Gaps, and Suggested Business Ideas.
- Use project knowledge: StarterScope uses Google Places/Geoapify for density scanning and OSM for business registry verification.

Response Tone: Product-level SaaS assistant. Strategic and efficient.
`;

export async function* streamChatResponse(
  messages: ChatMessage[]
): AsyncGenerator<string> {
  try {
    // Maintain context memory (last 5 messages + system prompt)
    const contextWindow = messages.slice(-6); 

    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...contextWindow.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  } catch (err) {
    console.error("StarterScope Intelligence Error:", err);
    yield "### Strategic Engine Offline\n- Connection to StarterScope nodes interrupted.\n- Verification services temporarily limited.\n\nPlease check your connectivity or try again.";
  }
}
