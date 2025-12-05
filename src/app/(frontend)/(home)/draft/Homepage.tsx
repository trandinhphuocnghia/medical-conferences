import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

interface FeatureCardProps {
  iconName: string
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="flex flex-1 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-col">
    <div className="flex flex-col gap-1">
      <h3 className="text-slate-900 dark:text-slate-50 text-base font-bold leading-tight">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
        {description}
      </p>
    </div>
  </div>
)

interface DoctorCardProps {
  imageStyle: string
  name: string
  specialty: string
  alt: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  imageStyle,
  name,
  specialty,
  alt,
}) => (
  <div className="flex flex-col gap-3 text-center pb-3">
    <div className="px-4">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
        data-alt={alt}
        style={{ backgroundImage: imageStyle }}
      ></div>
    </div>
    <div>
      <p className="text-slate-900 dark:text-slate-50 text-base font-medium leading-normal">
        {name}
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
        {specialty}
      </p>
    </div>
  </div>
)

interface EventCardProps {
  date: string
  title: string
  description: string
  imageStyle: string
  link: string
  actionText: string
}

const EventCard: React.FC<EventCardProps> = ({
  date,
  title,
  description,
  imageStyle,
  link,
  actionText,
}) => (
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

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200/80 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 sm:px-8 md:px-10 py-3">
    <div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
      <div className="size-8 text-primary">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L4.5 5v6c0 5.55 3.84 10.74 7.5 12 3.66-1.26 7.5-6.45 7.5-12V5L12 2zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V13H5V6.3l7-3.11v9.8z"></path>
        </svg>
      </div>
      <h2 className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em]">
        MediOrg
      </h2>
    </div>
    <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
      <a
        className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
        href="#about"
      >
        About
      </a>
      <a
        className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
        href="#doctors"
      >
        Doctors
      </a>
      <a
        className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
        href="#events"
      >
        Events
      </a>
      <a
        className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
        href="#sponsors"
      >
        Sponsors
      </a>
    </nav>
    <div className="flex items-center gap-4">
      <a
        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
        href="#contact"
      >
        <span className="truncate">Contact Us</span>
      </a>
    </div>
  </header>
)

const Footer: React.FC = () => (
  <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        © 2024 MediOrg. All Rights Reserved.
      </p>
      <div className="flex gap-6">
        <a
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
)

const Hero: React.FC = () => (
  <section className="w-full py-5 px-4 sm:px-6 lg:px-0" id="hero">
    <div className="@container">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
          data-alt="Doctors collaborating in a modern medical facility"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBY7A4l27xcQm11L7lC2WfZwyU7jMzIQCe8odRor98KPxKBPcGBkJCVW1tx3iDbKo2jLvnJyDDtaDdHuQQmdVEobcudq2Wq9gDC3H9UA-uUV17hfmfv03h-VkJ3sYZAli7OCOiUniX7c0IYLHMJEtX0UTfJXfMr_T8UdqnGoF8GKToPJjxUEZ-FdXIO2YoFpkZ6EpzuR8IyzBG1Yr9ROMd9Uiq3NRrww4JdIM4wzHqrV0k55lAD8jCnzrrbxWlC1Lk8dTV9BYB4BZHG")`,
          }}
        >
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              Advancing Medical Excellence Together
            </h1>
            <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              Our mission is to lead the way in medical research, education, and
              patient care for a healthier future.
            </h2>
          </div>
          <a
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors"
            href="#about"
          >
            <span className="truncate">Learn More</span>
          </a>
        </div>
      </div>
    </div>
  </section>
)

const Features: React.FC = () => (
  <section className="w-full" id="about">
    <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-4 lg:py-16 @container">
      <div className="flex flex-col gap-4">
        <h2 className="text-slate-900 dark:text-slate-50 tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
          About Our Organization
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal max-w-[720px]">
          We are dedicated to fostering innovation and collaboration within the
          medical community. Discover our core values and commitment to
          excellence.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-0">
        <FeatureCard
          iconName="science"
          title="Pioneering Research"
          description="Driving the future of medicine through groundbreaking studies and clinical trials."
        />
        <FeatureCard
          iconName="school"
          title="Professional Education"
          description="Providing continuous learning opportunities for medical professionals."
        />
        <FeatureCard
          iconName="favorite"
          title="Exceptional Patient Care"
          description="Ensuring the highest standards of care and compassion for all our patients."
        />
      </div>
    </div>
  </section>
)

