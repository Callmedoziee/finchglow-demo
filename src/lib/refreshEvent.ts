/** The name of the browser event that tells every data source to reload. */
export const REFRESH_EVENT = 'portal:refresh'

/** Asks everything on the page that loads data to load it again. */
export const requestRefresh = (): void => {
  window.dispatchEvent(new Event(REFRESH_EVENT))
}
