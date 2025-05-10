import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePatientId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CHC-${year}-${randomNum}`;
}

export function getAgeGroup(age: number): string {
  if (age <= 12) return "0-12";
  if (age <= 25) return "13-25";
  if (age <= 45) return "26-45";
  return "46+";
}

export function formatDate(date: string | Date): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
