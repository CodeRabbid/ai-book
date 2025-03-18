"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ImagesResponse } from "openai/resources/images.mjs";
import { generate } from "random-words";
import { generateRandomMood } from "@/lib/utils";

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
  stage,
  lang,
  level,
  genre,
}: {
  theme: string;
  form: string;
  wordCount: number;
  stage: string;
  lang: string;
  level: string;
  genre: string;
}) {
  if (theme === "") {
    theme = generate(1) as string;
  }

  const stageSpecification =
    stage === "none"
      ? ""
      : `The stage within the story structure must be ${stage}.`;

  const levelSepcification =
    level === "native" ? "" : `The language level must be ${level}.`;

  const genreSepcification =
    genre === "none" ? "" : `The genre of the chapter must be "${genre}".`;

  const prompt = `Write the first chapter of approximately ${wordCount} words and not more than 3800 characters, with the theme: "${theme}". ${genreSepcification} The chapter must be a ${form}. ${stageSpecification} The genre of the chapter must be "${genre}". The language of the chapter must be ${lang}. ${levelSepcification}`;
  console.log(prompt);
  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function handleGenerateSequel({
  theme,
  form,
  prequels,
  wordCount,
  stage,
  lang,
  level,
  genre,
}: {
  theme: string;
  form: string;
  prequels: { story: string }[];
  wordCount: number;
  stage: string;
  lang: string;
  level: string;
  genre: string;
}) {
  let chapters = "";
  prequels.forEach(
    (prequel: { story: string }, index: number) =>
      (chapters =
        chapters + "Chapter " + (index + 1) + ".:\n\n" + prequel.story + "\n\n")
  );

  const stageSpecification =
    stage === "none"
      ? ""
      : `The stage within the story structure must be ${stage}.`;

  const levelSepcification =
    level === "native" ? "" : `The language level must be ${level}.`;

  const genreSepcification =
    genre === "none" ? "" : `The genre of the chapter must be "${genre}".`;

  const prompt = `Write a sequel of approximately ${wordCount} words, but not more than 3800 characters, to this story:\n"${chapters}",\n with a theme "${theme.replace(
    '"',
    "'"
  )}". ${genreSepcification} The chapter must be a ${form}. ${stageSpecification} The language of the chapter must be ${lang}. ${levelSepcification}`;
  console.log(prompt);
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

export const generateComment = async ({
  postLanguage,
  postStory,
  moods,
  wordCount,
}: {
  postLanguage: string;
  postStory: string;
  moods: string[];
  wordCount: number;
}) => {
  postStory = postStory.replace('"', "'");

  if (moods.length === 0) {
    moods = [generateRandomMood()];
  }
  postStory = postStory.replace('"', "'");
  const prompt = `Generate a single ${moods.join(
    ", "
  )} comment of about ${wordCount} words to this story: "${postStory}". The language of the comment must be ${postLanguage}.`;
  console.log(prompt);
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateReply = async ({
  postLanguage,
  postStory,
  previousComments,
  moods,
  wordCount,
}: {
  postLanguage: string;
  postStory: string;
  previousComments: string[];
  moods: string[];
  wordCount: number;
}) => {
  if (moods.length === 0) {
    moods = [generateRandomMood()];
  }
  postStory = postStory.replace('"', "'");
  let prompt = `This is the post: "${postStory}". These were the consecutive comments:\n`;
  previousComments.forEach((comment, index) => {
    prompt = `${prompt} ${index + 1}. ${comment}\n`;
  });
  prompt = `${prompt}\n Come up with a single ${moods.join(
    ", "
  )} comment of about ${wordCount} words replying to the lastest comment. The language of the comment must be ${postLanguage}.`;

  console.log(prompt);
  const result = await model.generateContent(prompt);

  return result.response.text();
};
