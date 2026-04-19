"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminEmptyRow,
  AdminGhostButton,
  AdminModal,
  AdminPrimaryButton,
  AdminSection,
  adminInputClass,
  adminSelectClass,
  adminTableWrapClass,
  adminTdClass,
  adminThClass
} from "@/components/inventory-admin/jewelry-admin-ui";
import { formatUsd } from "@/lib/jewelry-inventory/format-usd";
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";

type QuoteRow = {
  id: string;
  quoteNumber: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  totalCents: number;
  customer: { id: string; businessName: string; email: string };
  lines: { quantity: number; inventoryItem: { sku: string; name: string } }[];
};

type CustomerMini = { id: string; businessName: string };
type InvMini = { id: string; sku: string; name: string };

const quoteStatuses = ["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"] as const;

export function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [customers, setCustomers] = useState<CustomerMini[]>([]);
  const [inventory, setInventory] = useState<InvMini[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    quote: {
      quoteNumber: string;
      validUntil: string | null;
      notes: string | null;
      customer: { businessName: string };
      lines: { quantity: number; inventoryItem: { sku: string; name: string } }[];
      orders: { id: string; orderNumber: string; status: string }[];
    };
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerId: "",
    validUntil: "",
    notes: "",
    lines: [{ inventoryItemId: "", quantity: 1, unitPriceDollars: "" }]
  });

  const loadLists = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [qRes, cRes, iRes] = await Promise.all([
        jewelryAdminFetch("/api/admin/jewelry/quotes"),
        jewelryAdminFetch("/api/admin/jewelry/customers"),
        jewelryAdminFetch("/api/admin/jewelry/inventory")
      ]);
      if (qRes.status === 401 || cRes.status === 401 || iRes.status === 401) return;
      if (!qRes.ok || !cRes.ok || !iRes.ok) {
        setError("Could not load quotes.");
        return;
      }
      const qJson = (await qRes.json()) as { quotes: QuoteRow[] };
      const cJson = (await cRes.json()) as { customers: CustomerMini[] };
      const iJson = (await iRes.json()) as { items: InvMini[] };
      setQuotes(qJson.quotes);
      setCustomers(cJson.customers);
      setInventory(iJson.items.map((x) => ({ id: x.id, sku: x.sku, name: x.name })));
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void loadLists();
    });
    return () => cancelAnimationFrame(id);
  }, [loadLists]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    setDetailError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/quotes/${id}`);
      if (res.status === 401) return;
      if (!res.ok) {
        setDetailError("Could not load quote detail.");
        return;
      }
      const data = (await res.json()) as typeof detail;
      setDetail(data);
    } catch {
      setDetailError("Could not load quote detail.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (detailId) void loadDetail(detailId);
      else {
        setDetail(null);
        setDetailLoading(false);
        setDetailError(null);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [detailId, loadDetail]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return quotes;
    return quotes.filter((x) => x.quoteNumber.toLowerCase().includes(q) || x.customer.businessName.toLowerCase().includes(q));
  }, [quotes, filter]);

  const patchStatus = async (id: string, status: (typeof quoteStatuses)[number]) => {
    setError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not update quote status.");
        return;
      }
      await loadLists();
      if (detailId === id) void loadDetail(id);
    } catch {
      setError("Network error.");
    }
  };

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { inventoryItemId: "", quantity: 1, unitPriceDollars: "" }] }));

  const submitQuote = async () => {
    setSaving(true);
    setError(null);
    try {
      const lines = form.lines
        .filter((l) => l.inventoryItemId)
        .map((l) => ({
          inventoryItemId: l.inventoryItemId,
          quantity: l.quantity,
          unitPriceCents: Math.round(Number(l.unitPriceDollars || "0") * 100)
        }));
      if (!form.customerId || lines.length === 0) {
        setError("Choose a customer and at least one line with SKU and price.");
        setSaving(false);
        return;
      }
      const body: Record<string, unknown> = {
        customerId: form.customerId,
        notes: form.notes.trim() || null,
        lines
      };
      if (form.validUntil) body.validUntil = new Date(form.validUntil).toISOString();
      const res = await jewelryAdminFetch("/api/admin/jewelry/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.status === 401) return;
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Could not create quote.");
        return;
      }
      setModalOpen(false);
      setForm({ customerId: "", validUntil: "", notes: "", lines: [{ inventoryItemId: "", quantity: 1, unitPriceDollars: "" }] });
      await loadLists();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminSection title="Quotes" description="Trade quotes with line-level SKU pricing. Accepted quotes can feed orders." actions={<AdminPrimaryButton onClick={() => setModalOpen(true)}>New quote</AdminPrimaryButton>}>
        {error ? (
          <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <input
            className={`${adminInputClass} max-w-md`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by quote # or customer…"
            aria-label="Filter quotes by number or customer"
          />
          <p className="text-sm text-[#78909c]">{loading ? "Loading…" : `${filtered.length} quote(s)`}</p>
        </div>
        <div className={adminTableWrapClass}>
          <table className="min-w-[960px] w-full border-collapse">
            <thead>
              <tr>
                <th className={adminThClass}>Quote</th>
                <th className={adminThClass}>Customer</th>
                <th className={adminThClass}>Lines</th>
                <th className={adminThClass}>Total</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="border-b border-[#eceff1] px-4 py-10 text-center text-sm text-[#78909c]">
                    Loading quotes…
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <AdminEmptyRow
                  colSpan={6}
                  title={quotes.length === 0 ? "No quotes yet" : "No matches"}
                  hint={quotes.length === 0 ? "Create a quote for a B2B customer." : "Try another filter."}
                />
              ) : null}
              {!loading &&
                filtered.map((q) => (
                <tr key={q.id} className="hover:bg-[#fafbfc]">
                  <td className={`${adminTdClass} font-mono text-xs`}>{q.quoteNumber}</td>
                  <td className={adminTdClass}>{q.customer.businessName}</td>
                  <td className={adminTdClass}>{q.lines.length}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{formatUsd(q.totalCents)}</td>
                  <td className={adminTdClass}>
                    <select
                      className={`${adminSelectClass} max-w-[14rem]`}
                      value={q.status}
                      onChange={(e) => void patchStatus(q.id, e.target.value as QuoteRow["status"])}
                      aria-label={`Quote status ${q.quoteNumber}`}
                    >
                      {quoteStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`${adminTdClass} whitespace-nowrap`}>
                    <button
                      type="button"
                      className="inline-flex min-h-10 items-center text-sm font-medium text-[#1565c0] hover:underline"
                      onClick={() => {
                        setDetailError(null);
                        setDetailId(detailId === q.id ? null : q.id);
                      }}
                    >
                      {detailId === q.id ? "Hide detail" : "View detail"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {detailId && detailLoading ? (
          <div className="mt-6 rounded-xl border border-[#cfd8dc] bg-[#fafbfc] px-4 py-8 text-center text-sm text-[#78909c]">
            Loading quote detail…
          </div>
        ) : null}
        {detailId && !detailLoading && detailError ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-900" role="alert">
            {detailError}
          </div>
        ) : null}
        {detailId && !detailLoading && detail?.quote ? (
          <div className="mt-6 rounded-xl border border-[#cfd8dc] bg-[#fafbfc] p-4">
            <p className="font-display text-base text-[#263238]">{detail.quote.quoteNumber}</p>
            <p className="mt-1 text-sm text-[#546e7a]">
              Customer: {detail.quote.customer.businessName} · Valid until: {detail.quote.validUntil ? new Date(detail.quote.validUntil).toLocaleDateString() : "—"}
            </p>
            {detail.quote.notes ? <p className="mt-2 text-sm text-[#455a64]">{detail.quote.notes}</p> : null}
            <ul className="mt-3 space-y-1 text-sm">
              {detail.quote.lines.map((l, idx) => (
                <li key={`${l.inventoryItem.sku}-${idx}`}>
                  {l.inventoryItem.sku} — {l.inventoryItem.name} × {l.quantity}
                </li>
              ))}
            </ul>
            {detail.quote.orders?.length ? (
              <div className="mt-4 border-t border-[#eceff1] pt-3">
                <p className="text-[11px] font-semibold uppercase text-[#78909c]">Linked orders</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {detail.quote.orders.map((o) => (
                    <li key={o.id}>
                      {o.orderNumber} ({o.status})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#78909c]">No orders linked yet — create an order from Orders with this quote selected when accepted.</p>
            )}
          </div>
        ) : null}
      </AdminSection>

      <AdminModal
        open={modalOpen}
        title="New trade quote"
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <AdminGhostButton onClick={() => setModalOpen(false)}>Cancel</AdminGhostButton>
            <AdminPrimaryButton
              onClick={() => void submitQuote()}
              disabled={saving || customers.length === 0 || inventory.length === 0}
            >
              {saving ? "Creating…" : "Create quote"}
            </AdminPrimaryButton>
          </div>
        }
      >
        <div className="space-y-4">
          {customers.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Add a B2B customer before creating a quote.
            </p>
          ) : null}
          {inventory.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Add inventory SKUs before line items can be priced.
            </p>
          ) : null}
          <label className="text-sm text-[#546e7a]">
            Customer
            <select
              className={`${adminSelectClass} mt-1`}
              value={form.customerId}
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
              disabled={customers.length === 0}
            >
              <option value="">— Select —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[#546e7a]">
            Valid until (optional)
            <input className={`${adminInputClass} mt-1`} type="datetime-local" value={form.validUntil} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Notes
            <textarea className={`${adminInputClass} mt-1 min-h-[72px]`} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </label>
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[#37474f]">Lines</p>
              <button type="button" className="text-sm font-medium text-[#1565c0] hover:underline" onClick={addLine}>
                + Add line
              </button>
            </div>
            <div className="mt-2 space-y-3">
              {form.lines.map((line, idx) => (
                <div key={idx} className="grid gap-2 rounded-lg border border-[#eceff1] p-3 sm:grid-cols-3">
                  <label className="text-xs text-[#78909c] sm:col-span-3">
                    SKU
                    <select className={`${adminSelectClass} mt-1`} value={line.inventoryItemId} onChange={(e) => {
                      const lines = [...form.lines];
                      lines[idx] = { ...lines[idx], inventoryItemId: e.target.value };
                      setForm((f) => ({ ...f, lines }));
                    }}>
                      <option value="">— Select inventory —</option>
                      {inventory.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.sku} — {inv.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-[#78909c]">
                    Qty
                    <input
                      type="number"
                      min={1}
                      className={`${adminInputClass} mt-1`}
                      value={line.quantity}
                      onChange={(e) => {
                        const lines = [...form.lines];
                        lines[idx] = { ...lines[idx], quantity: Number(e.target.value) };
                        setForm((f) => ({ ...f, lines }));
                      }}
                    />
                  </label>
                  <label className="text-xs text-[#78909c] sm:col-span-2">
                    Unit price (USD)
                    <input
                      className={`${adminInputClass} mt-1`}
                      inputMode="decimal"
                      value={line.unitPriceDollars}
                      onChange={(e) => {
                        const lines = [...form.lines];
                        lines[idx] = { ...lines[idx], unitPriceDollars: e.target.value };
                        setForm((f) => ({ ...f, lines }));
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
