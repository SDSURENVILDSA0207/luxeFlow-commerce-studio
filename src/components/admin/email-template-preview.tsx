"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { EmailTemplate, EmailTemplateId } from "@/modules/email/types";

type Viewport = "desktop" | "mobile";

type EmailTemplatePreviewProps = {
  templates: EmailTemplate[];
};

export function EmailTemplatePreview({ templates }: EmailTemplatePreviewProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<EmailTemplateId>(templates[0].id);
  const [viewport, setViewport] = useState<Viewport>("desktop");

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId, templates]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      <Card className="h-fit border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-lg">Email Templates</CardTitle>
          <CardDescription>Select a campaign email and preview it in responsive mode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplateId(template.id)}
                className={`premium-ring w-full rounded-lg border p-4 text-left transition-all duration-300 ease-premium ${
                  selectedTemplateId === template.id
                    ? "border-accent/55 bg-accent/15"
                    : "border-border bg-surface-2 hover:border-border-strong"
                }`}
              >
                <p className="text-body-sm font-semibold text-foreground">{template.name}</p>
                <p className="mt-1 text-body-sm text-muted">{template.description}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Viewport</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant={viewport === "desktop" ? "primary" : "secondary"} onClick={() => setViewport("desktop")}>
                Desktop
              </Button>
              <Button size="sm" variant={viewport === "mobile" ? "primary" : "secondary"} onClick={() => setViewport("mobile")}>
                Mobile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-border bg-surface">
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <Badge variant="accent">{selectedTemplate.name}</Badge>
            <p className="text-body-sm text-muted">
              <span className="text-foreground">Subject:</span> {selectedTemplate.subject}
            </p>
            <p className="text-body-sm text-muted">
              <span className="text-foreground">Preheader:</span> {selectedTemplate.preheader}
            </p>
          </CardContent>
        </Card>

        <div
          className={`mx-auto rounded-2xl border border-border-strong bg-[#e6ddd0] p-4 shadow-premium ${
            viewport === "desktop" ? "max-w-[760px]" : "max-w-[390px]"
          }`}
        >
          <iframe
            title={`${selectedTemplate.name} preview`}
            srcDoc={selectedTemplate.html}
            className={`w-full rounded-xl border border-border bg-white ${
              viewport === "desktop" ? "h-[820px]" : "h-[760px]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
