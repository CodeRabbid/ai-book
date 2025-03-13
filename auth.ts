import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { signInSchema } from "./lib/zod";
import prisma from "./lib/prisma";
import bcryptjs from "bcryptjs";

const publicRoutesRegex =
  /^\/(auth\/signin|auth\/signup|story\/\S+|create\/sequel\/\S+)*$/g;
const authRoutes = ["/auth/signin", "/auth/signup"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        let user = null;

        // validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }
        // get user

        user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        if (!user.password) {
          console.log(
            "User has no password. They probably signed up with an oauth provider."
          );
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      let existingUser = await prisma.user.findFirst({
        where: { email: user.email as string },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            name: user.name as string,
            email: user.email as string,
            image: user.image,
          },
        });
      }
      user.id = existingUser.id;
      user.randomColor = existingUser.randomColor;

      return true;
    },
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Allow access to public routes for all users
      if (pathname.match(publicRoutesRegex)) {
        return true;
      }

      // Redirect logged-in users away from auth routes
      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true; // Allow access to auth pages if not logged in
      }

      // Allow access if the user is authenticated
      return isLoggedIn;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
