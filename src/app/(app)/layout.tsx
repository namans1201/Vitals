import Link from "next/link";
import { logout } from "../(auth)/login/actions";
import { ToastProvider } from "@/components/Toast";

const NAV_ITEMS = [
  { href: "/", label: "Today" },
  { href: "/workout", label: "Workout" },
  { href: "/runs", label: "Runs" },
  { href: "/nutrition", label: "Food" },
  { href: "/plan", label: "Week" },
] as const;

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium text-ink">Vitals</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-[11px] uppercase tracking-[.06em] text-faint"
              >
                Log out
              </button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm text-dim hover:bg-panel hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
    </ToastProvider>
  );
}
