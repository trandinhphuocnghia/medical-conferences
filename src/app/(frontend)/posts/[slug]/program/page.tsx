import { getConferenceBySlug } from '@/app/actions/conferences/getConferenceBySlug'
import { ProgramSection } from '../components/conference-program'
import { StickySubNav } from '../components/sticky-subnav'
import { formatDate } from '@/utilities/dateUtils'
import { notFound } from 'next/navigation'

type Args = {
    params: Promise<{
        slug?: string
    }>
}

export default async function ProgramPage({ params: paramsPromise }: Args) {
    const { slug = '' } = await paramsPromise

    const posts = await getConferenceBySlug({ slug })
    const conferenceData = posts?.docs?.[0]

    if (!conferenceData) return notFound()

    const startDate = conferenceData.startDate
        ? formatDate(new Date(conferenceData.startDate))
        : null
    const endDate = conferenceData.endDate
        ? formatDate(new Date(conferenceData.endDate))
        : null

    return (
        <div className="min-h-screen bg-background">
            <StickySubNav conferenceId={conferenceData.id} slug={slug} />

            {/* Program Page Header */}
            <section className="bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white pt-6 sm:pt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="font-mono text-[10px] sm:text-xs tracking-widest text-cyan-400 uppercase font-semibold">
                            Scientific Program
                        </span>
                        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                            {conferenceData.title}
                        </h1>
                        {conferenceData.theme && (
                            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl">
                                {conferenceData.theme}
                            </p>
                        )}
                        {startDate && endDate && (
                            <p className="mt-4 text-sm text-slate-400 font-mono">
                                {startDate} — {endDate}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Program Content */}
            <ProgramSection program={conferenceData.program} />


        </div>
    )
}
