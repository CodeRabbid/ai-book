"use client";

import { handleGenerate } from "@/app/actions/generateAction";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingButton from "@/components/LoadingButton";
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
  const [story, setStory] = useState("");

  const form = useForm({
    defaultValues: {
      theme: "",
    },
  });
  const onSubmit = async ({ theme }: { theme: string }) => {
    try {
      setGenerationError(null);
      const generated_story = await handleGenerate({ theme });
      setStory(generated_story);
    } catch (error) {
      setGenerationError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      {generationError && <ErrorMessage error={generationError} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your story about?</FormLabel>
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
      <div>{story}</div>
    </div>
  );
};

export default Page;
