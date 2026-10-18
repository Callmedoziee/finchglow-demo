import type { ComponentType, SVGProps } from 'react'
import { BriefcaseBusinessIcon } from '@/components/icon/BriefcaseBusinessIcon'
import { CalendarDaysIcon } from '@/components/icon/CalendarDaysIcon'
import { ContactRoundIcon } from '@/components/icon/ContactRoundIcon'
import { GraduationCapIcon } from '@/components/icon/GraduationCapIcon'
import { HandshakeIcon } from '@/components/icon/HandshakeIcon'
import { IdCardIcon } from '@/components/icon/IdCardIcon'
import { PackageIcon } from '@/components/icon/PackageIcon'
import { PlaneIcon } from '@/components/icon/PlaneIcon'
import { ReceiptIcon } from '@/components/icon/ReceiptIcon'
import { UsersRoundIcon } from '@/components/icon/UsersRoundIcon'
import { WrenchIcon } from '@/components/icon/WrenchIcon'
import type { AppIconName } from '@/types/portal'

/** Maps an app's icon name to its icon component. Record<AppIconName, ...> means a missing entry is a compile error. */
export const appIcons: Record<AppIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  plane: PlaneIcon,
  users: UsersRoundIcon,
  briefcase: BriefcaseBusinessIcon,
  contact: ContactRoundIcon,
  handshake: HandshakeIcon,
  calendar: CalendarDaysIcon,
  package: PackageIcon,
  'graduation-cap': GraduationCapIcon,
  wrench: WrenchIcon,
  'id-card': IdCardIcon,
  receipt: ReceiptIcon,
}
