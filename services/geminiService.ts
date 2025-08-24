
import { GoogleGenAI, Type } from "@google/genai";
import { Demo } from '../types';
import { DEMOS } from '../data/demos';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
You are a friendly and professional AI Guidance Assistant at a healthcare technology conference. 
Your goal is to understand an attendee's interests and recommend a relevant product demo category.
The available categories are: 'Diagnostics', 'Hospital Management', and 'Patient Care'.

RULES:
1. Engage in a brief, natural conversation.
2. Your primary task is to determine which of the three categories the user is interested in based on their message.
3. If the user's intent is clear, suggest a category.
4. If the user's intent is unclear or ambiguous, ask a clarifying question to better understand their needs. Do not force a category.
5. You MUST respond with a JSON object that strictly adheres to the provided schema.
6. The 'reply' field should contain your conversational response to the user.
7. The 'category' field should be one of 'Diagnostics', 'Hospital Management', 'Patient Care', or null if you need more information.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        reply: {
            type: Type.STRING,
            description: "Your conversational response to the user."
        },
        category: {
            type: Type.STRING,
            description: "The recommended category, or null if unclear.",
            nullable: true,
            enum: ['Diagnostics', 'Hospital Management', 'Patient Care'],
        },
    },
    required: ['reply', 'category'],
};

interface GeminiResponse {
    reply: string;
    category: 'Diagnostics' | 'Hospital Management' | 'Patient Care' | null;
}

export const getGuidance = async (userMessage: string): Promise<GeminiResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User's message: "${userMessage}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as GeminiResponse;
        
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            reply: "I'm having a little trouble connecting. Could you please tell me about your interests again?",
            category: null,
        };
    }
};

export const getDemosByCategory = (category: Demo['category']): Demo[] => {
    return DEMOS.filter(demo => demo.category === category);
};
