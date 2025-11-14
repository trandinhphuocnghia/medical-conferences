// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Post, User } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'

export function AuthorTop({
  author,
  createdAt,
}: {
  author: Post['created_by']
  createdAt: Post['createdAt']
}) {
  const { name, organization, title } = author as User

  return (
    <div className="flex items-center gap-4 mb-12 pb-8 border-b">
      {/* <Avatar className="h-12 w-12">
        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
        <AvatarFallback>{author.initials}</AvatarFallback>
      </Avatar> */}
      <div>
        <h3 className="font-semibold">
          {title} {name} • {organization}
        </h3>
        <p className="text-sm text-muted-foreground">{formatDateTime(createdAt)}</p>
      </div>
    </div>
  )
}
