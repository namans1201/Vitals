import { ToastProvider } from "@/components/Toast";
import { AppNav } from "@/components/AppNav";
import { RefreshOnFocus } from "@/components/RefreshOnFocus";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <AppNav />
        {/* Re-reads server data when you return to the tab, so a phone left
            open overnight is not still showing yesterday's state. */}
        <RefreshOnFocus />
        {/* Both top bars in AppNav are `position: fixed` (required for their
            liquid-glass backdrop-filter to composite - see globals.css), so
            they take no space in normal flow. `main` compensates with
            explicit top padding sized to each bar's real rendered height
            plus its own gap, measured against the live layout rather than
            guessed. */}
        <main className="flex-1 px-4 pt-[76px] pb-24 sm:pt-24 sm:pb-4">{children}</main>
      </div>
    </ToastProvider>
  );
}
