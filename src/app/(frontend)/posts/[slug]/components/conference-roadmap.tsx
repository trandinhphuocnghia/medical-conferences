import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CalendarCheck, CalendarClock, Flag } from 'lucide-react'
import React from 'react'

interface DateInfo {
  date: string
  label: string
}

interface EventRoadmapProps {
  startDate: string
  earlyRegistrationDeadline: string
  endDate: string
  abstractSubmissionDeadline: string
  notificationOfAcceptanceDate: string
}

const EventRoadmap: React.FC<EventRoadmapProps> = ({
  startDate,
  earlyRegistrationDeadline,
  endDate,
  abstractSubmissionDeadline,
  notificationOfAcceptanceDate,
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rawDates: DateInfo[] = [
    { date: abstractSubmissionDeadline, label: 'Abstract Deadline' },
    { date: earlyRegistrationDeadline, label: 'Early Reg. Deadline' },
    { date: startDate, label: 'Start Date' },
    { date: notificationOfAcceptanceDate, label: 'Acceptance Notif.' },
    { date: endDate, label: 'End Date' },
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

  const firstDate = sortedDates[0].date
  const lastDate = sortedDates[sortedDates.length - 1].date
  const totalDuration = lastDate.getTime() - firstDate.getTime()

  let todayPosition = 0
  if (today.getTime() < firstDate.getTime()) {
    todayPosition = 0
  } else if (today.getTime() > lastDate.getTime()) {
    todayPosition = 100
  } else if (totalDuration > 0) {
    todayPosition =
      ((today.getTime() - firstDate.getTime()) / totalDuration) * 100
  } else {
    todayPosition = 50
  }

  const isBeforeStart = today.getTime() < firstDate.getTime()
  const isAfterEnd = today.getTime() > lastDate.getTime()

  return (
    <div className="flex flex-col border-t gap-4 py-12 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        🗓️ Event Roadmap
      </h2>

      <div className="relative w-full h-2 bg-gray-200 rounded-full ">
        {/* Progress Bar */}
        <div
          className="absolute h-2 bg-indigo-500 rounded-full transition-all duration-1000"
          style={{ width: `${todayPosition}%` }}
        ></div>

        {/* Today's Marker */}
        <div
          className="absolute transform -translate-x-1/2 -top-3 group cursor-pointer z-20"
          style={{ left: `${todayPosition}%` }}
        >
          <div className="w-6 h-6 p-1 bg-red-500 rounded-full border-2 border-white shadow-lg relative transition-all duration-300 group-hover:scale-125">
            <Flag className="w-full h-full text-white" />
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-2 min-w-28 bg-red-700 text-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30 pointer-events-none whitespace-nowrap">
            <div className="text-xs font-bold text-center">
              {isBeforeStart
                ? 'Before Event'
                : isAfterEnd
                  ? 'Concluded'
                  : 'Today'}
            </div>
            <div className="absolute w-3 h-3 bg-red-700 transform rotate-45 -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></div>
          </div>
        </div>

        {/* Event Date Markers (Hoverable) */}
        {sortedDates.map((item, index) => {
          const itemPosition =
            totalDuration > 0
              ? ((item.date.getTime() - firstDate.getTime()) / totalDuration) *
                100
              : (index / sortedDates.length) * 100

          const isPast = item.date.getTime() < today.getTime()
          const isToday = item.date.toDateString() === today.toDateString()

          const markerClasses = isToday
            ? 'bg-red-500 text-white'
            : isPast
              ? 'bg-green-500 text-white'
              : 'bg-indigo-500 text-white'

          const IconComponent = isPast ? CalendarCheck : CalendarClock

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -top-3 group cursor-pointer z-10"
              style={{ left: `${itemPosition}%` }}
            >
              <Tooltip>
                <TooltipTrigger
                  className={`w-6 h-6 p-1 rounded-full border-2 border-white shadow-md relative transition-all duration-300 group-hover:scale-125 ${markerClasses}`}
                >
                  <IconComponent className="w-full h-full" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-xs text-gray-300">
                    {item.date.toLocaleDateString()}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )
        })}
      </div>

      <div className="pt-4 flex flex-col w-full">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          📌 Key Dates Overview
        </h3>
        <ul className="space-y-2 w-full">
          {sortedDates.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 rounded-md ${item.date.getTime() < today.getTime() ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'} ${item.date.toDateString() === today.toDateString() ? 'ring-2 ring-red-500' : ''}`}
            >
              <span className="font-medium text-gray-800">{item.label}</span>
              <span
                className={`text-sm flex items-center ${item.date.getTime() < today.getTime() ? 'text-green-700 font-bold' : 'text-indigo-600'}`}
              >
                {item.date.toLocaleDateString()}
                {item.date.toDateString() === today.toDateString() && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                    IS TODAY
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className=" p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-lg">
        {isBeforeStart && (
          <p className="font-medium">
            The event has **not yet started**. Today is **
            {(
              (firstDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
            ).toFixed(0)}
            days** before the start date.
          </p>
        )}
        {isAfterEnd && (
          <p className="font-medium">
            The event has **concluded**. It ended **
            {(
              (today.getTime() - lastDate.getTime()) /
              (1000 * 60 * 60 * 24)
            ).toFixed(0)}
            days** ago.
          </p>
        )}
        {!isBeforeStart && !isAfterEnd && (
          <p className="font-medium">
            The event is currently **in progress**. Today is on the roadmap
            between the key dates.
          </p>
        )}
      </div>
    </div>
  )
}

export default EventRoadmap
