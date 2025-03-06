"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handleGenerate({ theme }: { theme: string }) {
  const api_key = process.env.GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Write another complete story of about 150 words with the theme: "${theme}" and provide a title for that story`;
  const result = await model.generateContent(prompt);

  const story_lines = result.response.text().split("\n");
  return story_lines;
}
