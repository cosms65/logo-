import { makeSlug } from "@/lib/utils";

type SlugLookup = (slug: string) => Promise<unknown>;

export async function createUniqueSlug(value: string, exists: SlugLookup) {
  const baseSlug = makeSlug(value) || "entry";
  let slug = baseSlug;
  let suffix = 2;

  while (await exists(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
