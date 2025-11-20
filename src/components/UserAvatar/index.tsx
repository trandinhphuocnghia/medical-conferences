import { Media } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import Image from 'next/image'

const UserAvatar = async () => {
  const {
    user: { avatar, fullname },
  } = await getMeUser()
  return (
    <Image
      src={(avatar as Media)?.url || '/assets/img/default-avatar.jpg'}
      alt={fullname || 'alt'}
      width={36}
      height={36}
      style={{
        borderRadius: '50%',
      }}
    />
  )
}

export default UserAvatar
