'use client'
import { Post, UserGroup } from '@/payload-types'
import { formatDateRange } from '@/utilities/dateUtils'

const ConferenceOverview = ({ post }: { post: Post }) => {
  const { title, theme, host, venueCity, contactEmails } = post
  const data = [
    { label: 'Title', value: title },
    {
      label: 'When',
      value: formatDateRange(post?.startDate, post?.endDate),
    },
    { label: 'Theme', value: theme },
    { label: 'Host', value: (host as UserGroup)?.name || '-' },
    {
      label: 'Secretariat',
      value: (
        <a
          href={`mailto:${contactEmails?.[0]?.email}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          E-mail: {contactEmails?.[0]?.email}
        </a>
      ),
    },
  ]

  return (
    <div id="abstract-overview" className=" bg-white rounded-xl border-gray-100 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 pb-2 text-gray-800 border-b-2 border-indigo-500">
        Overview
      </h1>
      <dl className="divide-y divide-gray-200">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
            <dt className="text-sm font-medium text-gray-700 bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-md">
              {item.label}
            </dt>
            <dd className="text-sm text-gray-900 sm:col-span-2 p-2 sm:p-0">{item?.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ConferenceOverview
