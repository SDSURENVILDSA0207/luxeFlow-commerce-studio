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
  adminThClass,
  StatusPill
} from "@/components/inventory-admin/jewelry-admin-ui";
import { formatUsd } from "@/lib/jewelry-inventory/format-usd";
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: "DRAFT" | "CONFIRMED" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  fulfillmentStatus: "UNFULFILLED" | "PARTIAL" | "FULFILLED";
  totalCents: number;
  customer: { id: string; businessName: string; email: string };
  quote: { id: string; quoteNumber: string; status: string } | null;
  lines: { quantity: number; quantityFulfilled: number; inventoryItem: { sku: string; name: string } }[];
};

type CustomerMini = { id: string; businessName: string };
type InvMini = { id: string; sku: string; name: string };
type QuoteMini = { id: string; quoteNumber: string; customerId: string; status: string };

const orderStatuses = ["DRAFT", "CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [customers, setCustomers] = useState<CustomerMini[]>([]);
  const [inventory, setInventory] = useState<InvMini[]>([]);
  const [quotesList, setQuotesList] = useState<QuoteMini[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    quoteId: "",
    notes: "",
    lines: [{ inventoryItemId: "", quantity: 1, unitPriceDollars: "" }]
  });

  const loadLists = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [oRes, cRes, iRes, qRes] = await Promise.all([
        jewelryAdminFetch("/api/admin/jewelry/orders"),
        jewelryAdminFetch("/api/admin/jewelry/customers"),
        jewelryAdminFetch("/api/admin/jewelry/inventory"),
        jewelryAdminFetch("/api/admin/jewelry/quotes")
      ]);
      if (oRes.status === 401 || cRes.status === 401 || iRes.status === 401 || qRes.status === 401) return;
      if (!oRes.ok || !cRes.ok || !iRes.ok || !qRes.ok) {
        setError("Could not load orders.");
        return;
      }
      const oJson = (await oRes.json()) as { orders: OrderRow[] };
      const cJson = (await cRes.json()) as { customers: CustomerMini[] };
      const iJson = (await iRes.json()) as { items: InvMini[] };
      const qJson = (await qRes.json()) as { quotes: { id: string; quoteNumber: string; customerId: string; status: string }[] };
      setOrders(oJson.orders);
      setCustomers(cJson.customers);
      setInventory(iJson.items.map((x) => ({ id: x.id, sku: x.sku, name: x.name })));
      setQuotesList(qJson.quotes);
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

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((x) => x.orderNumber.toLowerCase().includes(q) || x.customer.businessName.toLowerCase().includes(q));
  }, [orders, filter]);

  const quotesForCustomer = useMemo(() => {
    if (!form.customerId) return [];
    return quotesList.filter((q) => q.customerId === form.customerId && (q.status === "ACCEPTED" || q.status === "SENT"));
  }, [quotesList, form.customerId]);

  const patchOrder = async (id: string, status: (typeof orderStatuses)[number]) => {
    setError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.status === 401) return;
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Could not update order.");
        return;
      }
      await loadLists();
    } catch {
      setError("Network error.");
    }
  };

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { inventoryItemId: "", quantity: 1, unitPriceDollars: "" }] }));

  const submitOrder = async () => {
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
        setError("Choose a customer and at least one line.");
        setSaving(false);
        return;
      }
      const body: Record<string, unknown> = {
        customerId: form.customerId,
        notes: form.notes.trim() || null,
        lines
      };
      if (form.quoteId) body.quoteId = form.quoteId;
      const res = await jewelryAdminFetch("/api/admin/jewelry/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.status === 401) return;
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Could not create order.");
        return;
      }
      setModalOpen(false);
      setForm({ customerId: "", quoteId: "", notes: "", lines: [{ inventoryItemId: "", quantity: 1, unitPriceDollars: "" }] });
      await loadLists();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const fulfillTone = (f: OrderRow["fulfillmentStatus"]): "ok" | "warn" | "neutral" => {
    if (f === "FULFILLED") return "ok";
    if (f === "PARTIAL") return "warn";
    return "neutral";
  };

  return (
    <>
      <AdminSection
        title="Orders"
        description="Confirm orders to reserve stock; ship or deliver to deduct inventory. Lines show fulfillment progress."
        actions={<AdminPrimaryButton onClick={() => setModalOpen(true)}>New order</AdminPrimaryButton>}
      >
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
            placeholder="Filter by order # or customer…"
            aria-label="Filter orders by number or customer"
          />
          <p className="text-sm text-[#78909c]">{loading ? "Loading…" : `${filtered.length} order(s)`}</p>
        </div>
        <div className={adminTableWrapClass}>
          <table className="min-w-[1024px] w-full border-collapse">
            <thead>
              <tr>
                <th className={adminThClass}>Order</th>
                <th className={adminThClass}>Customer</th>
                <th className={adminThClass}>Quote</th>
                <th className={adminThClass}>Lines</th>
                <th className={adminThClass}>Total</th>
                <th className={adminThClass}>Fulfillment</th>
                <th className={adminThClass}>Order status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="border-b border-[#eceff1] px-4 py-10 text-center text-sm text-[#78909c]">
                    Loading orders…
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <AdminEmptyRow
                  colSpan={7}
                  title={orders.length === 0 ? "No orders yet" : "No matches"}
                  hint={orders.length === 0 ? "Create an order from a quote or from scratch." : "Try another filter."}
                />
              ) : null}
              {!loading &&
                filtered.map((o) => (
                <tr key={o.id} className="hover:bg-[#fafbfc]">
                  <td className={`${adminTdClass} font-mono text-xs`}>{o.orderNumber}</td>
                  <td className={adminTdClass}>{o.customer.businessName}</td>
                  <td className={adminTdClass}>{o.quote ? o.quote.quoteNumber : "—"}</td>
                  <td className={adminTdClass}>{o.lines.length}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{formatUsd(o.totalCents)}</td>
                  <td className={adminTdClass}>
                    <StatusPill tone={fulfillTone(o.fulfillmentStatus)}>{o.fulfillmentStatus}</StatusPill>
                  </td>
                  <td className={adminTdClass}>
                    <select
                      className={`${adminSelectClass} max-w-[14rem]`}
                      value={o.status}
                      onChange={(e) => void patchOrder(o.id, e.target.value as (typeof orderStatuses)[number])}
                      aria-label={`Order status ${o.orderNumber}`}
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminModal
        open={modalOpen}
        title="Create trade order"
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <AdminGhostButton onClick={() => setModalOpen(false)}>Cancel</AdminGhostButton>
            <AdminPrimaryButton onClick={() => void submitOrder()} disabled={saving || customers.length === 0}>
              {saving ? "Creating…" : "Create order"}
            </AdminPrimaryButton>
          </div>
        }
      >
        <div className="space-y-4">
          {customers.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Add a B2B customer under Customers before creating an order.
            </p>
          ) : null}
          <label className="text-sm text-[#546e7a]">
            Customer
            <select
              className={`${adminSelectClass} mt-1`}
              value={form.customerId}
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value, quoteId: "" }))}
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
          {quotesForCustomer.length > 0 ? (
            <label className="text-sm text-[#546e7a]">
              Link quote (optional)
              <select className={`${adminSelectClass} mt-1`} value={form.quoteId} onChange={(e) => setForm((f) => ({ ...f, quoteId: e.target.value }))}>
                <option value="">— None —</option>
                {quotesForCustomer.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quoteNumber} ({q.status})
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="text-sm text-[#546e7a]">
            Notes
            <textarea className={`${adminInputClass} mt-1 min-h-[64px]`} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
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
                    <select
                      className={`${adminSelectClass} mt-1`}
                      value={line.inventoryItemId}
                      onChange={(e) => {
                        const lines = [...form.lines];
                        lines[idx] = { ...lines[idx], inventoryItemId: e.target.value };
                        setForm((f) => ({ ...f, lines }));
                      }}
                    >
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
