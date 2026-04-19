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
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";

type SupplierRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  categories: string[];
  materials: string[];
  leadTimeDays: number | null;
  status: "ACTIVE" | "INACTIVE";
  _count: { items: number };
};

export function AdminSuppliersPage() {
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<SupplierRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    categories: "",
    materials: "",
    leadTimeDays: "" as string,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    notes: ""
  });

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await jewelryAdminFetch("/api/admin/jewelry/suppliers");
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not load suppliers.");
        return;
      }
      const data = (await res.json()) as { suppliers: SupplierRow[] };
      setRows(data.suppliers);
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
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q) || (r.email ?? "").toLowerCase().includes(q));
  }, [rows, filter]);

  const parseList = (s: string) =>
    s
      .split(/[,;]+/)
      .map((x) => x.trim())
      .filter(Boolean);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", categories: "", materials: "", leadTimeDays: "", status: "ACTIVE", notes: "" });
    setModal("add");
  };

  const openEdit = (r: SupplierRow) => {
    setEditing(r);
    setForm({
      name: r.name,
      email: r.email ?? "",
      phone: r.phone ?? "",
      categories: r.categories.join(", "),
      materials: r.materials.join(", "),
      leadTimeDays: r.leadTimeDays != null ? String(r.leadTimeDays) : "",
      status: r.status,
      notes: ""
    });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        categories: parseList(form.categories),
        materials: parseList(form.materials),
        leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : null,
        status: form.status,
        notes: form.notes.trim() || null
      };
      if (modal === "add") {
        const res = await jewelryAdminFetch("/api/admin/jewelry/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.status === 401) return;
        if (!res.ok) {
          const j = (await res.json()) as { error?: string };
          setError(j.error ?? "Could not create supplier.");
          return;
        }
      } else if (editing) {
        const res = await jewelryAdminFetch(`/api/admin/jewelry/suppliers/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.status === 401) return;
        if (!res.ok) {
          const j = (await res.json()) as { error?: string };
          setError(j.error ?? "Could not update supplier.");
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

  const remove = async (r: SupplierRow) => {
    if (!window.confirm(`Remove supplier “${r.name}”? Inventory rows will be unlinked.`)) return;
    setError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/suppliers/${r.id}`, { method: "DELETE" });
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not delete supplier.");
        return;
      }
      await load();
    } catch {
      setError("Network error.");
    }
  };

  return (
    <>
      <AdminSection title="Suppliers" description="Vendor master data, lead times, and linked SKU counts." actions={<AdminPrimaryButton onClick={openAdd}>Add supplier</AdminPrimaryButton>}>
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
            placeholder="Search name or email…"
            aria-label="Search suppliers by name or email"
          />
          <p className="text-sm text-[#78909c]">{loading ? "Loading…" : `${filtered.length} supplier(s)`}</p>
        </div>
        <div className={adminTableWrapClass}>
          <table className="min-w-[880px] w-full border-collapse">
            <thead>
              <tr>
                <th className={adminThClass}>Name</th>
                <th className={adminThClass}>Contact</th>
                <th className={adminThClass}>Categories</th>
                <th className={adminThClass}>Materials</th>
                <th className={adminThClass}>Lead (d)</th>
                <th className={adminThClass}>SKUs</th>
                <th className={adminThClass}>Status</th>
                <th className={adminThClass} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="border-b border-[#eceff1] px-4 py-10 text-center text-sm text-[#78909c]">
                    Loading suppliers…
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <AdminEmptyRow
                  colSpan={8}
                  title={rows.length === 0 ? "No suppliers yet" : "No matches"}
                  hint={rows.length === 0 ? "Add your first vendor." : "Try another search."}
                />
              ) : null}
              {!loading &&
                filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#fafbfc]">
                  <td className={`${adminTdClass} font-medium`}>{r.name}</td>
                  <td className={adminTdClass}>
                    <div className="text-xs">{r.email ?? "—"}</div>
                    <div className="text-xs text-[#78909c]">{r.phone ?? ""}</div>
                  </td>
                  <td className={`${adminTdClass} max-w-[200px] text-xs`}>{r.categories.length ? r.categories.join(", ") : "—"}</td>
                  <td className={`${adminTdClass} max-w-[200px] text-xs`}>{r.materials.length ? r.materials.join(", ") : "—"}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{r.leadTimeDays ?? "—"}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{r._count.items}</td>
                  <td className={adminTdClass}>
                    <StatusPill tone={r.status === "ACTIVE" ? "ok" : "neutral"}>{r.status}</StatusPill>
                  </td>
                  <td className={`${adminTdClass} whitespace-nowrap`}>
                    <button
                      type="button"
                      className="mr-3 inline-flex min-h-10 min-w-[3rem] items-center justify-center text-sm font-medium text-[#1565c0] hover:underline"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-10 min-w-[3.5rem] items-center justify-center text-sm font-medium text-rose-800 hover:underline"
                      onClick={() => void remove(r)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminModal
        open={modal !== null}
        title={modal === "add" ? "Add supplier" : "Edit supplier"}
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
            Name
            <input className={`${adminInputClass} mt-1`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a]">
            Email
            <input className={`${adminInputClass} mt-1`} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Phone
            <input className={`${adminInputClass} mt-1`} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a] sm:col-span-2">
            Categories (comma-separated)
            <input className={`${adminInputClass} mt-1`} value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a] sm:col-span-2">
            Materials (comma-separated)
            <input className={`${adminInputClass} mt-1`} value={form.materials} onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Lead time (days)
            <input className={`${adminInputClass} mt-1`} type="number" min={1} value={form.leadTimeDays} onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Status
            <select className={`${adminSelectClass} mt-1`} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "ACTIVE" | "INACTIVE" }))}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>
      </AdminModal>
    </>
  );
}
