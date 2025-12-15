import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisSettings, AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an elite viral content analyst, short-form video editor, and creator growth strategist.
Your job is to analyze long-form transcripts and automatically extract highly viral TikTok-worthy clips.

🧠 VIRAL SCORING SYSTEM
Score each detected moment from 1–10 using:
- Shock / Surprise (Weight: 3)
- Humor (Weight: 3)
- Relatability (Weight: 2)
- Emotional Intensity (Weight: 2)

❗ Only output moments with score >= 7.

🧪 MONETIZATION & SAFETY CHECK
Flag clips if: Excessive profanity, Graphic content, Sexual content.
Label: 'safe', 'needs_censor', or 'not_recommended'.

For each clip, provide:
1. Exact timestamps
2. Viral score and category
3. On-screen hook (max 6 words, emotion-first, max 1 emoji)
4. TikTok-optimized video title (5-10 words, no hashtags, curiosity driven)
5. A short psychological reason why this goes viral.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief 1-sentence summary of the overall transcript content."
    },
    clips: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          clip_id: { type: Type.STRING },
          start_time: { type: Type.STRING, description: "Format MM:SS" },
          end_time: { type: Type.STRING, description: "Format MM:SS" },
          duration: { type: Type.STRING },
          viral_score: { type: Type.NUMBER },
          category: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          reason: { type: Type.STRING, description: "Why this goes viral" },
          on_screen_hook: { type: Type.STRING },
          video_title: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          platform: { type: Type.STRING },
          recommended_aspect_ratio: { type: Type.STRING, enum: ["9:16"] },
          monetization_risk: { type: Type.STRING, enum: ["safe", "needs_censor", "not_recommended"] }
        },
        required: ["clip_id", "start_time", "end_time", "viral_score", "on_screen_hook", "video_title", "monetization_risk"]
      }
    }
  },
  required: ["clips", "summary"]
};

export const analyzeTranscript = async (
  apiKey: string,
  transcript: string,
  settings: AnalysisSettings
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following transcript.
    
    Settings:
    - Target Platform: ${settings.platform}
    - Preferred Length: ${settings.clipLength}
    - Niche: ${settings.niche}
    - Language: ${settings.language}

    TRANSCRIPT:
    ${transcript}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4, // Lower temperature for more consistent analytical output
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};