import { Button } from "@/components/ui/button";
import { signInAdmin } from "@/features/profile-content/actions/admin-session-actions";
import { getAdminAccessKey } from "@/features/profile-content/auth/admin-access";
import { ProfileField } from "@/features/profile-content/components/admin/ProfileField";

type AdminAccessFormProps = {
  hasError: boolean;
};

export function AdminAccessForm({ hasError }: AdminAccessFormProps) {
  const needsSetup = !getAdminAccessKey() && process.env.NODE_ENV === "production";

  return (
    <main className="flex min-h-[calc(100svh-49px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border/60 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Admin
          </p>
          <h1 className="text-2xl font-light tracking-tight">
            Profile Content Access
          </h1>
        </div>

        {needsSetup ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Set ADMIN_CONTENT_KEY before opening this admin route in production.
          </div>
        ) : (
          <form action={signInAdmin} className="space-y-4">
            {hasError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Invalid access key.
              </div>
            ) : null}
            <ProfileField
              label="Access Key"
              name="adminKey"
              type="password"
              defaultValue=""
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
