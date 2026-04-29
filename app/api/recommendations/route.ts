import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

const RecommendationSchema = z.object({
  role: z.string(),
  coreTools: z.array(z.string()),
  skillPath: z.array(z.string()),
  oneClickConfigs: z.array(z.object({
    name: z.string(),
    description: z.string(),
    content: z.string(),
    filePath: z.string(),
  })),
  polygonSetup: z.object({
    enabled: z.boolean(),
    steps: z.array(z.string()),
    cliCommands: z.array(z.string()),
  }).optional(),
  timeSaved: z.string(),
  productivityTips: z.array(z.string()),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY,
});

/** Extracts JSON from a model response, stripping markdown code fences if present */
function extractJSON(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  // Fallback: find the first { ... } block
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);
  return raw.trim();
}

async function generateRecommendations(role: string): Promise<Recommendation> {
  const prompt = `You are an expert AI Developer Experience Engineer at Polygon Labs.

User selected role: ${role}

Generate a highly personalized, production-ready AI tooling onboarding package as JSON.

Respond ONLY with valid JSON (no markdown, no explanation) matching this exact structure:
{
  "role": "string",
  "coreTools": ["string"],
  "skillPath": ["string"],
  "oneClickConfigs": [{"name": "string", "description": "string", "content": "string", "filePath": "string"}],
  "polygonSetup": {"enabled": boolean, "steps": ["string"], "cliCommands": ["string"]},
  "timeSaved": "string",
  "productivityTips": ["string"]
}

Make it practical, specific, and valuable. Include real tools popular in 2026.
For "Blockchain Engineer", include strong Polygon Agent CLI integration.`;

  // Use the modern .invoke() API instead of the deprecated .generate()
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  const raw = typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);

  const jsonStr = extractJSON(raw);
  const parsed = RecommendationSchema.parse(JSON.parse(jsonStr));
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const recommendations = await generateRecommendations(role);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
