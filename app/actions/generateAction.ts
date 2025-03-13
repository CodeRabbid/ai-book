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

export async function handleGenerateStory({
  theme,
  form,
  wordCount,
}: {
  theme: string;
  form: string;
  wordCount: number[];
}) {
  const prompt = `Write the first chapter of exactly ${wordCount[0]}-${wordCount[1]} words and not more than 3800 characters, with the theme: "${theme}". The chapter must be a ${form}.`;
  console.log(prompt);
  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function handleGenerateSequel({
  theme,
  form,
  prequels,
  wordCount,
}: {
  theme: string;
  form: string;
  prequels: { story: string }[];
  wordCount: number[];
}) {
  let chapters = "";
  prequels.forEach(
    (prequel: { story: string }, index: number) =>
      (chapters =
        chapters + "Chapter " + (index + 1) + ".:\n\n" + prequel.story + "\n\n")
  );

  const prompt = `Write a sequel of ${wordCount[0]}-${
    wordCount[1]
  } words, but not more than 3800 characters, to this story:\n"${chapters}",\n with a theme "${theme.replace(
    '"',
    "'"
  )}". The chapter must be a ${form}.`;

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
      prompt: `Create an picture without text to the story "${story}". Do not use any letters on image.`,
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

  const post = await prisma.post.create({
    data: {
      prequelId,
      story: story,
      picture_url: picture,
      authorId: session?.user.id as string,
    },
  });

  return post;
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
