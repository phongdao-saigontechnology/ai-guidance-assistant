import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, Content } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const systemInstruction = `
You are a friendly and professional AI Guidance Assistant at a healthcare technology conference.
Your goal is to understand an attendee's interests and recommend a relevant product demo category.
The available categories are: 'Diagnostics', 'Hospital Management', and 'Patient Care'.

RULES:
1. Engage in a brief, natural conversation.
2. Your primary task is to determine which of the three categories the user is interested in based on their message.
3. If the user's intent is clear, suggest a category.
4. If the user's intent is unclear or ambiguous, ask a clarifying question to better understand their needs. Do not force a category.
5. You MUST respond with only a JSON object. The JSON object should contain two keys: "reply" and "category". Do not include any other text or markdown formatting like \`\`\`json.
6. The 'reply' field should contain your conversational response to the user.
7. The 'category' field should be one of 'Diagnostics', 'Hospital Management', 'Patient Care', or null if you need more information.
`;

export const useGeminiLive = () => {
  const [session, setSession] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseQueue = useRef<any[]>([]).current;

  const processQueue = useCallback((onMessage: (message: any) => void) => {
    while (responseQueue.length > 0) {
      const message = responseQueue.shift();
      if (message) {
        onMessage(message);
      }
    }
  }, [responseQueue]);

  const connect = useCallback(async (onMessage: (message: any) => void) => {
    if (session || !API_KEY) return;

    try {
      const ai = new GoogleGenAI(API_KEY);
      const liveSession = await ai.live.connect({
        model: 'gemini-live-2.5-flash-preview',
        config: {
          responseModalities: [Modality.TEXT],
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setError(null);
          },
          onmessage: (message: any) => {
            responseQueue.push(message);
            processQueue(onMessage);
          },
          onerror: (e: any) => {
            setError(`Connection error: ${e.message}`);
            setIsConnected(false);
          },
          onclose: () => {
            setIsConnected(false);
            setSession(null);
          },
        },
      });
      setSession(liveSession);
    } catch (e: any) {
      setError(`Failed to connect: ${e.message}`);
    }
  }, [session, processQueue, responseQueue]);

  const send = useCallback((turns: Content[] | string) => {
    if (session && isConnected) {
      session.sendClientContent({ turns });
    }
  }, [session, isConnected]);

  const disconnect = useCallback(() => {
    if (session) {
      session.close();
    }
  }, [session]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, send, isConnected, error };
};