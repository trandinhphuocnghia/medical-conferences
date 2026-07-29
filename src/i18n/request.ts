import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the locale resolved by the middleware from the URL.
  // Fallback to 'vi' if it is somehow undefined (e.g. in edge cases).
  const locale = (await requestLocale) ?? 'vi'

  const messages = (await import(`./messages/${locale}.json`)).default

  return {
    locale,
    messages,
  }
})