const Doctors: React.FC = () => (
  <section
    className="w-full bg-white dark:bg-slate-900 py-10 sm:py-16"
    id="doctors"
  >
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-4">
      <h2 className="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-5 pt-5 text-center">
        Meet Our Doctors
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 p-4">
        <DoctorCard
          name="Dr. Emily Carter"
          specialty="Cardiologist"
          alt="Headshot of Dr. Emily Carter"
          imageStyle='url("https://lh3.googleusercontent.com/aida-public/AB6AXuDobKhptaxaZvqpgO000VwNUE1AHoBM3hIwF2yvI6gONFalDsjckA9yiFKnLwF6qL1m6OHXhuOT-dk6J84GKPzb0sOr4IIrkyePAug3EETgkbbm-I0mBoMw5qo8_YlCw519Nf9wIgNcQpNcB8wbUTtcNRIBJG8H27tXUTQustHm-Ja4qS2bh3UKfrQL2eSCaLIFm0yBbhe42E4wrMiiAbXFvKFzU0L4MpLopAkBhSkAM6xfhAOP8O4YSaGcXIz6e7VoIniy5i8ndTqo")'
        />
        <DoctorCard
          name="Dr. Ben Adams"
          specialty="Neurologist"
          alt="Headshot of Dr. Ben Adams"
          imageStyle='url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZgqGX7xhcjCksWlL-p0tc4BmYOdc1Bqg8sfX0ImLfQIl1UPmW5Siudr5vIfbaA6mIei496TBos0T1E2GZ1PwUWewTkX3FwMScpQcDLmKQeTiOP43zI_scFI3ESdgB4E20u9eFCSlUsmxQksGWHpPvpW6nXjlkPnoY3RkCB5MkX5wvXG8KwtcgVw6jhh9CDtv2Q9krvDskb2Td6enumDIibPvAgFknMZgbpKlobYnWZmHT3boG9kLbuknS5TlnE1cvS1FrygBu3KQK")'
        />
        <DoctorCard
          name="Dr. Olivia Chen"
          specialty="Pediatrician"
          alt="Headshot of Dr. Olivia Chen"
          imageStyle='url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOg74pnybNkAJNF8p8qL3KLPHaMX5oTyGc0rn8w_xlXUtOzELGga-IbQeC1BEuXrLiz0iRLNgpFRHHUcrN0RH6J4o1p9p-KsMkIp2ggWgSYSuE4YIGvgICVH5N38WiuEdaOioxH3TBjPKBgACJpRaRenx5Fs50cBrxBxMVcAuRdgLkM6Xkzm4jLJenfQnObP1JE_4mD6KAinm-3gYFGoBut5fStlgCsnhqUryfICRlAsVuxTsJM0Z0Dgd5M8CGCMgw4tlAt1No5c84")'
        />
        <DoctorCard
          name="Dr. Samuel Rodriguez"
          specialty="Oncologist"
          alt="Headshot of Dr. Samuel Rodriguez"
          imageStyle='url("https://lh3.googleusercontent.com/aida-public/AB6AXuATMveYJOwgkbz0Tt6mlh-L5oUGh_gkjCOKGqNyaW-02OrMv1ed9wx05dsFv-njXPEOK7my0C3OmbyhlB1FVgFyk5maToUf-PccEaqcv3rfPeJfxT4X6tzvd5NCoUGk3bqI3GHFd4WWZRuxbcUff5WK0FzQcdi-CG2n1h9xartd1ITm89zeW2ZgA39-6e5yZQhhWVwvSA3x9LalHJZ3zOVX0zvMzFp3P_fhjx1ZhNWBwYE5LP9QR30sa7rFncPMt50AomIafJEA28Fs")'
        />
      </div>
    </div>
  </section>
)

