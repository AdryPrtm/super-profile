"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { normalizeLoginIdentifier } from "@super-profile-dry/auth/login-identifier";

export function AdminAccessForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const result = await authClient.signIn.email({
        email: normalizeLoginIdentifier(String(data.get("email") ?? "")),
        password: String(data.get("password") ?? ""),
      });
      if (result.error) {
        setError(result.error.status === 429 ? "Too many attempts. Please try again later." : "Unable to sign in. Check your email or username and password.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const fieldClass = "min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <main id="main-content" className="flex min-h-[calc(100svh-65px)] items-center justify-center bg-muted/20 px-6 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="space-y-2">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LockKeyhole aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Super / Profile</p>
          <h1 className="text-2xl font-light tracking-tight">Admin login</h1>
          <p className="text-sm leading-6 text-muted-foreground">Sign in with your account to manage your profile and watch journal.</p>
        </div>
        <form onSubmit={signIn} className="space-y-5" aria-busy={pending}>
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-sm font-medium">Email or username</label>
            <input id="login-email" name="email" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} className={fieldClass} aria-describedby={error ? "login-error" : undefined} />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="block text-sm font-medium">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" required maxLength={128} className={fieldClass} aria-describedby={error ? "login-error" : undefined} />
          </div>
          {error ? <p id="login-error" role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={pending} className="min-h-11 w-full">{pending ? "Signing in..." : "Log in"}</Button>
        </form>
        <a href="/" className="inline-flex min-h-11 items-center rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Back to profile</a>
      </div>
    </main>
  );
}
