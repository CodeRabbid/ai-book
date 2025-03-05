"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import ErrorMessage from "@/components/ErrorMessage";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import {
  handleCredentialsSignin,
  handleGithubSignin,
  handleGoogleSignin,
  handleSignUp,
} from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleSignUp(values);
      if (result.success) {
        console.log("Account created successfully.");
        const valuesForSignin = {
          email: values.email,
          password: values.password,
        };
        await handleCredentialsSignin(valuesForSignin);
      } else {
        setGlobalError(result.message);
      }
    } catch (error) {
      setGlobalError("An unexpected error occurred. Please try again." + error);
    }
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field == "confirmPassword"
                          ? "Confirm Pasword"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            ["password", "confirmPassword"].includes(field)
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={form.formState.isSubmitting}>
                Sign up
              </LoadingButton>
            </form>
          </Form>
          <span className="text-sm text-gray-500 text-center block my-2">
            or
          </span>
          <form className="w-full" action={handleGithubSignin}>
            <Button variant="outline" className="w-full" type="submit">
              <GitHubLogoIcon className="h-4 w-4 mr-2" />
              Continue with GitHub
            </Button>
          </form>
          <form className="w-full mt-2" action={handleGoogleSignin}>
            <Button variant="outline" className="w-full" type="submit">
              <FcGoogle className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
