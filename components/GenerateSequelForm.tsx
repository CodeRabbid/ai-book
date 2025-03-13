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
  const [wordCount, setWordCount] = useState<number[]>([605, 695]);
  const router = useRouter();

  type FormType = {
    theme: string;
    form: string;
  };

  const form = useForm({
    defaultValues: {
      theme: "",
      form: "prose",
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
            wordCount: [
              Math.floor(Math.pow(1.007655, wordCount[0])),
              Math.floor(Math.pow(1.007655, wordCount[1])),
            ],
          });
        } else {
          generatedStory = await handleGenerateStory({
            theme: values.theme,
            form: values.form,
            wordCount: [
              Math.floor(Math.pow(1.007655, wordCount[0])),
              Math.floor(Math.pow(1.007655, wordCount[1])),
            ],
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
                    <span className="text-2xl">{question}</span>
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
                  <FormLabel>Form</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prose" />
                        </FormControl>
                        <FormLabel className="font-normal">Prose</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="poem" />
                        </FormControl>
                        <FormLabel className="font-normal">Poem</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hokku" />
                        </FormControl>
                        <FormLabel className="font-normal">Hokku</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="song" />
                        </FormControl>
                        <FormLabel className="font-normal">Song</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>How many words should it have? (min, max)</div>
            <div className="px-5">
              <CustomSlider2
                value={wordCount}
                scale={(x) => Math.floor(Math.pow(1.007655, x))}
                onChange={(event: Event, value: number | number[]) => {
                  setWordCount(value as number[]);
                }}
                min={395}
                max={839}
                valueLabelDisplay="on"
              />
            </div>

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
