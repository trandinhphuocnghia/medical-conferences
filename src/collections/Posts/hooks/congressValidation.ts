import { Post } from "@/payload-types"
import { DateFieldValidation } from "payload"

export const validateCongressDate: DateFieldValidation = (val, { data }) => {
  if (!val) return true
  const date = new Date(val).getTime()
  const postData = data as Partial<Post>
  const start = postData?.startDate ? new Date(postData?.startDate).getTime() : null
  const end = postData?.endDate ? new Date(postData?.endDate).getTime() : null

  if (start && date < start) {
    return 'Date cannot be before conference start date'
  }
  if (end && date > end) {
    return 'Date cannot be after conference end date'
  }
  return true
}