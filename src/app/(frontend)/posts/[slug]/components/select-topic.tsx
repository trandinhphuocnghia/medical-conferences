'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Topic } from '@/payload-types'
import { useMemo } from 'react'

export const SelectTopic = ({
  value,
  onChange,
  topics = [],
}: {
  value?: string
  onChange: (value: string) => void
  topics: Topic[]
}) => {
  const options = useMemo(
    () =>
      topics.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })),
    [topics],
  )

  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((item, index) => (
            <SelectItem key={index} value={item?.value}>
              {item?.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
