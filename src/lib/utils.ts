import { type ClassValue, clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(value: string) {
  return slugify(value, { lower: true, strict: true, trim: true });
}

export function asPlainText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(asPlainText).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(asPlainText).join(" ");
  }
  return String(value);
}
