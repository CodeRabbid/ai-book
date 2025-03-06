"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handleGenerate({ theme }: { theme: string }) {
  const api_key = process.env.GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Write a story with the theme: "${theme}"`;
  const result = await model.generateContent(prompt);

  const story = result.response.text();
  console.log(story);

  return story;
}
