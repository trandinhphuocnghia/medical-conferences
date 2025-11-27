'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/UserAvatar'
import { useUserStore } from '@/stores/userStore'
import { User } from '@/payload-types'
import { useRouter } from 'next/navigation'

export const UserMenu = () => {
  const { user, setUser } = useUserStore((state) => state)
  const router = useRouter()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    setUser(null)
    router.push('/dashboard/logout')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserAvatar user={user as User} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10}>
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          My Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
