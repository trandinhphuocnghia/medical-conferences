interface FeatureCardProps {
  iconName: string
  title: string
  description: string
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
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

export const Features = () => (
  <section className="w-full" id="about">
    <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-4 lg:py-16 @container">
      <div className="flex flex-col gap-4">
        <h2 className="text-slate-900 dark:text-slate-50 tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
          About Our Organization
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal max-w-[720px]">
          We are dedicated to fostering innovation and collaboration within the medical community.
          Discover our core values and commitment to excellence.
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
