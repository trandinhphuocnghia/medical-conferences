interface EventCardProps {
  date: string
  title: string
  description: string
  imageStyle: string
  link: string
  actionText: string
}

const EventCard = ({
  date,
  title,
  description,
  imageStyle,
  link,
  actionText,
}: EventCardProps) => (
  <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div
      className="h-40 bg-cover bg-center"
      data-alt={`Abstract image for ${title}`}
      style={{ backgroundImage: imageStyle }}
    ></div>
    <div className="p-6 flex flex-col gap-3 grow">
      <p className="text-sm font-medium text-primary">{date}</p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 grow">
        {description}
      </p>
      <a
        className="mt-4 text-sm font-bold text-primary hover:underline"
        href={link}
      >
        {actionText}
      </a>
    </div>
  </div>
)

export const Events = () => (
  <section className="w-full" id="events">
    <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-4 lg:py-16">
      <h2 className="text-slate-900 dark:text-slate-50 text-center text-[22px] font-bold leading-tight tracking-[-0.015em]">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard
          date="OCT 28, 2024"
          title="Annual Cardiology Symposium"
          description="Join leading experts to discuss the latest advancements in cardiovascular medicine."
          imageStyle="url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzHWnEpakIYGjvdpU3-W-HOCusYF5CybbMwE8xooRmoEbJdayOqfQQJS1FVUVW-ecGuBB6fJOErSuENeIsOI2uilfvcvI_wEVmzlr0GhBZl6OoglQSEeCENvVv2zw9YvD_SfM9wNpmvFUXmPPZsi23iNtBMyCPX-B16zkx8kvmBuMbRtS2IAd3UuyZOYWIj7HrjO_PwIK2KhWtdpKORfgPy4y9faRWxbtK-yYU_xtmx2EplbkhDjiydw7VZh0mv99uDrgkPidh1NfI')"
          link="#"
          actionText="Register Now"
        />
        <EventCard
          date="NOV 15, 2024"
          title="Neurology Research Webinar"
          description="An online session covering breakthroughs in neurological disorder treatments."
          imageStyle="url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOBWbnFqOh_ZO3Z6tYMvZyIXZDSAqyc3l-ofPNOVOfSzJPDM-7w1ukgwTx8s1O3nDIhoiJeYMguRZMpu-97ZnasU6McwSON-q6139bK3Jnb32vWH7UPBH2zdkIQ2_RLeGK3JynJPQSDBWHQht3rs_WQUhmvpUUOBimuzn-jZQZL0lRs0v2j2lGc-culOlsmY8P9X1ayDkD7k0za6J6d5b9PwpbEc9ca38-deAfHOTCRDwT09bnSvxrUIGTdfhOIjHjl_NQk-4t7q-')"
          link="#"
          actionText="Learn More"
        />
        <EventCard
          date="DEC 05, 2024"
          title="Pediatric Care Workshop"
          description="A hands-on workshop for healthcare professionals specializing in pediatrics."
          imageStyle="url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGk2LhbJGIT3MAGVvS0JBdLkmgdVyIUbJrZsMkVanDTKStX_O9WnqfPmm8dp3leL4nIgL567xffy_IV1glFhnbtLAbQY_wmUrDVVfX2aLTnqDBDclo7CXcWMIB79cpyL8tiM-96ocKbjSRfj7_odV2oWTgdUn0QBMUgp-TAwgJThykY4dM-NuuVGq8_445Z0ke48U2Vcv0bmwCbAYEl5F0Of1lz5cO3tEtdNalAwDD9gBft8poiOZpxavcDdj-yAD7KehsxABcmkqJ')"
          link="#"
          actionText="Details"
        />
      </div>
    </div>
  </section>
)
