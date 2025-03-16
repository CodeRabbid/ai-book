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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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
  { value: "spanish", label: "Español" },
  { value: "russian", label: "Русский" },
  { value: "chinese", label: "中文" },
];

const genreList = [
  { group: "By Age", value: "Children's fiction", label: "Children's fiction" },
  { group: "By Age", value: "Fratire fiction", label: "Fratire fiction" },
  { group: "By Age", value: "Lad lit fiction", label: "Lad lit fiction" },
  { group: "By Age", value: "New adult fiction", label: "New adult fiction" },
  {
    group: "By Age",
    value: "Young adult fiction",
    label: "Young adult fiction",
  },
  { group: "Comedy", value: "Comedy", label: "Comedy" },
  { group: "Comedy", value: "Burlesque", label: "Burlesque" },
  { group: "Comedy", value: "Fantasy comedy", label: "Fantasy comedy" },
  { group: "Comedy", value: "Comedy horror", label: "Comedy horror" },
  { group: "Comedy", value: "Parody", label: "Parody" },
  { group: "Comedy", value: "Metaparody", label: "Metaparody" },
  { group: "Comedy", value: "Sci-fi comedy", label: "Sci-fi comedy" },
  { group: "Comedy", value: "Surreal comedy", label: "Surreal comedy" },
  { group: "Comedy", value: "Tall tale comedy", label: "Tall tale comedy" },
  { group: "Comedy", value: "Tragicomedy", label: "Tragicomedy" },
  { group: "Comedy", value: "Satire", label: "Satire" },
  { group: "Comedy", value: "Romantic Comedy", label: "Romantic Comedy" },
  {
    group: "Comedy",
    value: "Science fiction comedy ",
    label: "Science fiction comedy",
  },
];

const levels = ["A0", "A1", "A2", "B1", "B2", "C1", "native"];

function valueLabelFormat(value: number) {
  return levels[value];
}

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
  const [languageLevel, setLanguageLevel] = React.useState(levels.length - 1);
  const [genre, setGenre] = useState({
    group: "Comedy",
    value: "Comedy",
    label: "Comedy",
  });

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
      stage: "exposition",
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
            genre: genre.value,
          });
        } else {
          generatedStory = await handleGenerateStory({
            theme: values.theme,
            form: values.form,
            wordCount,
            stage: values.stage,
            lang: values.language,
            level: values.level,
            genre: genre.value,
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

  const handleChange = (_event: Event, value: number | number[]) => {
    setLanguageLevel(value as number);
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
            <FormLabel className="mb-6">
              About how many words should it have?
            </FormLabel>

            <div className="px-5 my-0 ">
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
            <FormLabel className="mb-3 mt-3">
              What genre should it have?
            </FormLabel>
            <div className="">
              <Autocomplete
                value={genre}
                onChange={(
                  _event,
                  newValue: { group: string; value: string; label: string }
                ) => {
                  setGenre(newValue);
                }}
                disablePortal
                disableClearable
                options={genreList.sort(
                  (a, b) => -b.group.localeCompare(a.group)
                )}
                groupBy={(option) => option.group}
                sx={{
                  width: { sm: "100%", md: 340 },

                  "& .MuiSvgIcon-root": {
                    color: "black",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "thin",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "thin",
                  },
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // <------------------ outline-color by default
                    },
                    "&:hover fieldset": {
                      borderColor: "black", // <------------------ outline-color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // <------------------ outline-color on focus
                    },
                    "&.MuiInputLabel-shrink": {
                      color: "black",
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Genre" variant="standard" />
                )}
              />
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex justify-center bg-gray-100 text-[15px]">
                  Advanced
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-6">
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
                  </div>
                  <div className="mt-5">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            What language should it be written in?
                          </FormLabel>
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
                  </div>

                  <FormLabel className=" mb-0  mt-6">
                    What language level should it have?
                  </FormLabel>
                  <div className="px-5 mb-0 mt-5">
                    <CustomSlider2
                      valueLabelDisplay="on"
                      value={languageLevel}
                      min={0}
                      step={1}
                      max={levels.length - 1}
                      getAriaValueText={valueLabelFormat}
                      valueLabelFormat={valueLabelFormat}
                      onChange={handleChange}
                      aria-labelledby="non-linear-slider"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
