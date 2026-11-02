import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DOCTORALIA_URL, REVIEWS } from '../content'
import { reveal } from './Especialidades'

// His file card, the facts a patient checks before booking. All of them come from his profile and the page's content.
const FACTS = [
  ['Experiencia', '15 años'],
  ['Consulta', 'Centro de Salud San Lucas, Box D, Rancagua'],
  ['Domicilio', 'Rancagua y Machalí'],
  ['Previsión', 'Fonasa · boleta reembolsable en Isapre'],
]

// Phones show this many reviews before "Ver más"
const FIRST = 3

// Who he is and what his patients say, as one section: his card stays beside the reviews while you read them.
// The photo is the one on his current site (kinesiologiayterapiafisica.com).
export default function QuienSoy() {
  const [all, setAll] = useState(false)

  return (
    <section id="quien-soy" className="scroll-mt-8 bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      {/* Phones: heading, card, reviews. Wide screens: the card on the left, beside the heading and the reviews */}
      <div className="grid gap-12 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-x-20 lg:gap-y-16">
        <div className="lg:col-start-2 lg:row-start-1">
          <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
            ¿Quién soy?
          </motion.h2>
          <motion.p {...reveal(0.06)} className="mt-8 max-w-2xl text-2xl leading-[1.25] tracking-[-0.02em] md:text-3xl">
            Soy kinesiólogo y profesor de Educación Física, con 15 años de experiencia. Mis pacientes dicen que les
            explico todo en detalle, antes y durante el tratamiento.
          </motion.p>
        </div>

        <motion.div {...reveal(0)} className="max-w-sm self-start lg:sticky lg:top-28 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 text-ink shadow-none">
            <img
              src="/jose-carrasco.webp"
              alt="José Antonio Carrasco, kinesiólogo"
              width={529}
              height={530}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover object-top lg:aspect-[4/5]"
            />
            <CardHeader className="gap-2 px-6 pt-6">
              <CardTitle className="text-2xl leading-tight font-medium tracking-[-0.02em]">José Antonio Carrasco Gómez</CardTitle>
              <CardDescription className="text-base text-ink/75">Kinesiólogo y profesor de Educación Física</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pt-5 pb-7">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-teal px-3 py-1 text-sm font-medium text-white">Certificado de excelencia 2024 · 2025</span>
                <span className="rounded-full border border-ink/15 px-3 py-1 text-sm font-medium">
                  133 opiniones en Doctoralia
                </span>
              </div>
              <dl className="mt-6 grid gap-3 text-base">
                {FACTS.map(([term, value]) => (
                  <div key={term} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
                    <dt className="text-ink/65">{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-start-2 lg:row-start-2">
          <h3 id="opiniones" className="scroll-mt-28 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
            Lo que dicen mis pacientes
          </h3>
          <ul className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {REVIEWS.map((review, i) => (
              <motion.li key={review.author} {...reveal(0.04 * (i % 2))} className={!all && i >= FIRST ? 'hidden sm:block' : ''}>
                <figure>
                  <blockquote className="text-lg leading-snug md:text-xl">“{review.quote}”</blockquote>
                  <figcaption className="mt-3 text-base">
                    {review.author}
                    <span className="text-ink/70"> · Paciente · {review.date}</span>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {!all && (
              <button
                type="button"
                onClick={() => setAll(true)}
                className="h-12 rounded-full border-2 border-ink px-6 text-base font-semibold transition-colors hover:bg-ink hover:text-paper sm:hidden"
              >
                Ver más opiniones
              </button>
            )}
            <a href={DOCTORALIA_URL} className="inline-flex items-center gap-1 text-base font-semibold text-teal underline underline-offset-4 hover:no-underline">
              Leer las 133 opiniones en Doctoralia
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
