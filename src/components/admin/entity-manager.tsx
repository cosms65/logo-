"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ManagedType = "articles" | "characters" | "timeline" | "cosmology";

type ManagedEntity = {
  id: string;
  title?: string;
  name?: string;
  status?: string;
  renderedText?: string;
  slug?: string;
};

const configs: Record<ManagedType, { label: string; endpoint: string; titleKey: "title" | "name"; bodyKey: "content" | "biography" | "description" | "summary"; publicBase: string }> = {
  articles: { label: "Articles", endpoint: "/api/admin/articles", titleKey: "title", bodyKey: "content", publicBase: "/wiki" },
  characters: { label: "Characters", endpoint: "/api/admin/characters", titleKey: "name", bodyKey: "biography", publicBase: "/characters" },
  timeline: { label: "Timeline", endpoint: "/api/admin/timeline", titleKey: "title", bodyKey: "description", publicBase: "/timeline#" },
  cosmology: { label: "Cosmology", endpoint: "/api/admin/cosmology", titleKey: "title", bodyKey: "summary", publicBase: "/cosmology" }
};

function getTitle(item: ManagedEntity) {
  return item.title || item.name || "Untitled";
}

export function EntityManager() {
  const [type, setType] = useState<ManagedType>("articles");
  const [items, setItems] = useState<ManagedEntity[]>([]);
  const [editing, setEditing] = useState<ManagedEntity | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [message, setMessage] = useState("");
  const config = configs[type];

  async function load() {
    setMessage("");
    const response = await fetch(config.endpoint);
    if (!response.ok) {
      setMessage("Could not load entries.");
      return;
    }
    setItems(await response.json() as ManagedEntity[]);
  }

  useEffect(() => { void load(); }, [type]);

  function startEdit(item: ManagedEntity) {
    setEditing(item);
    setTitle(getTitle(item));
    setBody(item.renderedText || "");
    setStatus(item.status || "PUBLISHED");
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const payload: Record<string, unknown> = {
      [config.titleKey]: title,
      [config.bodyKey]: { type: "plain-text", text: body }
    };
    if (type === "articles") payload.status = status;
    if (type === "characters") payload.status = status;
    const response = await fetch(`${config.endpoint}/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setMessage(response.ok ? "Entry updated." : "Update failed.");
    if (response.ok) {
      setEditing(null);
      await load();
    }
  }

  async function deleteItem(item: ManagedEntity) {
    if (!window.confirm(`Delete "${getTitle(item)}"? This cannot be undone.`)) return;
    const response = await fetch(`${config.endpoint}/${item.id}`, { method: "DELETE" });
    setMessage(response.ok ? "Entry deleted." : "Delete failed.");
    if (response.ok) await load();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Edit and delete content</h2>
          <p className="mt-2 text-sm text-starlight/70">Manage existing characters, articles, timeline entries, and cosmology records.</p>
        </div>
        <select value={type} onChange={(event) => setType(event.target.value as ManagedType)} className="rounded-xl border border-white/10 bg-void p-3 text-white">
          {Object.entries(configs).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
        </select>
      </div>

      {editing ? (
        <form onSubmit={saveEdit} className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-void/60 p-4">
          <h3 className="font-semibold text-white">Editing: {getTitle(editing)}</h3>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
          {(type === "articles" || type === "characters") ? <input value={status} onChange={(event) => setStatus(event.target.value)} placeholder="Status" className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" /> : null}
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={8} className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save changes</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        {items.length ? items.map((item) => (
          <div key={item.id} className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-semibold text-white">{getTitle(item)}</p>
              <p className="mt-1 line-clamp-2 text-sm text-starlight/60">{item.renderedText || "No body text yet."}</p>
              {item.slug ? <a href={type === "timeline" ? `${config.publicBase}${item.slug}` : `${config.publicBase}/${item.slug}`} className="mt-2 inline-block text-xs text-plasma hover:text-white" target="_blank">Open public page</a> : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => startEdit(item)}>Edit</Button>
              <Button type="button" variant="ghost" onClick={() => deleteItem(item)} className="border-red-400/30 text-red-200 hover:bg-red-500/10">Delete</Button>
            </div>
          </div>
        )) : <p className="p-4 text-sm text-starlight/70">No entries yet.</p>}
      </div>
      {message ? <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-plasma">{message}</p> : null}
    </section>
  );
}
