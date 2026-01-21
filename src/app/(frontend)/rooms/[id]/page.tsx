import { getSeatsByRoomId } from '@/app/actions/seats/getSeatsByRoomId'
import { cookies } from 'next/headers'
import { Seats } from './components/Seats'

type Args = {
  params: Promise<{
    id?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { id = '' } = await paramsPromise

  const seats = await getSeatsByRoomId({ id })

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!seats) return <>WTF</>

  return (
    <>
      <Seats seats={seats?.docs} token={token || null} />
    </>
  )
}
