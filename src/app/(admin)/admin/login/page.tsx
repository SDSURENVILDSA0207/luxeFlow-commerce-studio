import { Suspense } from "react";
import { AdminLoginFooterLinks, AdminLoginHero } from "@/components/inventory-admin/admin-login-chrome";
import { AdminLoginForm } from "@/components/inventory-admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#eceff1] pb-[env(safe-area-inset-bottom)]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 pt-[max(3rem,env(safe-area-inset-top))]">
        <div className="w-full max-w-[420px] rounded-xl border border-[#cfd8dc] bg-white p-8 shadow-lg">
          <AdminLoginHero />
          <div className="mt-8">
            <Suspense fallback={<p className="text-center text-sm text-[#78909c]">Loading…</p>}>
              <AdminLoginForm />
            </Suspense>
          </div>
          <AdminLoginFooterLinks />
        </div>
      </div>
    </div>
  );
}
