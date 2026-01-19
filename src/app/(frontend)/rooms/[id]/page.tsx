import { getSeatsByRoomId } from '@/app/actions/seats/getSeatsByRoomId'
import { Seats } from './components/Seats'

type Args = {
  params: Promise<{
    id?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { id = '' } = await paramsPromise

  const seats = await getSeatsByRoomId({ id })

  if (!seats) return <>WTF</>

  return (
    <>
      <Seats seats={seats?.docs} />
    </>
  )
}
