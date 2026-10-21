import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { AdminAccessForm } from "@/features/profile-content/components/admin/AdminAccessForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Login | super.profile",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await hasAdminAccess()) redirect("/admin");
  return <AdminAccessForm />;
}
