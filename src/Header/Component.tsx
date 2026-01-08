import { getCachedGlobal } from '@/utilities/getGlobals'

import { HeaderClient } from '@/components'
import type { Header } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
