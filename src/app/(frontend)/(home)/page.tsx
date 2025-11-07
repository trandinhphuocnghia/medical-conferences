import { generateMetadata } from '../[slug]/page'
import SendEmailButton from './send-email'

export default function Home() {
  return (
    <div>
      <SendEmailButton />
    </div>
  )
}

export { generateMetadata }
