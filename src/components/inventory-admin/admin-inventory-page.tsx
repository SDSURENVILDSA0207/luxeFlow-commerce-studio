"use client";

import type { InventoryLowStockStatus } from "@prisma/client";
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
import { computeAvailableQuantity } from "@/lib/jewelry-inventory/stock-status";
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";

type SupplierMini = { id: string; name: string };
type ItemRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  material: string;
  gemstone: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  lowStockStatus: InventoryLowStockStatus;
  supplier: SupplierMini | null;
};

function lowTone(s: InventoryLowStockStatus): "ok" | "warn" | "bad" {
  if (s === "OK") return "ok";
  if (s === "LOW") return "warn";
  return "bad";
}

export function AdminInventoryPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierMini[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<ItemRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    material: "",
    gemstone: "",
    stockQuantity: 0,
    reservedQuantity: 0,
    reorderThreshold: 5,
    supplierId: ""
  });

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [invRes, supRes] = await Promise.all([
        jewelryAdminFetch("/api/admin/jewelry/inventory"),
        jewelryAdminFetch("/api/admin/jewelry/suppliers")
      ]);
      if (invRes.status === 401 || supRes.status === 401) return;
      if (!invRes.ok || !supRes.ok) {
        setError("Could not load inventory.");
        return;
      }
      const invJson = (await invRes.json()) as { items: ItemRow[] };
      const supJson = (await supRes.json()) as { suppliers: { id: string; name: string }[] };
      setItems(invJson.items);
      setSuppliers(supJson.suppliers.map((s) => ({ id: s.id, name: s.name })));
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(id);
  }, [load]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.sku.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.material.toLowerCase().includes(q)
    );
  }, [items, filter]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      sku: "",
      name: "",
      category: "Rings",
      material: "18k gold",
      gemstone: "",
      stockQuantity: 0,
      reservedQuantity: 0,
      reorderThreshold: 5,
      supplierId: ""
    });
    setModal("add");
  };

  const openEdit = (row: ItemRow) => {
    setEditing(row);
    setForm({
      sku: row.sku,
      name: row.name,
      category: row.category,
      material: row.material,
      gemstone: row.gemstone ?? "",
      stockQuantity: row.stockQuantity,
      reservedQuantity: row.reservedQuantity,
      reorderThreshold: row.reorderThreshold,
      supplierId: row.supplier?.id ?? ""
    });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = {
        sku: form.sku.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        material: form.material.trim(),
        gemstone: form.gemstone.trim() || null,
        stockQuantity: form.stockQuantity,
        reservedQuantity: form.reservedQuantity,
        reorderThreshold: form.reorderThreshold,
        supplierId: form.supplierId || null
      };
      if (modal === "add") {
        const res = await jewelryAdminFetch("/api/admin/jewelry/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (res.status === 401) return;
        if (!res.ok) {
          const j = (await res.json()) as { error?: string };
          setError(j.error ?? "Could not create SKU.");
          return;
        }
      } else if (editing) {
        const res = await jewelryAdminFetch(`/api/admin/jewelry/inventory/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (res.status === 401) return;
        if (!res.ok) {
          const j = (await res.json()) as { error?: string };
          setError(j.error ?? "Could not update SKU.");
          return;
        }
      }
      setModal(null);
      await load();
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: ItemRow) => {
    if (!window.confirm(`Delete SKU ${row.sku}? This cannot be undone if referenced by quotes or orders.`)) return;
    setError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/inventory/${row.id}`, { method: "DELETE" });
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not delete — item may be referenced by trade lines.");
        return;
      }
      await load();
    } catch {
      setError("Network error.");
    }
  };

  return (
    <>
      <AdminSection
        title="Inventory catalog"
        description="Warehouse SKUs linked to suppliers. Available = on-hand stock minus reservations."
        actions={<AdminPrimaryButton onClick={openAdd}>Add SKU</AdminPrimaryButton>}
      >
        {error ? (
          <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label htmlFor="inventory-admin-filter" className="text-sm text-[#546e7a]">
            Filter
            <input
              id="inventory-admin-filter"
              className={`${adminInputClass} mt-1 max-w-md`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search SKU, name, category…"
              autoComplete="off"
            />
          </label>
          <p className="text-sm text-[#78909c]">{loading ? "Loading…" : `${filtered.length} row(s)`}</p>
        </div>
        <div className={adminTableWrapClass}>
          <table className="min-w-[960px] w-full border-collapse text-left">
            <thead>
              <tr>
                <th className={adminThClass}>SKU</th>
                <th className={adminThClass}>Product</th>
                <th className={adminThClass}>Category</th>
                <th className={adminThClass}>Material</th>
                <th className={adminThClass}>Gem</th>
                <th className={adminThClass}>Stock</th>
                <th className={adminThClass}>Reserved</th>
                <th className={adminThClass}>Available</th>
                <th className={adminThClass}>Supplier</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass}> </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="border-b border-[#eceff1] px-4 py-10 text-center text-sm text-[#78909c]">
                    Loading inventory…
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <AdminEmptyRow
                  colSpan={11}
                  title={items.length === 0 ? "No SKUs yet" : "No matching SKUs"}
                  hint={items.length === 0 ? "Add a SKU to start tracking stock." : "Adjust your filter keywords."}
                />
              ) : null}
              {!loading &&
                filtered.map((row) => {
                const avail = computeAvailableQuantity(row.stockQuantity, row.reservedQuantity);
                return (
                  <tr key={row.id} className="hover:bg-[#fafbfc]">
                    <td className={`${adminTdClass} font-mono text-xs`}>{row.sku}</td>
                    <td className={adminTdClass}>{row.name}</td>
                    <td className={adminTdClass}>{row.category}</td>
                    <td className={adminTdClass}>{row.material}</td>
                    <td className={adminTdClass}>{row.gemstone ?? "—"}</td>
                    <td className={`${adminTdClass} tabular-nums`}>{row.stockQuantity}</td>
                    <td className={`${adminTdClass} tabular-nums`}>{row.reservedQuantity}</td>
                    <td className={`${adminTdClass} tabular-nums`}>{avail}</td>
                    <td className={adminTdClass}>{row.supplier?.name ?? "—"}</td>
                    <td className={adminTdClass}>
                      <StatusPill tone={lowTone(row.lowStockStatus)}>{row.lowStockStatus}</StatusPill>
                    </td>
                    <td className={`${adminTdClass} whitespace-nowrap`}>
                      <button
                        type="button"
                        className="mr-3 inline-flex min-h-10 min-w-[3.25rem] items-center justify-center text-sm font-medium text-[#1565c0] hover:underline"
                        onClick={() => openEdit(row)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-10 min-w-[3.25rem] items-center justify-center text-sm font-medium text-rose-800 hover:underline"
                        onClick={() => void remove(row)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminModal
        open={modal !== null}
        title={modal === "add" ? "Add inventory SKU" : "Edit inventory SKU"}
        onClose={() => setModal(null)}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <AdminGhostButton onClick={() => setModal(null)}>Cancel</AdminGhostButton>
            <AdminPrimaryButton onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </AdminPrimaryButton>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-[#546e7a] sm:col-span-2">
            SKU
            <input className={`${adminInputClass} mt-1`} value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a] sm:col-span-2">
            Name
            <input className={`${adminInputClass} mt-1`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a]">
            Category
            <input className={`${adminInputClass} mt-1`} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Material
            <input className={`${adminInputClass} mt-1`} value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a] sm:col-span-2">
            Gemstone
            <input className={`${adminInputClass} mt-1`} value={form.gemstone} onChange={(e) => setForm((f) => ({ ...f, gemstone: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Stock qty
            <input
              type="number"
              min={0}
              className={`${adminInputClass} mt-1`}
              value={form.stockQuantity}
              onChange={(e) => setForm((f) => ({ ...f, stockQuantity: Number(e.target.value) }))}
            />
          </label>
          <label className="text-sm text-[#546e7a]">
            Reserved
            <input
              type="number"
              min={0}
              className={`${adminInputClass} mt-1`}
              value={form.reservedQuantity}
              onChange={(e) => setForm((f) => ({ ...f, reservedQuantity: Number(e.target.value) }))}
            />
          </label>
          <label className="text-sm text-[#546e7a]">
            Reorder threshold
            <input
              type="number"
              min={0}
              className={`${adminInputClass} mt-1`}
              value={form.reorderThreshold}
              onChange={(e) => setForm((f) => ({ ...f, reorderThreshold: Number(e.target.value) }))}
            />
          </label>
          <label className="text-sm text-[#546e7a]">
            Supplier
            <select className={`${adminSelectClass} mt-1`} value={form.supplierId} onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}>
              <option value="">— None —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminModal>
    </>
  );
}
