'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const NAV_LINKS = [
  { href: "/watch", label: "Watch" },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#contact', label: 'Contact' },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="/#hero"
          className="inline-flex min-h-11 items-center gap-2.5 text-sm font-bold tracking-tight transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true" className="h-3 w-3 bg-blue-600" />
          SUPER<span className="font-normal text-muted-foreground">/</span>
          PROFILE
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
        <ModeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-5 pb-4 pt-2 lg:hidden"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
