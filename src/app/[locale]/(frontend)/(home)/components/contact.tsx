import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const ContactInfoItem = ({
  title,
  content,
}: {
  iconName: string
  title: string
  content: string
}) => (
  <div className="flex items-start gap-4">
    <div>
      <h3 className="font-bold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{content}</p>
    </div>
  </div>
)

export const Contact = () => (
  <section className="w-full py-10 sm:py-16" id="contact">
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-4">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-slate-900 dark:text-slate-50 text-[32px] font-bold leading-tight tracking-[-0.033em]">
          Get In Touch
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal max-w-2xl mx-auto">
          We&apos;re here to answer any questions you may have. Reach out to us and we&apos;ll
          respond as soon as we can.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <ContactInfoItem
            iconName="location_on"
            title="Address"
            content="123 Health St, Medville, USA 45678"
          />
          <ContactInfoItem iconName="mail" title="Email" content="contact@mediorg.com" />
          <ContactInfoItem iconName="call" title="Phone" content="(555) 123-4567" />
        </div>
        <form className="flex flex-col gap-4">
          <Input placeholder="Your Name" type="text" />

          <Input placeholder="Your Email" type="email" />

          <Textarea placeholder="Your Message" rows={4} />

          <Button>Send Message</Button>
        </form>
      </div>
    </div>
  </section>
)
