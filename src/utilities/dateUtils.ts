/**
 * Formats a date into a human-readable string.
 * Uses month names (e.g., "October") instead of numbers to avoid international ambiguity.
 * 
 * @param date - The date to format (Date object, timestamp string, or number)
 * @param options - Intl.DateTimeFormatOptions to override the default style
 * @param locale - The locale to use (defaults to 'en-US' for consistent international English)
 * @returns A formatted date string (e.g., "October 24, 2023")
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US'
): string => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }

  return d.toLocaleDateString(locale, options || defaultOptions)
}

/**
 * Formats a date range into a condensed human-readable string.
 * Handles same-month, different-month, and different-year ranges.
 * 
 * Example outcomes:
 * - "September 15–18, 2026" (Same month)
 * - "September 30 – October 2, 2026" (Different months, same year)
 * - "December 30, 2026 – January 2, 2027" (Different years)
 * 
 * @param start - Start date
 * @param end - End date
 * @param locale - The locale to use
 * @returns A formatted date range
 */
export const formatDateRange = (
  start?: Date | string | number | null,
  end?: Date | string | number | null,
  locale: string = 'en-US'
): string => {
  if (!start) return ''
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : null

  if (isNaN(startDate.getTime())) return ''

  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' }

  if (!endDate || isNaN(endDate.getTime())) {
    return formatDate(startDate, yearOpts, locale)
  }

  const isSameMonth = startDate.getMonth() === endDate.getMonth()
  const isSameYear = startDate.getFullYear() === endDate.getFullYear()

  if (isSameYear) {
    if (isSameMonth) {
      // "September 15–18, 2026"
      return `${startDate.toLocaleDateString(locale, opts)}–${endDate.getDate()}, ${endDate.getFullYear()}`
    }
    // "September 30 – October 2, 2026"
    return `${startDate.toLocaleDateString(locale, opts)} – ${endDate.toLocaleDateString(locale, yearOpts)}`
  }

  // "December 30, 2026 – January 2, 2027"
  return `${formatDate(startDate, yearOpts, locale)} – ${formatDate(endDate, yearOpts, locale)}`
}

/**
 * Formats a time string or Date object into a readable time.
 */
export const formatTime = (
  date: Date | string | number | null | undefined,
  locale: string = 'en-US'
): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  return d.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Helper specially for multi-part date displays (like in timelines)
 */
export const getMilestoneDate = (dateStr: string, locale: string = 'en-US') => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null

  return {
    day: date.getDate(),
    monthShort: date.toLocaleDateString(locale, { month: 'short' }),
    monthLong: date.toLocaleDateString(locale, { month: 'long' }),
    year: date.getFullYear(),
    weekday: date.toLocaleDateString(locale, { weekday: 'long' }),
    full: formatDate(date, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }, locale),
  }
}
