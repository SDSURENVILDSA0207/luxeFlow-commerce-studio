/**
 * Client-side fetch for Jewelry Admin APIs: sends cookies and redirects to login on 401.
 */
export async function jewelryAdminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: init?.credentials ?? "include"
  });

  if (res.status === 401 && typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return res;
    }
    const path = `${pathname}${window.location.search}`;
    window.location.assign(`/admin/login?from=${encodeURIComponent(path)}`);
  }

  return res;
}
