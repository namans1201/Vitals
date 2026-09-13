import { login } from "./actions";
import { IconCheck } from "@/components/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4">
      <form action={login} className="card w-full max-w-sm p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <IconCheck size={17} />
          </span>
          <h1 className="font-heading text-lg font-bold text-ink">Vitals</h1>
        </div>
        <p className="text-sm text-dim">Enter the password to continue.</p>

        <input type="hidden" name="from" value={from ?? "/"} />

        <label className="mt-6 block">
          <span className="micro text-faint">Password</span>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
          />
        </label>

        {error && <p className="mt-3 text-sm text-bad">Wrong password. Try again.</p>}

        <button
          type="submit"
          className="mt-5 h-11 w-full rounded-full bg-accent text-sm font-medium text-white"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
