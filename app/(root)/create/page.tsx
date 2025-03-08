"use client";

import {
  handleGenerateStory,
  handleGeneratePicture,
  postStory,
} from "@/app/actions/generateAction";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [storyParagraphs, setStoryParagraphs] = useState<string[]>([]);
  const [picture, setPicture] = useState("");
  const router = useRouter();

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
      setPicture(generatedPicture);
    } catch (error) {
      setGenerationError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  const handlePost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await postStory({ storyParagraphs, picture });
    router.push("/");
    return;
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
        {(storyParagraphs.length > 0 || picture) && (
          <Card className="w-full px-8 mt-4 block">
            {picture && <img src={picture} />}
            <div className="mt-3">
              {storyParagraphs.map((story_paragraph, index) => (
                <div key={index}>{story_paragraph}</div>
              ))}
            </div>
          </Card>
        )}
        <div className="flex justify-end mt-3">
          {storyParagraphs.length > 0 && picture && (
            <form onSubmit={handlePost}>
              <Button type="submit">Post</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
