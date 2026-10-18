import type { CompanyLogo as CompanyLogoData } from '@/types/portal'

interface Props {
  logo: CompanyLogoData
  className?: string
  /** Pass "" when the company name is printed right beside the logo, so a screen reader does not say it twice. */
  alt?: string
}

/** The brand's logo. width and height come from the file so the page does not jump when it loads. */
export const CompanyLogo = ({ logo, className, alt = logo.alt }: Props) => (
  <img src={logo.src} width={logo.width} height={logo.height} alt={alt} decoding="async" className={className} />
)
