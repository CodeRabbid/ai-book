import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToPeriod(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.5);
  const years = Math.floor(days / 365.25);

  return years > 0
    ? years + ` year${years > 1 ? "s" : ""} ago`
    : months > 0
    ? months + ` month${months > 1 ? "s" : ""} ago`
    : weeks > 0
    ? weeks + ` week${weeks > 1 ? "s" : ""} ago`
    : days > 0
    ? days + ` day${days > 1 ? "s" : ""} ago`
    : hours > 0
    ? hours + ` hour${hours > 1 ? "s" : ""} ago`
    : minutes > 0
    ? minutes + ` minute${minutes > 1 ? "s" : ""} ago`
    : seconds > 10
    ? seconds + ` second${seconds > 1 ? "s" : ""} ago`
    : "Just now";
}

export const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
};

export const generateRandomMood = () => {
  return [
    "Thoughtful",
    "Insightful",
    "Encouraging",
    "Helpful",
    "Supportive",
    "Clever",
    "Persuasive",
    "Informative",
    "Clear",
    "Witty",
    "Concise",
    "Relevant",
    "Respectful",
    "Well-reasoned",
    "Detailed",
    "Engaging",
    "Objective",
    "Polite",
    "Constructive",
    "Friendly",
    "Harsh",
    "Rude",
    "Dismissive",
    "Unhelpful",
    "Condescending",
    "Biased",
    "Aggressive",
    "Confusing",
    "Misleading",
    "Offensive",
    "Sarcastic",
    "Blunt",
    "Overcritical",
    "Redundant",
    "Unclear",
    "Inflammatory",
    "Unfair",
    "Harshly worded",
    "Insensitive",
    "Unwarranted",
    "Hilarious",
    "Cheeky",
    "Sarcastic",
    "Witty",
    "Lighthearted",
    "Punny",
    "Quirky",
    "Satirical",
    "Jovial",
    "Entertaining",
    "Scholarly",
    "Logical",
    "Rational",
    "Well-researched",
    "Profound",
    "Philosophical",
    "Academic",
    "Analytical",
    "Theoretical",
    "Methodical",
    "Brief",
    "Concise",
    "Minimalist",
    "Direct",
    "Succinct",
    "Blunt",
    "Pithy",
    "Straightforward",
    "To-the-point",
    "Curt",
    "Passionate",
    "Emotional",
    "Excited",
    "Heartfelt",
    "Empathetic",
    "Intense",
    "Enthusiastic",
    "Overjoyed",
    "Sentimental",
    "Dramatic",
    "Cryptic",
    "Mysterious",
    "Evasive",
    "Indirect",
    "Uncertain",
    "Rambling",
    "Open-ended",
    "Noncommittal",
    "Vague",
    "Confusing",
    "Passive-aggressive",
    "Snarky",
    "Backhanded",
    "Subtle",
    "Nitpicky",
    "Pretentious",
    "Arrogant",
    "Contradictory",
    "Dismissive",
    "Condescending",
  ][Math.floor(Math.random() * 100)];
};
