import { AdminAccessForm } from "@/features/profile-content/components/admin/AdminAccessForm";

type AdminAccessPageProps = {
  hasError: boolean;
};

export function AdminAccessPage({ hasError }: AdminAccessPageProps) {
  return <AdminAccessForm hasError={hasError} />;
}
