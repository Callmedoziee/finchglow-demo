/** The demo controls only appear when the address ends with ?demo=1, so normal users never see them. */
export const isDemoMode = (search: string = window.location.search): boolean => new URLSearchParams(search).get('demo') === '1'
