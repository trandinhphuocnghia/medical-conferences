import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Post } from '@/payload-types'
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { Play } from 'lucide-react'

interface DateInfo {
  date: string
  label: string
}

const EventTimeline: React.FC<Post> = ({
  earlyRegistrationDeadline,
  abstractSubmissionDeadline,
  notificationOfAcceptanceDate,
  startDate,
  endDate,
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rawDates: DateInfo[] = [
    { date: abstractSubmissionDeadline, label: 'Abstract Submission Deadline' },
    { date: notificationOfAcceptanceDate, label: 'Notification of Acceptance' },
    {
      date: earlyRegistrationDeadline,
      label: 'Presenter Registration Deadline',
    },
    {
      date: startDate,
      label: 'Start',
    },
    {
      date: endDate,
      label: 'End',
    },
  ]

  const parsedDates = rawDates.map((item) => ({
    date: new Date(item.date),
    label: item.label,
  }))

  const sortedDates = parsedDates
    .filter((item) => !isNaN(item.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (sortedDates.length === 0) {
    return (
      <div className="text-red-500 font-bold p-4 bg-red-100 rounded-lg">
        No valid event dates provided.
      </div>
    )
  }

  const timelineMarkers = sortedDates

  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-500', ring: 'ring-blue-300' },
    { bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-300' },
    { bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-300' },
    { bg: 'bg-pink-600', text: 'text-pink-600', ring: 'ring-pink-300' },
    { bg: 'bg-pink-600', text: 'text-pink-600', ring: 'ring-pink-300' },
  ]

  const isBeforeStart = today.getTime() < sortedDates[0].date.getTime()
  const isAfterEnd =
    today.getTime() > sortedDates[sortedDates.length - 1].date.getTime()

  return (
    <div className="flex py-12 flex-col gap-8">
      <div className="grid grid-cols-5">
        {timelineMarkers.map((item, index) => {
          const colorSet = colors[index % colors.length]
          const isPast = item.date.getTime() < today.getTime()
          const isToday = item.date.toDateString() === today.toDateString()

          const markerClasses = isToday
            ? 'ring-red-500 border-red-500'
            : isPast
              ? 'ring-gray-400 border-gray-400'
              : `${colorSet.ring} `

          const month = item.date
            .toLocaleString('en-US', { month: 'short' })
            .toUpperCase()
          const day = item.date.getDate()
          const weekday = item.date.toLocaleString('en-US', {
            weekday: 'short',
          })

          // Date text color matches the circle's primary color
          const textColor = isPast ? 'text-gray-600' : `${colorSet.text}`

          return (
            <div key={index} className="flex flex-col items-center w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`w-32 h-32 p-1 rounded-full border-2 border-white shadow-xl relative flex flex-col justify-center items-center font-extrabold text-center transition-all duration-300 ring-4 ring-opacity-30 ${markerClasses} ${textColor} cursor-pointer bg-white`}
                  >
                    <div className="text-sm">{month}</div>
                    <div className="text-5xl my-1 leading-none">{day}</div>
                    <div className="text-sm">({weekday})</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-xs text-gray-300">
                    {item.date.toLocaleDateString()}
                  </div>
                </TooltipContent>
              </Tooltip>

              <div
                className={`w-1 h-6 ${isPast ? 'bg-gray-400' : 'bg-gray-300'} my-1`}
              ></div>

              <div className="mt-2 text-sm text-gray-700 font-medium whitespace-normal text-center w-20">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>

      <Alert variant="info" appearance="light">
        <AlertIcon>
          <Play />
        </AlertIcon>
        <AlertTitle>
          {isBeforeStart && (
            <p className="font-medium">
              The event has <b>not yet started</b>. Today is{' '}
              <b>
                {(
                  (sortedDates[0].date.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(0)}
                days
              </b>{' '}
              before the start date.
            </p>
          )}
          {isAfterEnd && (
            <p className="font-medium">
              The event has <b>concluded</b>. It ended{' '}
              <b>
                {(
                  (today.getTime() -
                    sortedDates[sortedDates.length - 1].date.getTime()) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(0)}
                days
              </b>{' '}
              ago.
            </p>
          )}
          {!isBeforeStart && !isAfterEnd && (
            <p className="font-medium">
              The event is currently <b>in progress</b>. Today falls within the
              key dates of the conference.
            </p>
          )}
        </AlertTitle>
      </Alert>
    </div>
  )
}

export default EventTimeline
