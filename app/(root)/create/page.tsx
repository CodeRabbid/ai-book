"use client";

import {
  handleGenerateStory,
  handleGeneratePicture,
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [storyParagraphs, setStoryParagraphs] = useState<string[]>([]);
  const [picture, setPicture] = useState("");

  const form = useForm({
    defaultValues: {
      theme: "",
    },
  });
  const onSubmit = async ({ theme }: { theme: string }) => {
    try {
      setGenerationError(null);
      const generatedStoryParagraphs = await handleGenerateStory({ theme });
      setStoryParagraphs(generatedStoryParagraphs);

      const generatedPicture = (await handleGeneratePicture({
        theme,
      })) as string;
      console.log(generatedPicture);
      setPicture(generatedPicture);
    } catch (error) {
      setGenerationError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex grow  justify-center p-4 ">
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
                    <span className="text-2xl">What is your story about?</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter a theme for your story, e.g. 'Dragon chasing a princess' "
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton pending={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
        <Card className="w-full px-8 mt-4 block">
          <img src={picture} />
        </Card>
        <Card className="w-full px-8 mt-4 block">
          {storyParagraphs.map((story_paragraph) => (
            <div>{story_paragraph}</div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Page;
