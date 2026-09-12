import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-xl border border-line bg-panel p-6"
      >
        <h1 className="text-lg font-medium text-ink">Vitals</h1>
        <p className="mt-1 text-sm text-dim">Enter the password to continue.</p>

        <input type="hidden" name="from" value={from ?? "/"} />

        <label className="mt-6 block">
          <span className="text-[11px] uppercase tracking-[.06em] text-faint">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="mt-1.5 h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-bad">Wrong password. Try again.</p>
        )}

        <button
          type="submit"
          className="mt-5 h-11 w-full rounded-lg bg-accent text-sm font-medium text-white"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
