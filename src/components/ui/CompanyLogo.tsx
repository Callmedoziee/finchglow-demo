import type { CompanyLogo as CompanyLogoData } from '@/types/portal'

/** The brand's logo. width and height come from the file so the page does not jump when it loads. */
export const CompanyLogo = ({ logo, className }: { logo: CompanyLogoData; className?: string }) => (
  <img src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} decoding="async" className={className} />
)
