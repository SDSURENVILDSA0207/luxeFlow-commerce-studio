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
} from "@/components/inventory-admin/jewelry-admin-ui";
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";

type CustomerRow = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  accountStatus: "ACTIVE" | "ON_HOLD" | "INACTIVE";
  _count: { quotes: number; orders: number };
};

export function AdminCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    accountStatus: "ACTIVE" as CustomerRow["accountStatus"]
  });

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await jewelryAdminFetch("/api/admin/jewelry/customers");
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not load customers.");
        return;
      }
      const data = (await res.json()) as { customers: CustomerRow[] };
      setRows(data.customers);
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
    return rows.filter(
      (r) =>
        r.businessName.toLowerCase().includes(q) ||
        r.contactName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await jewelryAdminFetch("/api/admin/jewelry/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          accountStatus: form.accountStatus
        })
      });
      if (res.status === 401) return;
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        setError(j.error ?? "Could not create customer.");
        return;
      }
      setModalOpen(false);
      setForm({ businessName: "", contactName: "", email: "", phone: "", accountStatus: "ACTIVE" });
      await load();
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const patchStatus = async (id: string, accountStatus: CustomerRow["accountStatus"]) => {
    setError(null);
    try {
      const res = await jewelryAdminFetch(`/api/admin/jewelry/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus })
      });
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not update account status.");
        return;
      }
      await load();
    } catch {
      setError("Network error.");
    }
  };

  return (
    <>
      <AdminSection title="B2B customers" description="Retailer accounts with quote and order history counts." actions={<AdminPrimaryButton onClick={() => setModalOpen(true)}>Add customer</AdminPrimaryButton>}>
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
            placeholder="Search business, contact, email…"
            aria-label="Search customers by business, contact, or email"
          />
          <p className="text-sm text-[#78909c]">{loading ? "Loading…" : `${filtered.length} account(s)`}</p>
        </div>
        <div className={adminTableWrapClass}>
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr>
                <th className={adminThClass}>Business</th>
                <th className={adminThClass}>Contact</th>
                <th className={adminThClass}>Email</th>
                <th className={adminThClass}>Quotes</th>
                <th className={adminThClass}>Orders</th>
                <th className={adminThClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="border-b border-[#eceff1] px-4 py-10 text-center text-sm text-[#78909c]">
                    Loading customers…
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <AdminEmptyRow
                  colSpan={6}
                  title={rows.length === 0 ? "No B2B accounts yet" : "No matches"}
                  hint={rows.length === 0 ? "Create a retailer account to start quoting." : "Try a different search."}
                />
              ) : null}
              {!loading &&
                filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#fafbfc]">
                  <td className={`${adminTdClass} font-medium`}>{r.businessName}</td>
                  <td className={adminTdClass}>{r.contactName}</td>
                  <td className={`${adminTdClass} text-xs`}>{r.email}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{r._count.quotes}</td>
                  <td className={`${adminTdClass} tabular-nums`}>{r._count.orders}</td>
                  <td className={adminTdClass}>
                    <select
                      className={`${adminSelectClass} max-w-[11rem]`}
                      value={r.accountStatus}
                      onChange={(e) => void patchStatus(r.id, e.target.value as CustomerRow["accountStatus"])}
                      aria-label={`Status for ${r.businessName}`}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ON_HOLD">ON HOLD</option>
                      <option value="INACTIVE">INACTIVE</option>
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
        title="Add B2B customer"
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <AdminGhostButton onClick={() => setModalOpen(false)}>Cancel</AdminGhostButton>
            <AdminPrimaryButton onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Create"}
            </AdminPrimaryButton>
          </div>
        }
      >
        <div className="grid gap-3">
          <label className="text-sm text-[#546e7a]">
            Business name
            <input className={`${adminInputClass} mt-1`} value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a]">
            Contact person
            <input className={`${adminInputClass} mt-1`} value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a]">
            Email
            <input className={`${adminInputClass} mt-1`} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </label>
          <label className="text-sm text-[#546e7a]">
            Phone
            <input className={`${adminInputClass} mt-1`} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </label>
          <label className="text-sm text-[#546e7a]">
            Initial status
            <select className={`${adminSelectClass} mt-1`} value={form.accountStatus} onChange={(e) => setForm((f) => ({ ...f, accountStatus: e.target.value as CustomerRow["accountStatus"] }))}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_HOLD">ON HOLD</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>
      </AdminModal>
    </>
  );
}
