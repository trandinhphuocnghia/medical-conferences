import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is the locale resolved by the middleware from the URL.
  // Fallback to 'vi' if it is somehow undefined (e.g. in edge cases).
  const locale = (await requestLocale) ?? 'vi'

  return {
    locale,
    // Messages are loaded lazily per locale.
    // Create src/messages/vi.json and src/messages/en.json when you are
    // ready to add translation strings. Until then, return an empty object
    // so the app boots without errors.
    messages: {},
  }
})
