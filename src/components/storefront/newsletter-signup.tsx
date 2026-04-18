"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 650);
  };

  return (
    <form
      className="grid w-full min-w-0 gap-3 sm:grid-cols-[1fr_auto]"
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "loading"}
    >
      <input
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        disabled={status === "loading"}
        onChange={(ev) => {
          setEmail(ev.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        placeholder="Enter your email"
        aria-invalid={status === "error"}
        aria-describedby={status === "error" ? "newsletter-hint" : status === "success" ? "newsletter-success" : undefined}
        className={cn(
          "premium-ring h-11 min-w-0 rounded-lg border bg-surface-2 px-3 text-body-sm text-foreground transition-[border-color,opacity] duration-200 placeholder:text-muted/80 disabled:cursor-not-allowed disabled:opacity-60",
          status === "error" ? "border-danger/60 focus-visible:border-danger" : "border-border"
        )}
      />
      <Button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? "Joining…" : "Subscribe"}
      </Button>
      {status === "error" ? (
        <p id="newsletter-hint" role="alert" className="sm:col-span-2 text-body-sm text-danger">
          Please enter a valid email address.
        </p>
      ) : null}
      {status === "success" ? (
        <p id="newsletter-success" role="status" aria-live="polite" className="sm:col-span-2 text-body-sm text-success">
          You&apos;re on the list. We&apos;ll send editorial drops and private offers to your inbox.
        </p>
      ) : null}
    </form>
  );
}
