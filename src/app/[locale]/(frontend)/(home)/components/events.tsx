import { Post } from '@/payload-types'

interface EventCardProps {
  date: string
  title: string
  description: string
  imageStyle: string
  link: string
  actionText: string
}

const EventCard = ({ date, title, description, imageStyle, link, actionText }: EventCardProps) => (
  <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div
      className="h-40 bg-cover bg-center"
      data-alt={`Abstract image for ${title}`}
      style={{ backgroundImage: imageStyle }}
    ></div>
    <div className="p-6 flex flex-col gap-3 grow">
      <p className="text-sm font-medium text-primary">{date}</p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 grow">{description}</p>
      <a className="mt-4 text-sm font-bold text-primary hover:underline" href={link}>
        {actionText}
      </a>
    </div>
  </div>
)

export const Events = ({ conferences }: { conferences: Post[] }) => {
  return (
    <section className="w-full" id="events">
      <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-4 lg:py-16">
        <h2 className="text-slate-900 dark:text-slate-50 text-center text-[22px] font-bold leading-tight tracking-[-0.015em]">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conferences?.map((conference) => (
            <EventCard
              key={conference.id}
              date="OCT 28, 2024"
              title={conference?.title || ''}
              description={conference?.theme || ''}
              imageStyle={''}
              link="#"
              actionText="Register Now"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
