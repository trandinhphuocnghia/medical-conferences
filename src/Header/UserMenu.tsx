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
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'

export const UserMenu = () => {
  const { user, setUser } = useUserStore((state) => state)
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push('/dashboard/logout')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserAvatar user={user as User} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="min-w-40">
        <DropdownMenuLabel className="px-4 py-2">
          <p className="text-sm font-semibold text-center">{user?.fullname}</p>
          <p className="text-xs text-center text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
