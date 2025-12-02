// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Post, User } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'

export function AuthorTop({
  author,
  createdAt,
}: {
  author: Post['createdBy']
  createdAt: Post['createdAt']
}) {
  const { fullname, organization, title } = author as User

  return (
    <div className="flex items-center gap-4">
      {/* <Avatar className="h-12 w-12">
        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
        <AvatarFallback>{author.initials}</AvatarFallback>
      </Avatar> */}
      <div>
        <h3 className="font-semibold">
          {title} {fullname} • {organization}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(createdAt)}
        </p>
      </div>
    </div>
  )
}
