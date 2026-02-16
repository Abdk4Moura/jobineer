import { GoogleGenAI, Type } from "@google/genai";
import { ActionType } from "../types";

// Initialize the Gemini client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const parseJobDescription = async (text: string): Promise<{
  companyName: string;
  roleTitle: string;
  actionType: ActionType;
  contactTarget: string;
  summary: string;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: text,
      config: {
        systemInstruction: `You are an expert job application assistant. Your task is to analyze unstructured job posting text and extract key actionable details.
        
        Rules for extraction:
        1. **companyName**: Extract the company name. If not found, use "Unknown Company".
        2. **roleTitle**: Extract the job title. If not found, use "General Application".
        3. **actionType**: Determine the primary method to apply.
           - "EMAIL": If an email address is provided for applications.
           - "WHATSAPP": If a phone number is provided with instructions to message/call.
           - "LINK": If an external URL (ATS, LinkedIn, etc.) is provided.
           - "MIXED": If multiple methods are equally valid, prioritize EMAIL, then LINK.
        4. **contactTarget**: 
           - For EMAIL: Return the email address.
           - For WHATSAPP: Return the phone number (clean format).
           - For LINK: Return the URL.
        5. **summary**: A concise 1-sentence summary of the role and requirements (max 20 words).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            roleTitle: { type: Type.STRING },
            actionType: { 
              type: Type.STRING, 
              enum: [ActionType.EMAIL, ActionType.WHATSAPP, ActionType.LINK, ActionType.MIXED] 
            },
            contactTarget: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ["companyName", "roleTitle", "actionType", "contactTarget", "summary"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(resultText);

  } catch (error) {
    console.error("Error parsing job with Gemini:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      companyName: "Error / Manual Entry",
      roleTitle: "Unknown Role",
      actionType: ActionType.LINK,
      contactTarget: "https://example.com",
      summary: "Failed to parse text. Please check your API key or try again.",
    };
  }
};
