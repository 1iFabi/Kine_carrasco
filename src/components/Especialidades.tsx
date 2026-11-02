import { motion } from 'motion/react'
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react'
import { SPECIALTIES, SYMPTOMS } from '../content'
import { QuickBook } from './Hero'

export const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { type: 'spring' as const, bounce: 0, duration: 0.7, delay },
})

const SERVICES = SPECIALTIES.flatMap((group) => group.items.map((item) => ({ ...item, group: group.group, note: group.note })))
const serviceNamed = (name: string) => SERVICES.find((s) => s.name === name)

// Anchor for a service, so a link can open it (#rehabilitacion-deportiva).
export const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Accordion row (transitions.dev): one row opens in place. The panel grows through grid rows, so no height is measured.
// A link with the row's hash opens it and brings it to the centre of the screen.
function Row({ id, title, delay, children }: { id: string; title: string; delay: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openFromHash = useEffectEvent(() => setOpen(true))

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash !== `#${id}`) return
      openFromHash()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [id])

  return (
    <motion.li {...reveal(delay)} id={id} className="scroll-mt-32">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">{title}</span>
        <span
          className={`inline-flex shrink-0 text-ink transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'scale-y-[-1]' : ''}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6.5L8 10.5L12 6.5" />
          </svg>
        </span>
      </button>
      <div
        id={`${id}-panel`}
        className={`grid transition-[grid-template-rows] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className={`overflow-hidden transition-[opacity,filter] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'opacity-100 blur-none' : 'opacity-0 blur-[2px]'}`}>
          <div className="max-w-[52ch] pb-8">{children}</div>
        </div>
      </div>
    </motion.li>
  )
}

// "¿Dónde te duele?": the patient's words, each opening to how it is treated and to booking.
// Comes after "¿Qué trato?", so the specialty is named once, inside the open row, not under every closed one.
export function Dolor() {
  return (
    <section id="dolor" className="scroll-mt-8 bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      {/* Wide screens: the question stays on the left while the answers open on the right */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="self-start md:sticky md:top-28">
          <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
            ¿Dónde te duele?
          </motion.h2>
          <motion.p {...reveal(0.05)} className="mt-6 max-w-md text-lg text-ink/80 md:text-xl">
            Toca lo que te pasa y te cuento cómo lo trabajamos.
          </motion.p>
        </div>
        <ul>
          {SYMPTOMS.map((s, i) => (
            <Row key={s.label} id={`sintoma-${i + 1}`} title={s.label} delay={0.04 * i}>
              <p className="text-lg text-ink/85">
                <span className="font-semibold text-ink">{s.service}.</span> {serviceNamed(s.service)?.about}
              </p>
              <div className="mt-6">
                <QuickBook />
              </div>
            </Row>
          ))}
        </ul>
      </div>
    </section>
  )
}

// "¿Qué trato?": one expanding panel per service; the open one says who it is for, how it is treated and how to book.
export default function Especialidades() {
  return (
    <section id="especialidades" className="scroll-mt-8 bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
        ¿Qué trato?
      </motion.h2>
      <motion.p {...reveal(0.05)} className="mt-6 max-w-md text-lg text-ink/80 md:text-xl">
        Mis especialidades, en palabras simples. Toca una para ver cómo la trabajamos.
      </motion.p>
      <motion.div {...reveal(0.1)} className="mt-8 md:mt-12">
        <Panels />
      </motion.div>
    </section>
  )
}

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

// Expanding panels (after 21st.dev "Expanding Cards"): on wide screens the services stand side by side as
// dark strips and the one you point at or tap widens to show everything; below lg they stack as an accordion.
// The open panel's text has a fixed width, so it is uncovered as the strip widens instead of reflowing.
function Panels() {
  const [open, setOpen] = useState(0)
  const wide = () => window.matchMedia('(min-width: 64rem)').matches

  return (
    <ul className="flex flex-col gap-2 lg:h-[34rem] lg:flex-row lg:gap-2.5">
      {SERVICES.map((s, i) => {
        const on = i === open
        const id = `servicio-${slug(s.name)}`
        return (
          <li
            key={s.name}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse' && wide()) setOpen(i) }}
            className={`relative overflow-hidden rounded-2xl bg-night text-on-night lg:min-w-0 lg:basis-0 lg:transition-[flex-grow] lg:duration-[600ms] ${EASE} ${on ? 'lg:grow-5' : 'lg:grow'}`}
          >
            <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-80 text-teal-night/15">
              <path d="M 16 184 A 168 168 0 0 1 184 16" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
            </svg>

            {/* The toggle: a row on phones; on wide screens it covers a closed strip and shows its name upright */}
            <button
              type="button"
              aria-expanded={on}
              aria-controls={id}
              onClick={() => setOpen(on && !wide() ? -1 : i)}
              className={`relative z-10 flex w-full items-center justify-between gap-4 p-5 text-left lg:absolute lg:inset-0 lg:flex-col-reverse lg:items-start lg:p-5 ${on ? 'lg:pointer-events-none' : ''}`}
            >
              <span className={`text-xl font-medium tracking-[-0.02em] transition-opacity duration-300 lg:text-lg lg:whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180 ${on ? 'lg:opacity-0' : ''}`}>
                {s.name}
              </span>
              <span className={`text-sm text-teal-night tabular-nums transition-opacity duration-300 ${on ? 'lg:opacity-0' : ''}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>

            {/* Grows through grid rows on phones; on wide screens it fades in over the widened strip */}
            <div
              id={id}
              inert={!on}
              className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ${EASE} lg:absolute lg:inset-0 lg:grid-rows-[1fr] ${on ? 'grid-rows-[1fr] lg:opacity-100 lg:delay-150' : 'grid-rows-[0fr] lg:opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="relative px-5 pb-6 lg:w-[30rem] lg:p-8">
                  <p className="text-sm font-medium text-teal-night">{s.group} · {s.note}</p>
                  <h3 className="mt-2 hidden text-4xl font-medium tracking-[-0.03em] lg:block">{s.name}</h3>
                  <p className="mt-3 max-w-[40ch] text-lg leading-snug text-on-night/85 lg:mt-4">{s.about}</p>
                  <p className="mt-4 inline-block rounded-full bg-teal-night/15 px-3 py-1 text-sm font-semibold text-teal-night">{s.value}</p>
                  <div className="mt-6">
                    <QuickBook onNight />
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
