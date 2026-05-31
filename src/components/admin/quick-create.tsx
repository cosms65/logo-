"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const endpoints = [
  ["Chapter", "/api/admin/chapters"],
  ["Category", "/api/admin/categories"]
] as const;

export function QuickCreate() {
  const [endpoint, setEndpoint] = useState(endpoints[0][1]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = endpoint.includes("chapters")
      ? { title, content: { blocks: [] } }
      : { name: title };
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setMessage(response.ok ? "Created successfully." : "Creation failed. Check required fields and permissions.");
    if (response.ok) setTitle("");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <h2 className="text-xl font-bold text-white">Simple chapter/category create</h2>
      <p className="text-sm text-starlight/70">Characters, articles, timeline entries, factions, and cosmology now use the upload studio above for biography text and images.</p>
      <select value={endpoint} onChange={(event) => setEndpoint(event.target.value)} className="w-full rounded-xl border border-white/10 bg-void p-3 text-white">
        {endpoints.map(([label, value]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title or name" className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
      <Button type="submit">Create</Button>
      {message ? <p className="text-sm text-plasma">{message}</p> : null}
    </form>
  );
}
