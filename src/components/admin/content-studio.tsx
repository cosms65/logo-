"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type EntityType = "character" | "article" | "timeline" | "faction" | "cosmology";

type ImageField = {
  key: string;
  label: string;
  usage: string;
  helper: string;
};

type EntityConfig = {
  label: string;
  endpoint: string;
  titleLabel: string;
  titleKey: "title" | "name";
  bodyLabel: string;
  bodyKey: "content" | "biography" | "description" | "summary";
  images: ImageField[];
};

const configs: Record<EntityType, EntityConfig> = {
  character: {
    label: "Character",
    endpoint: "/api/admin/characters",
    titleLabel: "Character name",
    titleKey: "name",
    bodyLabel: "Biography",
    bodyKey: "biography",
    images: [
      { key: "bannerImageId", label: "Landscape banner", usage: "character-banner", helper: "Wide landscape image for the top of the character page." },
      { key: "portraitImageId", label: "Portrait image", usage: "character-portrait", helper: "Vertical or square character artwork." }
    ]
  },
  article: {
    label: "Article",
    endpoint: "/api/admin/articles",
    titleLabel: "Article title",
    titleKey: "title",
    bodyLabel: "Article body",
    bodyKey: "content",
    images: [{ key: "bannerImageId", label: "Article banner", usage: "article-banner", helper: "Wide landscape image for this article." }]
  },
  timeline: {
    label: "Timeline",
    endpoint: "/api/admin/timeline",
    titleLabel: "Event title",
    titleKey: "title",
    bodyLabel: "Event biography / description",
    bodyKey: "description",
    images: [{ key: "bannerImageId", label: "Timeline banner", usage: "timeline-banner", helper: "Wide landscape image for this timeline entry." }]
  },
  faction: {
    label: "Faction",
    endpoint: "/api/admin/factions",
    titleLabel: "Faction name",
    titleKey: "name",
    bodyLabel: "Faction biography / description",
    bodyKey: "description",
    images: [
      { key: "bannerId", label: "Faction banner", usage: "faction-banner", helper: "Wide landscape image for the faction page." },
      { key: "logoId", label: "Faction logo", usage: "faction-logo", helper: "Square logo or symbol for this faction." }
    ]
  },
  cosmology: {
    label: "Cosmology",
    endpoint: "/api/admin/cosmology",
    titleLabel: "Cosmology title",
    titleKey: "title",
    bodyLabel: "Cosmology biography / summary",
    bodyKey: "summary",
    images: [{ key: "bannerImageId", label: "Cosmology banner", usage: "cosmology-banner", helper: "Wide landscape image for this cosmology entry." }]
  }
};

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ContentStudio() {
  const [entityType, setEntityType] = useState<EntityType>("character");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const config = configs[entityType];
  const acceptedRatio = useMemo(() => entityType === "character" ? "Banner: 16:9 or 21:9. Portrait: 3:4 or square." : "Recommended banner: 16:9 or 21:9 landscape.", [entityType]);

  async function uploadImage(form: HTMLFormElement, field: ImageField) {
    const input = form.elements.namedItem(field.key) as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return undefined;
    const fileData = await toDataUrl(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: fileData, altText: `${title} ${field.label}`, usage: field.usage })
    });
    if (!response.ok) throw new Error(`Could not upload ${field.label}`);
    const asset = await response.json() as { id: string };
    return asset.id;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const form = event.currentTarget;
      const imageEntries = await Promise.all(config.images.map(async (field) => [field.key, await uploadImage(form, field)] as const));
      const imagePayload = Object.fromEntries(imageEntries.filter(([, value]) => Boolean(value)));
      const payload: Record<string, unknown> = {
        [config.titleKey]: title,
        [config.bodyKey]: { type: "plain-text", text: body },
        ...imagePayload
      };
      if (entityType === "character" && status) payload.status = status;
      if (entityType === "article") payload.status = "DRAFT";

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Could not create entry");
      setTitle("");
      setBody("");
      setStatus("");
      form.reset();
      setMessage(`${config.label} created with uploaded images.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Creation failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content upload studio</h2>
          <p className="mt-2 text-sm text-starlight/70">Create character, article, timeline, faction, and cosmology entries with biography text plus banner/portrait/logo uploads.</p>
        </div>
        <select value={entityType} onChange={(event) => setEntityType(event.target.value as EntityType)} className="rounded-xl border border-white/10 bg-void p-3 text-white">
          {Object.entries(configs).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-starlight/80">
            {config.titleLabel}
            <input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder={config.titleLabel} className="mt-2 w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
          </label>
          {entityType === "character" ? <label className="block text-sm font-semibold text-starlight/80">Status<input value={status} onChange={(event) => setStatus(event.target.value)} placeholder="Optional status" className="mt-2 w-full rounded-xl border border-white/10 bg-void p-3 text-white" /></label> : null}
          <label className="block text-sm font-semibold text-starlight/80">
            {config.bodyLabel}
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={9} placeholder="Write your manually authored text here." className="mt-2 w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
          </label>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-void/50 p-4">
          <p className="text-sm text-starlight/70">{acceptedRatio}</p>
          {config.images.map((field) => (
            <label key={field.key} className="block rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm font-semibold text-starlight/80">
              {field.label}
              <span className="mt-1 block text-xs font-normal text-starlight/55">{field.helper}</span>
              <input name={field.key} type="file" accept="image/*" className="mt-3 w-full rounded-lg bg-white/5 p-2 text-sm text-starlight file:mr-3 file:rounded-lg file:border-0 file:bg-eclipse file:px-3 file:py-2 file:text-white" />
            </label>
          ))}
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Saving..." : `Create ${config.label}`}</Button>
          {message ? <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-plasma">{message}</p> : null}
        </div>
      </div>
    </form>
  );
}
