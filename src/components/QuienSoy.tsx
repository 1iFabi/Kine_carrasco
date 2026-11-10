import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
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

// The first review is the statement; the rest ride the rail
const [LEAD, ...REST] = REVIEWS
const WORDS = `“${LEAD.quote}”`.split(' ')
// The words of his slogan ("Te lo explico") take the accent
const KEY = /explica|detalladamente/

// The statement turns to ink word by word as it crosses the middle of the screen, and back on the way up
function Statement() {
  const ref = useRef<HTMLQuoteElement>(null)
  const [lit, setLit] = useState(WORDS.length)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const light = () => {
      const r = ref.current!.getBoundingClientRect(), vh = window.innerHeight
      setLit(Math.round(Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (r.height + vh * 0.3))) * WORDS.length))
    }
    light()
    window.addEventListener('scroll', light, { passive: true })
    window.addEventListener('resize', light)
    return () => {
      window.removeEventListener('scroll', light)
      window.removeEventListener('resize', light)
    }
  }, [])

  return (
    <blockquote ref={ref} className="text-3xl leading-[1.08] font-medium tracking-[-0.03em] md:text-5xl">
      {WORDS.map((word, i) => (
        <span key={i} className={`transition-colors duration-300 ${i >= lit ? 'text-ink/35' : KEY.test(word) ? 'text-teal' : 'text-ink'}`}>
          {word}{' '}
        </span>
      ))}
    </blockquote>
  )
}

// Who he is and what his patients say, as one section: his card beside one review set large and the count,
// then the other reviews on a rail you drag or step through.
// The photo is the one on his current site (kinesiologiayterapiafisica.com).
export default function QuienSoy() {
  const rail = useRef<HTMLUListElement>(null)
  const step = (dir: number) => {
    const el = rail.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * ((el.firstElementChild as HTMLElement).offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="quien-soy" className="scroll-mt-8 overflow-x-clip bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      {/* Phones: heading, card, reviews. Wide screens: the card on the left, beside the heading and the statement */}
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
              <span className="rounded-full bg-teal px-3 py-1 text-sm font-medium text-white">Certificado de excelencia 2024 · 2025</span>
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
          <figure className="mt-8">
            <Statement />
            <figcaption className="mt-6 text-base">
              <span className="font-semibold">{LEAD.author}</span>
              <span className="text-ink/70"> · Paciente · {LEAD.date}</span>
            </figcaption>
          </figure>
          <div className="mt-12 flex flex-wrap items-end gap-x-8 gap-y-4">
            <p className="text-8xl leading-[0.82] font-medium tracking-[-0.06em] text-teal md:text-9xl">133</p>
            <div>
              <p className="text-lg">opiniones en Doctoralia</p>
              <a href={DOCTORALIA_URL} className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-teal underline underline-offset-4 hover:no-underline">
                Leer las 133 opiniones
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 hidden justify-end gap-2.5 sm:flex">
        {([[-1, 'Opiniones anteriores', ArrowLeft], [1, 'Más opiniones', ArrowRight]] as const).map(([dir, label, Icon]) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={() => step(dir)}
            className="inline-flex size-13 items-center justify-center rounded-full bg-[#eef5f8] transition-[background-color,scale] duration-200 hover:bg-[#dcebf1] active:scale-[0.94]"
          >
            <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ))}
      </div>
      {/* The rail runs to the screen's edges; its first card starts on the page margin */}
      <ul
        ref={rail}
        tabIndex={0}
        aria-label="Más opiniones de pacientes"
        className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:mt-5 sm:scroll-px-8 sm:px-8 md:-mx-16 md:scroll-px-16 md:px-16 lg:-mx-20 lg:scroll-px-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
      >
        {REST.map((review) => (
          <li key={review.author} className="flex min-h-56 w-[min(84vw,25rem)] shrink-0 snap-start flex-col rounded-3xl bg-[#eef5f8] p-7">
            <figure className="flex flex-1 flex-col">
              <blockquote className="text-lg leading-snug md:text-xl">“{review.quote}”</blockquote>
              <figcaption className="mt-auto pt-5 text-base">
                <span className="font-semibold">{review.author}</span>
                <span className="text-ink/70"> · Paciente · {review.date}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
