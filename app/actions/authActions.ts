"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { signUpSchema } from "@/lib/zod";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}

export async function handleGithubSignin() {
  await signIn("github", { redirectTo: "/" });
}

export async function handleGoogleSignin() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut();
}

export async function handleSignUp({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!parsedCredentials.success) {
      return { success: false, message: "Invalid data." };
    }

    // check if the email is already taken
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists. Login to continue.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const randomColorHex =
      "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        randomColor: randomColorHex,
      },
    });

    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
