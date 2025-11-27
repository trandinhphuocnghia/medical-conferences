import { Media, User } from '@/payload-types'
import Image from 'next/image'

const UserAvatar = ({ user }: { user: User }) => {
  const avatar = user?.avatar as Media

  return (
    <Image
      src={avatar?.url || '/assets/img/default-avatar.jpg'}
      alt={avatar?.alt || user?.fullname || 'alt'}
      width={36}
      height={36}
      style={{
        borderRadius: '50%',
        cursor: 'pointer',
      }}
    />
  )
}

export default UserAvatar
