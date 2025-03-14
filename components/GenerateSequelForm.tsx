"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  handleGeneratePicture,
  postStory,
  handleGenerateSequel,
  handleGenerateStory,
} from "@/app/actions/generateAction";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingButton from "@/components/LoadingButton";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomSlider2 } from "./CustomSlider2";
import { z, ZodType } from "zod";

const formList = [
  { value: "prose", label: "Prose" },
  { value: "dialogue", label: "Dialogue" },
  { value: "peom ", label: "Poem" },
  { value: "hokku", label: "Hokku" },
  { value: "song", label: "Song" },
];

const stageList = [
  { value: "none", label: "None" },
  { value: "exposition", label: "Exposition" },
  { value: "rising-action", label: "Rising action" },
  { value: "climax", label: "Climax" },
  { value: "falling-action", label: "Falling action" },
  { value: "resolution", label: "Resolution" },
];

const languageList = [
  { value: "english", label: "English" },
  { value: "german", label: "Deutsch" },
  { value: "french", label: "Française" },
  { value: "russian", label: "Русский" },
  { value: "chinese", label: "中文" },
];

const levelList = [
  { value: "A0", label: "A0" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "native", label: "Native" },
];

const GenerateForm = ({
  question,
  placeholder,
  prequels,
  user,
}: {
  question: string;
  placeholder: string;
  user?: User;
  prequels?: { id: string; story: string }[];
}) => {
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [story, setStory] = useState<string>("");
  const [picture, setPicture] = useState("");
  const [wordCount, setWordCount] = useState<number>(150);
  const router = useRouter();

  type FormType = {
    theme: string;
    form: string;
    stage: string;
    language: string;
    level: string;
  };

  const form = useForm({
    defaultValues: {
      theme: "",
      form: "prose",
      stage: "none",
      language: "english",
      level: "native",
    },
  });

  const onSubmit = async (values: z.infer<ZodType<FormType>>) => {
    if (!user) {
      router.push("/auth/sigin");
    } else {
      try {
        setGenerationError(null);
        let generatedStory = "";
        if (prequels) {
          generatedStory = await handleGenerateSequel({
            theme: values.theme,
            form: values.form,
            prequels,
            wordCount,
            stage: values.stage,
            lang: values.language,
            level: values.level,
          });
        } else {
          generatedStory = await handleGenerateStory({
            theme: values.theme,
            form: values.form,
            wordCount,
            stage: values.stage,
            lang: values.language,
            level: values.level,
          });
        }
        setStory(generatedStory);

        const generatedPicture = (await handleGeneratePicture({
          story: generatedStory,
        })) as string;
        setPicture(generatedPicture);
      } catch (error) {
        setGenerationError("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    }
  };

  const handlePost = async () => {
    const post = await postStory({
      story,
      picture,
      prequelId: prequels ? prequels[prequels.length - 1].id : undefined,
    });
    router.push(`/create/sequel/${post.id}#${post.id}`);
    return;
  };

  return (
    <div className="flex grow justify-center p-4 ">
      <div className="max-w-xl grow">
        {generationError && <ErrorMessage error={generationError} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-xl">{question}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={placeholder}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="form"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What form should it have?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap"
                    >
                      {formList.map((f) => (
                        <FormItem
                          className="flex items-center space-x-1 space-y-0"
                          key={f.value}
                        >
                          <FormControl>
                            <RadioGroupItem value={f.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {f.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel> About how many words should it have?</FormLabel>
            <div className="px-5">
              <CustomSlider2
                value={wordCount}
                onChange={(event: Event, value: number | number[]) => {
                  setWordCount(value as number);
                }}
                min={3}
                max={300}
                valueLabelDisplay="on"
              />
            </div>

            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    What stage within the whole story should it have?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex  flex-wrap"
                    >
                      {stageList.map((stage) => (
                        <FormItem
                          className="flex items-center space-x-1 space-y-0"
                          key={stage.value}
                        >
                          <FormControl>
                            <RadioGroupItem value={stage.value} />
                          </FormControl>
                          <FormLabel className="font-normal whitespace-nowrap">
                            {stage.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What language should it be written in?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex  flex-wrap"
                    >
                      {languageList.map((language) => (
                        <FormItem
                          className="flex items-center space-x-1 space-y-0"
                          key={language.value}
                        >
                          <FormControl>
                            <RadioGroupItem value={language.value} />
                          </FormControl>
                          <FormLabel className="font-normal whitespace-nowrap">
                            {language.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What language level should it have?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex  flex-wrap"
                    >
                      {levelList.map((level) => (
                        <FormItem
                          className="flex items-center space-x-1 space-y-0"
                          key={level.value}
                        >
                          <FormControl>
                            <RadioGroupItem value={level.value} />
                          </FormControl>
                          <FormLabel className="font-normal whitespace-nowrap">
                            {level.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              pending={form.formState.isSubmitting}
              className="w-full"
            >
              Generate
            </LoadingButton>
          </form>
        </Form>
        {(story != "" || picture) && (
          <Card className="w-full px-8 mt-4 block">
            {picture && (
              <Image
                src={picture}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            )}
            <div className="mt-3">
              {story?.split("\n").map((story_paragraph, index) => (
                <div key={index}>{story_paragraph}</div>
              ))}
            </div>
          </Card>
        )}
        <div className="flex justify-end mt-3 w-full">
          {story?.split("\n").length > 0 && picture && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePost)} className="w-full">
                <LoadingButton
                  pending={form.formState.isSubmitting}
                  className="w-full cursor-pointer"
                >
                  Post
                </LoadingButton>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateForm;
