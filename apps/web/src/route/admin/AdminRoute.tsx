import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { getProfileContent } from "@/features/profile-content/data/profile-content";
import { redirect } from "next/navigation";
import { AdminProfilePage } from "@/page/admin/AdminProfilePage";

type AdminRouteProps = {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export async function AdminRoute({ searchParams }: AdminRouteProps) {
  const params = await searchParams;
  const canEdit = await hasAdminAccess();

  if (!canEdit) {
    redirect("/login");
  }

  const content = await getProfileContent();

  return (
    <AdminProfilePage
      content={content}
      hasDatabaseError={params?.error === "database"}
      saved={params?.saved === "1"}
    />
  );
}
