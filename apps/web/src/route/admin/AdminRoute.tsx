import { hasAdminAccess } from "@/features/profile-content/auth/admin-access";
import { getProfileContent } from "@/features/profile-content/data/profile-content";
import { AdminAccessPage } from "@/page/admin/AdminAccessPage";
import { AdminProfilePage } from "@/page/admin/AdminProfilePage";

type AdminRouteProps = {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export async function AdminRoute({ searchParams }: AdminRouteProps) {
  const params = await searchParams;
  const hasAccessError = params?.error === "access";
  const canEdit = await hasAdminAccess();

  if (!canEdit) {
    return <AdminAccessPage hasError={hasAccessError} />;
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
