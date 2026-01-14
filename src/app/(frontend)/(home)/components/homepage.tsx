import { Post } from '@/payload-types'
import React from 'react'
import { Contact } from './contact'
import { Doctors } from './doctors'
import { Events } from './events'
import { Features } from './features'
import { Sponsors } from './sponsors'

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

export const Homepage = ({ conferences }: { conferences: Post[] }) => (
  <>
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-col items-center">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
              <Hero />
              <Features />
              <Events conferences={conferences} />
              <Doctors />
              <Sponsors />
              <Contact />
            </div>
          </main>
        </div>
      </div>
    </div>
  </>
)
