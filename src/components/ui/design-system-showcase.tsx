"use client";

import { useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Modal, Select, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableWrapper, Tabs } from "@/components/ui";

export function DesignSystemShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Buttons & Badges</CardTitle>
          <CardDescription>Soft premium hierarchy for primary actions and subtle secondary controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="accent">Premium</Badge>
            <Badge variant="success">Live</Badge>
            <Badge variant="warning">Scheduled</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>High-end form controls with clean focus and depth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Campaign title" />
            <Input placeholder="Collection name" />
            <Select defaultValue="email">
              <option value="email">Email Campaign</option>
              <option value="landing">Landing Page</option>
              <option value="social">Social Activation</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Subtle dialog style for approvals and high-impact actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Open Preview Modal
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs
        items={[
          {
            id: "overview",
            label: "Overview",
            content: <p>Use this system for storefront and admin surfaces to maintain a consistent luxury brand tone.</p>
          },
          {
            id: "typography",
            label: "Typography",
            content: <p>Display serif for storytelling, sans-serif body for clarity, generous line-height for elegance.</p>
          },
          {
            id: "interaction",
            label: "Interaction",
            content: <p>Prefer smooth premium transitions, restrained motion, and clear focus rings for accessibility.</p>
          }
        ]}
      />

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Token</TableHeaderCell>
              <TableHeaderCell>Purpose</TableHeaderCell>
              <TableHeaderCell>Example</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>surface</TableCell>
              <TableCell>Primary container background</TableCell>
              <TableCell>Cards, modal body</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>accent</TableCell>
              <TableCell>Premium action/brand highlight</TableCell>
              <TableCell>Primary buttons, emphasis</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>border-strong</TableCell>
              <TableCell>Structure and visual separation</TableCell>
              <TableCell>Focused controls, table edges</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableWrapper>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Campaign Approval"
        description="Confirm launch settings for the Signature Sapphire campaign."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Approve</Button>
          </div>
        }
      >
        <p>This modal style is designed for premium workflows with clear action hierarchy and restrained visual noise.</p>
      </Modal>
    </div>
  );
}
