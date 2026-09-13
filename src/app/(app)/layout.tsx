import { ToastProvider } from "@/components/Toast";
import { AppNav } from "@/components/AppNav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <AppNav />
        <main className="flex-1 px-4 py-4 pb-24 sm:pb-4">{children}</main>
      </div>
    </ToastProvider>
  );
}
