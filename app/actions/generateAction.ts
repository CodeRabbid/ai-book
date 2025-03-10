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

  return result.response.text();
}

export async function handleGeneratePicture({ story }: { story: string }) {
  if (process.env.NODE_ENV === "development") {
    return "http://res.cloudinary.com/dqckq3bjr/image/upload/v1741471807/kpgaoqpge5ntmmj3xyup.png";
  } else {
    story = story.replace('"', "'");
    const response = (await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an picture to the story "${story}". And don't add any text on the picture.`,
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
}
