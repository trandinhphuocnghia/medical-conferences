import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Category, Post } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ConferenceCardProps {
  post: Post
}

export default function ConferenceCard({ post }: ConferenceCardProps) {
  return (
    <Card
      key={post.id}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Article Content */}
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between mb-3">
          {/* <div className="flex gap-1">
            {(post.category as Category[])?.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.title}
              </Badge>
            ))}
          </div> */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            {formatDateTime(post.start_date || '')}
          </div>
        </div>
        <CardTitle className="text-xl">{post.title}</CardTitle>
        <CardDescription className="!mt-4 line-clamp-3">{post.theme}</CardDescription>
      </CardHeader>

      {/* Footer CTA */}
      <CardContent className="pb-4">
        <Link href={`/posts/${post.slug}`}>
          <Button variant="link" className="px-0 justify-between text-primary hover:cursor-pointer">
            Read Article
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
