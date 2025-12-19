import { GoogleGenAI } from "@google/genai";

export const summarizePost = async (content: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following blog post into 3 concise, bulleted takeaways suitable for a quick read. Format the output as a markdown list. \n\n Blog Content: \n${content}`,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing post:", error);
    return "Failed to connect to AI service. Please check your API key configuration.";
  }
};
