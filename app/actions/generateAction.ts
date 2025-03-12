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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function handleGenerateStory({ theme }: { theme: string }) {
  const prompt = `Write a complete story of about 150 words with the theme: "${theme}" and provide a title for that story.`;
  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function handleGenerateSequel({
  prequelId,
  theme,
}: {
  prequelId: string;
  theme: string;
}) {
  const prequelPost = await prisma.post.findFirst({
    where: { id: prequelId },
    select: {
      story: true,
    },
  });
  const prequel = prequelPost?.story.replace('"', "'");
  const prompt = `Write a sequel of about 150 words to this story:\n"${prequel}",\n with a theme "${theme.replace(
    '"',
    "'"
  )} and provide a title for that sequel.`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function handleGeneratePicture({ story }: { story: string }) {
  if (process.env.NODE_ENV === "development" && false) {
    return "http://res.cloudinary.com/dqckq3bjr/image/upload/v1741471807/kpgaoqpge5ntmmj3xyup.png";
  } else {
    story = story.replace('"', "'");
    const response = (await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an picture without text to the story "${story}". Do not use any character on image.`,
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
  prequelId,
  story,
  picture,
}: {
  prequelId?: string;
  story: string;
  picture: string;
}) {
  const session = await auth();

  await prisma.post.create({
    data: {
      prequelId,
      story: story,
      picture_url: picture,
      authorId: session?.user.id as string,
    },
  });
}

export const generateComment = async ({
  postStory,
  moods,
  wordCount,
}: {
  postStory: string;
  moods: string[];
  wordCount: number;
}) => {
  postStory = postStory.replace('"', "'");

  const prompt = `Generate a single ${moods.join(
    ", "
  )} comment of about ${wordCount} words to this story: "${postStory}".`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateReply = async ({
  postStory,
  previousComments,
  moods,
  wordCount,
}: {
  postStory: string;
  previousComments: string[];
  moods: string[];
  wordCount: number;
}) => {
  postStory = postStory.replace('"', "'");
  let prompt = `This is the post: "${postStory}". These were the consecutive comments:\n`;
  previousComments.forEach((comment, index) => {
    prompt = `${prompt} ${index + 1}. ${comment}\n`;
  });
  prompt = `${prompt}\n Come up with a single ${moods.join(
    ", "
  )} comment of about ${wordCount} words commenting on the lastest comment.`;

  console.log(prompt);
  const result = await model.generateContent(prompt);

  return result.response.text();
};
