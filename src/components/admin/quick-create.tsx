"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const endpoints = [
  ["Article", "/api/admin/articles"],
  ["Character", "/api/admin/characters"],
  ["Faction", "/api/admin/factions"],
  ["Chapter", "/api/admin/chapters"],
  ["Category", "/api/admin/categories"],
  ["Timeline", "/api/admin/timeline"]
] as const;

export function QuickCreate() {
  const [endpoint, setEndpoint] = useState(endpoints[0][1]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = endpoint.includes("chapters")
      ? { title, number: Date.now(), content: { blocks: [] } }
      : endpoint.includes("categories")
        ? { name: title }
        : endpoint.includes("characters") || endpoint.includes("factions")
          ? { name: title }
          : { title, content: { blocks: [] } };
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setMessage(response.ok ? "Created successfully." : "Creation failed. Check required fields and permissions.");
    if (response.ok) setTitle("");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-bold text-white">Quick create framework entry</h2>
      <p className="text-sm text-starlight/70">Use this lightweight form to verify workflows. Replace with a full rich text editor integration when you choose an editor package.</p>
      <select value={endpoint} onChange={(event) => setEndpoint(event.target.value)} className="w-full rounded-xl border border-white/10 bg-void p-3 text-white">
        {endpoints.map(([label, value]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title or name" className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" />
      <Button type="submit">Create</Button>
      {message ? <p className="text-sm text-plasma">{message}</p> : null}
    </form>
  );
}
