"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";
import {
  IconCheck,
  IconFood,
  IconLogout,
  IconRun,
  IconToday,
  IconWeek,
  IconWorkout,
} from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Today", Icon: IconToday },
  { href: "/workout", label: "Workout", Icon: IconWorkout },
  { href: "/runs", label: "Runs", Icon: IconRun },
  { href: "/nutrition", label: "Food", Icon: IconFood },
  { href: "/plan", label: "Week", Icon: IconWeek },
] as const;

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white">
        <IconCheck size={15} />
      </span>
      <span className="font-heading text-base font-bold text-ink">Vitals</span>
    </Link>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Tablet & desktop — inset rounded bar, floating over the page. */}
      <header className="sticky top-0 z-20 hidden bg-bg sm:block">
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div
            className="card flex items-center justify-between gap-4 px-4 py-2.5"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
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
        </div>
      </header>

      {/* Phone — minimal top bar, nav moves to the bottom (thumb reach). */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-panel/95 px-4 py-3 backdrop-blur sm:hidden">
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
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-panel/95 backdrop-blur sm:hidden"
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
