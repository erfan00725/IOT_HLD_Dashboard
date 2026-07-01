import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unstable_cache as cache } from "next/cache";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nextCache = <T = any>(
  fn: () => Promise<T>,
  key: string,
  revalidate: number = 20,
) => {
  return cache(fn, [key], { revalidate })();
};
