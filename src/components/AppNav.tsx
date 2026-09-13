"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";
import {
  IconFood,
  IconLogout,
  IconToday,
  IconWeek,
  IconWorkout,
} from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Today", Icon: IconToday },
  { href: "/workout", label: "Workout", Icon: IconWorkout },
  { href: "/nutrition", label: "Food", Icon: IconFood },
  { href: "/plan", label: "Week", Icon: IconWeek },
] as const;

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image's
          optimizer self-fetch fails in this preview environment; a fixed
          28px mark gets nothing from optimization anyway. */}
      <img src="/logo.png" alt="" width={28} height={28} className="shrink-0" />
      <span className="font-heading text-base font-bold text-ink">Naman</span>
    </Link>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Tablet & desktop - inset rounded bar in liquid glass, floating over
          the page. This is `fixed` directly on the `.glass` element itself
          (not a `sticky` ancestor with `.glass` nested inside, and not
          `relative`) - see the note in globals.css on why that's required
          for `backdrop-filter` to actually composite here. A fixed element
          takes no space in flow, so NavSpacerDesktop below reserves the
          same footprint in `main`'s layout. */}
      <div className="glass fixed inset-x-4 top-4 z-20 mx-auto hidden max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:flex">
        <Wordmark />
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent font-medium text-white"
                    : "text-dim hover:bg-panel-2 hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="shrink-0">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-faint transition-colors hover:bg-panel-2 hover:text-dim"
          >
            <IconLogout size={15} />
            <span className="hidden md:inline">Log out</span>
          </button>
        </form>
      </div>

      {/* Phone - minimal top bar in the same glass material, nav moves to
          the bottom (thumb reach). Also `fixed` directly (not `sticky`) for
          the same compositing reason as the desktop bar above. */}
      <header className="glass-flush fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-line/70 px-4 py-3 sm:hidden">
        <Wordmark />
        <form action={logout}>
          <button
            type="submit"
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-full text-faint"
          >
            <IconLogout size={17} />
          </button>
        </form>
      </header>

      <nav
        className="glass-flush fixed inset-x-0 bottom-0 z-20 flex border-t border-line/70 sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] ${
                active ? "font-medium text-accent" : "text-faint"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
