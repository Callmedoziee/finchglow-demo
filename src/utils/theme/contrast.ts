/** Converts one 0-255 colour channel to its linear brightness (undoing sRGB gamma). */
const toLinear = (channelValue: number): number => {
  const fraction = channelValue / 255
  return fraction <= 0.03928 ? fraction / 12.92 : ((fraction + 0.055) / 1.055) ** 2.4
}

/** Relative luminance: how bright a colour looks to the human eye, from 0 (black) to 1 (white). */
const luminance = (hex: string): number => {
  const rgb = Number.parseInt(hex.replace('#', ''), 16)
  const red = (rgb >> 16) & 255
  const green = (rgb >> 8) & 255
  const blue = rgb & 255
  return 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue)
}

/** WCAG 2.1 contrast ratio between two hex colours. */
export const contrastRatio = (colorA: string, colorB: string): number => {
  const [light, dark] = [luminance(colorA), luminance(colorB)].sort((first, second) => second - first)
  return (light + 0.05) / (dark + 0.05)
}
