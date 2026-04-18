"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";

export function SettingsWorkspaceForm() {
  const [workspaceName, setWorkspaceName] = useState("LuxeFlow Atelier");
  const [defaultRole, setDefaultRole] = useState("editor");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    window.setTimeout(() => setStatus("saved"), 700);
    window.setTimeout(() => setStatus("idle"), 3200);
  };

  const saving = status === "saving";

  return (
    <form className="min-w-0 space-y-4" onSubmit={onSubmit} aria-busy={saving}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-body-sm text-[#6f6151]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b7b4b]">Workspace name</span>
          <Input
            value={workspaceName}
            disabled={saving}
            onChange={(ev) => {
              setWorkspaceName(ev.target.value);
              if (status === "error") setStatus("idle");
            }}
            className="border-[#ddcfbc] bg-[#fffdf9]"
          />
        </label>
        <label className="space-y-2 text-body-sm text-[#6f6151]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b7b4b]">Default collaborator role</span>
          <Select value={defaultRole} disabled={saving} onChange={(ev) => setDefaultRole(ev.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </Select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? "Saving…" : "Save preferences"}
        </Button>
        {status === "saved" ? (
          <span className="text-body-sm text-[#52765a]" role="status" aria-live="polite">
            Preferences saved locally (demo).
          </span>
        ) : null}
        {status === "error" ? (
          <span className="text-body-sm text-danger" role="alert">
            Workspace name is required.
          </span>
        ) : null}
      </div>
    </form>
  );
}
