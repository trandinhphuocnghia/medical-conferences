'use client'
import { getConference } from '@/app/actions/conferences/getConferences'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useMemo, useState } from 'react'

export const SelectTopic = ({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string) => void
}) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    async function fetchConference() {
      try {
        const res = await getConference({ id: 1 })
        if (res?.conferences) {
          if (res?.conferences?.topics) {
            setOptions(
              res?.conferences?.topics.map((item) => ({
                label: item?.name,
                value: item?.id,
              })),
            )
          }
        }
      } catch (err) {
      } finally {
      }
    }

    fetchConference()
  }, [])

  const selected = useMemo(() => {
    return options?.find((item) => item.value?.toString() === value?.toString())
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
