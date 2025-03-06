"use client";

import { handleGenerate } from "@/app/actions/generateAction";
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
  const [generationError, setGenerationError] = useState("");

  const form = useForm({
    defaultValues: {
      theme: "",
    },
  });
  const onSubmit = async (values: any) => {
    try {
      const result = await handleGenerate(values);
    } catch (error) {
      setGenerationError(
        "An unexpected error occurred. Please try again." + error
      );
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default Page;
