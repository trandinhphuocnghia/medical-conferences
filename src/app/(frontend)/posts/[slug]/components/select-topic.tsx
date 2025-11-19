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

  const selected = useMemo(() => {
    return options?.find((item) => item.value.toString() === value?.toString())
  }, [value, options])

  return (
    <Select onValueChange={(value) => onChange(value)}>
      <SelectTrigger>
        <SelectValue>{selected?.label}</SelectValue>
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
