/** Shown after signing out. In production the identity provider would show its own sign-in page; here, "Sign in" reloads. */
export const SignedOutScreen = () => (
  <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-4 py-6">
    <h1 className="text-2xl font-bold">You have been signed out</h1>
    <p className="text-muted">The alerts and news saved on this device were removed, so the next person starts clean.</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="min-h-11 w-fit rounded-lg bg-accent px-6 font-semibold text-on-accent"
    >
      Sign in
    </button>
  </main>
)
