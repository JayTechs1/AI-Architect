"use client";

import { useState } from "react";

const ROLES = ["Architect", "Builder", "Developer", "Designer", "Other"];

export default function DemoRequestForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "Architect",
    message: "",
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
          ✓
        </div>
        <h3 className="mt-5 text-xl font-semibold text-neutral-900">
          Request received
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
          Thanks, {form.name.split(" ")[0] || "there"}. Our team will reach out
          to <span className="font-medium text-neutral-700">{form.email}</span>{" "}
          with your demo access and next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          value={form.name}
          onChange={set("name")}
          placeholder="Jane Doe"
          required
        />
        <Field
          label="Work email"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="jane@studio.com"
          required
        />
        <Field
          label="Company"
          value={form.company}
          onChange={set("company")}
          placeholder="Studio name (optional)"
        />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-600">
            Your role
          </span>
          <select
            value={form.role}
            onChange={(e) => set("role")(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-medium text-neutral-600">
          What would you like to build? (optional)
        </span>
        <textarea
          value={form.message}
          onChange={(e) => set("message")(e.target.value)}
          rows={3}
          placeholder="Tell us a little about your projects…"
          className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </label>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-gradient mt-5 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Request a demo"}
      </button>
      <p className="mt-3 text-center text-xs text-neutral-400">
        No credit card. We&apos;ll set up a private walkthrough for your team.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      />
    </label>
  );
}
