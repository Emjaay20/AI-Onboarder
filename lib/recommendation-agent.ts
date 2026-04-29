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

export async function generateRecommendations(role: string): Promise<Recommendation> {
  const jsonSchema = JSON.stringify(RecommendationSchema.pick({
    role: true,
    coreTools: true,
    skillPath: true,
    oneClickConfigs: true,
    polygonSetup: true,
    timeSaved: true,
    productivityTips: true,
  }).shape, null, 2);

  const prompt = `You are an expert AI Developer Experience Engineer at Polygon Labs.

User selected role: ${role}

Generate a highly personalized, production-ready AI tooling onboarding package as JSON.

Respond ONLY with valid JSON (no other text) matching this structure:
{
  "role": "string",
  "coreTools": ["string"],
  "skillPath": ["string"],
  "oneClickConfigs": [{"name": "string", "description": "string", "content": "string", "filePath": "string"}],
  "polygonSetup": {"enabled": boolean, "steps": ["string"], "cliCommands": ["string"]},
  "timeSaved": "string",
  "productivityTips": ["string"]
}

Make it practical, specific, and valuable. Include real tools.
For "Blockchain Engineer", include strong Polygon Agent CLI integration.`;

  const message = [{ type: "human" as const, content: prompt }];
  const result = (await (llm as any).generate([message])) as any;
  const content = result.generations[0][0].text;
  
  const parsed = RecommendationSchema.parse(JSON.parse(content));
  return parsed;
}
