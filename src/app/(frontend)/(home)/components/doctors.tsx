interface DoctorCardProps {
  imageStyle: string
  name: string
  specialty: string
  alt: string
}

const DoctorCard = ({ imageStyle, name, specialty, alt }: DoctorCardProps) => (
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

export const Doctors = () => (
  <section className="w-full bg-white dark:bg-slate-900 py-10 sm:py-16" id="doctors">
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
