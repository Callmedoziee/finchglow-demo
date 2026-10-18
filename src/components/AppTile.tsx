import type { PortalApp } from '@/types/portal'

/** One launcher tile. A real link, so Enter works, middle-click works and screen readers say "link". */
export const AppTile = ({ app }: { app: PortalApp }) => (
  <a
    href={app.url}
    className="flex h-full min-h-20 flex-col justify-center rounded-lg border border-line bg-surface px-4 py-3 hover:bg-accent-soft"
  >
    <span className="text-base font-semibold text-foreground">{app.name}</span>
    <span className="mt-1 text-sm text-muted">{app.description}</span>
  </a>
)