const Events: React.FC = () => (
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

const Sponsors: React.FC = () => (
  <section
    className="w-full bg-white dark:bg-slate-900 py-10 sm:py-16"
    id="sponsors"
  >
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-4 items-center">
      <h2 className="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-8">
        Our Sponsors
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-6 w-full items-center">
        <img
          className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-auto"
          data-alt="Sponsor Logo 1"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuADCH0plU-3FhCPPu1-N7-GLXB3LlLpVia42IS2o9n8mP4f2zy8McUDFwQX3OykPccwRQMi2IwE4lwB2iE3QYLRW0qJh-TrHPKJhcdalapFN4vhDHBiP1m6UA2iBkOJ7r0yQNG0oWMDezoNYr_hbO9HFkxiKESK92r0ABts9FKMdTYfbyzXLOUbCCOIsp3LqYap98EVXv1OhmFZNsxDbI_BS_h2zrhRUKZ-Gvi-WwZy1hfFmEkmdgqaoA8X3KRwvSDY5pyOd1f40EWx"
        />
        <img
          className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-auto"
          data-alt="Sponsor Logo 2"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJUQcNEKx3L68sfJt7pRLp5qk1_JqNoNTKBm2vdrPmlWvy8QB6BpkbTFYfGgentORmx0SRR6_PeJrhImCLZuAbf6sP_tiXOpfLarRjrphoetM0bSr7Z14N0n65bfzZmhHdsoFwE5TJtdOG8w1Q_IuRTH69wpwiAoftr8PP2fp8lOB1iJnqroSwsv2xYk5AsWfqMfpydBRCyTPwC3wMM9KeQbmVrF3aid58q9Yn4n_bShh3PMm7xvU-EJYQKcRCYHFYaFQs72HDXHT-"
        />
        <img
          className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-auto"
          data-alt="Sponsor Logo 3"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwkHVNQNJwUNzh0oORkOl27--5P4y4XhKnPwHlDdd5_6rb5Azg4S3Sqg5VaInBRQVg2Tmu3MlAIGNMlgdL7NOOw8L5Z4EP0eRF1GPNIQYNqu020_KVPDTAstR_4wsOOXoftD1ScfRc4vSWl3FraDEzgXfEUDFwY76dNYarCH-WtW7ZxGIwB-OK8ZtyCSQhuRGqDtOVQeo2qYIxw57tTmmI686OwQS-tUx2kdzcctSCaIQqrlL_eX2qS11Vq03dQ602lOdGISip9hG"
        />
        <img
          className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-auto"
          data-alt="Sponsor Logo 4"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjmgaMjK8Autrtlctb4FbHsj8br6R_ixlsG8VhWHXVAK4BdBGd2BEOAOdoW743cZHTSQGINVzAstwMCNvE8ztjsjgyFsnUdOWveskR58ZRwlVLHaG8lwceIi1jS-gZX_KHQiqK6wfxolbWtA4LeIPNMFDI7m-i41WCkftltaMv2z1YeYfD5kosBWi6GnXVCpxBElkxq5LsM61K6oyE2z2v-PESH2s4xrAlzDdnUEVBuSeJNlfX-R8i216jkTjAJSnc4cWahRswV-k"
        />
        <img
          className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-auto"
          data-alt="Sponsor Logo 5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZsyMAVPHzy5_zyJVbwrI6BKrjuSTR1cptP2RTdDKjP6dmjarELMj6J7H-rt70QrhOcfXUMcEBL9jepTjojYVKPrWz6wDLP3YONnz3d9zPbFbqWvGua3K3_TEUo8kvGZ0gJD1ux4wPs0yA-f4lVQZ_umYFNr8Ht0ekfI63An1AQoNEIk6v_9dV3UC9vO2D2RVSLHrPfX33tx7HxiHWHtDe81POXsgafCIUV6kGJ60BAqZEr3MvDsvw8FiRtC1XJcV3YfLEIBrVAxhf"
        />
      </div>
    </div>
  </section>
)

const ContactInfoItem: React.FC<{
  iconName: string
  title: string
  content: string
}> = ({ iconName, title, content }) => (
  <div className="flex items-start gap-4">
    <div>
      <h3 className="font-bold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{content}</p>
    </div>
  </div>
)

const Contact: React.FC = () => (
  <section className="w-full py-10 sm:py-16" id="contact">
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-4">
      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-slate-900 dark:text-slate-50 text-[32px] font-bold leading-tight tracking-[-0.033em]">
          Get In Touch
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal max-w-2xl mx-auto">
          We&apos;re here to answer any questions you may have. Reach out to us
          and we&apos;ll respond as soon as we can.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <ContactInfoItem
            iconName="location_on"
            title="Address"
            content="123 Health St, Medville, USA 45678"
          />
          <ContactInfoItem
            iconName="mail"
            title="Email"
            content="contact@mediorg.com"
          />
          <ContactInfoItem
            iconName="call"
            title="Phone"
            content="(555) 123-4567"
          />
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

export const Homepage: React.FC = () => (
  <>
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <main className="flex flex-col items-center">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
              <Hero />
              <Features />
              <Doctors />
              <Events />
              <Sponsors />
              <Contact />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  </>
)
