import { GoogleGenAI } from "@google/genai";
import type { Build } from '../types';

// Fix: Adhere to Gemini API guidelines by removing manual API key checks and initializing the client directly with process.env.API_KEY. The API key is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeBuildWithGemini = async (build: Build): Promise<string> => {
  try {
    const equipmentList = build.equipment
      .map(e => `- ${e.name} (${e.type}, ${e.rarity}): ${e.description}`)
      .join('\n');

    const prompt = `
      You are an expert analyst and theorycrafter for the sci-fi cooperative shooter "Arc Raiders".
      Analyze the following player build and provide feedback on its strengths, weaknesses, and potential synergies with other player classes.
      Keep your analysis concise, structured, and provide actionable advice. Use markdown for formatting.

      **Build Name:** ${build.name}
      **Class:** ${build.class}
      **Description:** ${build.description}

      **Equipment Loadout:**
      ${equipmentList}

      Please provide your analysis below:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini.");
  }
};
