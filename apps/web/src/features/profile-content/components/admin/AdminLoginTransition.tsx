"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import "./admin-login-transition.css";

export function AdminLoginTransition() {
  const router = useRouter();
  const navigating = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const enterButton = useRef<HTMLButtonElement>(null);

  const enterAdmin = useCallback(() => {
    if (navigating.current) return;
    navigating.current = true;
    router.replace("/admin");
    router.refresh();
  }, [router]);

  useEffect(() => {
    heading.current?.focus();
    router.prefetch("/admin");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(enterAdmin, reducedMotion ? 150 : 1400);
    return () => window.clearTimeout(timer);
  }, [enterAdmin, router]);

  function keepFocusInside(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const focusHeading = event.shiftKey ? document.activeElement !== heading.current : document.activeElement === enterButton.current;
    if (focusHeading) heading.current?.focus();
    else enterButton.current?.focus();
  }

  return (
    <div className="admin-entry" role="dialog" aria-modal="true" aria-labelledby="admin-entry-title" aria-describedby="admin-entry-description" onKeyDown={keepFocusInside}>
      <div className="admin-entry__content">
        <span className="admin-entry__brand"><span className="admin-entry__brand-mark" aria-hidden="true" /> SUPER / PROFILE</span>
        <span className="admin-entry__icon" aria-hidden="true"><Check size={26} strokeWidth={1.75} /></span>
        <h2 id="admin-entry-title" ref={heading} tabIndex={-1}>Welcome back.</h2>
        <p id="admin-entry-description">Opening your workspace</p>
        <div className="admin-entry__progress" aria-hidden="true"><span /></div>
        <button ref={enterButton} type="button" onClick={enterAdmin} className="admin-entry__enter">
          Enter now <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
