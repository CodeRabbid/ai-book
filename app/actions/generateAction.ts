"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ImagesResponse } from "openai/resources/images.mjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const openai_api_key = process.env.OPENAI_API_KEY as string;
const openai = new OpenAI({ apiKey: openai_api_key });

const api_key = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(api_key);

cloudinary.config({
  cloud_name: "dqckq3bjr",
  api_key: "843268663811185",
  api_secret: "HlQh1clvGMBtEkrFiGur0vcv-Yk",
});

export async function handleGenerateStory({ theme }: { theme: string }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Write a complete story of about 150 words with the theme: "${theme}" and provide a title for that story.`;
  const result = await model.generateContent(prompt);

  const story_paragraphs = result.response.text().split("\n");
  return story_paragraphs;
}

export async function handleGeneratePicture({ theme }: { theme: string }) {
  if (process.env.NODE_ENV === "development") {
    return "https://res.cloudinary.com/dqckq3bjr/image/upload/v1741296430/story.png";
  } else {
    const response = (await openai.images.generate({
      model: "dall-e-3",
      prompt: `Story with a theme "${theme}"`,
      n: 1,
      size: "1024x1024",
    })) as ImagesResponse;

    const image_url = response.data[0].url as string;

    const uploadResult = (await cloudinary.uploader
      .upload(image_url)
      .catch((error) => {
        console.log(error);
      })) as UploadApiResponse;

    return uploadResult.url;
  }
}

export async function postStory({
  storyParagraphs,
  picture,
}: {
  storyParagraphs: string[];
  picture: string;
}) {
  const session = await auth();

  await prisma.post.create({
    data: {
      storyParagraphs: storyParagraphs,
      picture_url: picture,
      authorId: session?.user.id as string,
    },
  });
  console.log("success");
}
