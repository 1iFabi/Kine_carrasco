import { motion } from 'motion/react'
import { useState } from 'react'
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

// "¿Dónde te duele?": the patient's words set large; the one chosen stays in ink and its answer fills a night panel.
// Comes after "¿Qué trato?", so the specialty is named once, in the panel, not under every phrase.
export function Dolor() {
  const [open, setOpen] = useState(0)
  const s = SYMPTOMS[open]
  // Rendered twice and shown once: under the chosen phrase on phones, in the right half on wide screens
  const panel = (className: string) => (
    <motion.div
      key={open}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
      className={`flex-col rounded-3xl bg-night p-7 text-on-night md:min-h-[29rem] md:p-12 ${className}`}
    >
      <p className="text-base font-semibold text-teal-night">{s.label}</p>
      <h3 className="mt-3 text-4xl leading-none font-medium tracking-[-0.035em] lg:text-6xl">{s.service}</h3>
      <p className="mt-5 max-w-[36ch] text-lg text-on-night/85 lg:text-xl">{serviceNamed(s.service)?.about}</p>
      <div className="mt-auto pt-8">
        <QuickBook onNight whatsappText={`Hola José, quiero consultar por esto: ${s.label.toLowerCase()}`} />
      </div>
    </motion.div>
  )

  return (
    <section id="dolor" className="scroll-mt-8 bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
            ¿Dónde te duele?
          </motion.h2>
          <motion.p {...reveal(0.05)} className="mt-6 max-w-md text-lg text-ink/80 md:text-xl">
            Toca lo que te pasa y te cuento cómo lo trabajamos.
          </motion.p>
          <ul className="mt-8 md:mt-10">
            {SYMPTOMS.map((item, i) => (
              <motion.li key={item.label} {...reveal(0.04 * i)}>
                <button
                  type="button"
                  aria-pressed={i === open}
                  onClick={() => setOpen(i)}
                  className={`block w-full py-3 text-left text-2xl leading-[1.15] font-medium tracking-[-0.025em] transition-[color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:text-3xl ${i === open ? 'text-ink md:translate-x-3.5' : 'text-ink/60 hover:text-ink/85'}`}
                >
                  {item.label}
                </button>
                {i === open && panel('mt-2 mb-4 flex md:hidden')}
              </motion.li>
            ))}
          </ul>
        </div>
        {panel('hidden self-center md:flex')}
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
