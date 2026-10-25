import { motion } from 'motion/react'
import { useState } from 'react'
import { SPECIALTIES } from '../content'

export const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { type: 'spring' as const, bounce: 0, duration: 0.7, delay },
})

const ALL_ITEMS = SPECIALTIES.flatMap((group) => group.items.map((item) => ({ ...item, group: group.group, note: group.note })))
const zoneLabel = (zone: string) => zone.charAt(0).toUpperCase() + zone.slice(1)

// Phones: a plain list, one row open at a time.
function PhoneList() {
  const [active, setActive] = useState(ALL_ITEMS[0].name)
  return (
    <ul className="mt-12 border-t border-ink/10 md:hidden">
      {ALL_ITEMS.map((item) => {
        const on = item.name === active
        return (
          <li key={item.name}>
            <button type="button" onClick={() => setActive(item.name)} aria-expanded={on} className="w-full border-b border-ink/10 py-5 text-left">
              <span className="flex items-baseline justify-between gap-4">
                <span className={`text-xl font-medium tracking-[-0.02em] transition-colors ${on ? 'text-ink' : 'text-ink/75'}`}>{item.name}</span>
                <span className="shrink-0 text-sm tabular-nums text-ink/70">{item.value}</span>
              </span>
              <span className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <span className="overflow-hidden">
                  <span className="block pt-2 text-base text-ink/80">{item.detail}</span>
                  <span className="block pt-2 text-sm text-ink/70">{item.note}</span>
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// Desktop: each specialty is a sheet that pins a little lower than the last, so they pile up as you scroll.
function StackedSheets() {
  return (
    <ul className="mt-16 hidden md:block">
      {ALL_ITEMS.map((item, i) => (
        <li key={item.name} className="sticky mb-10" style={{ top: `calc(6rem + ${i * 1.25}rem)` }}>
          <article className="flex min-h-72 flex-col justify-between rounded-2xl bg-fog p-8 shadow-[0_-8px_24px_rgba(17,17,20,0.06)] lg:p-10">
            <div>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-3xl font-medium tracking-[-0.03em] lg:text-4xl">{item.name}</h3>
                <span className="shrink-0 text-base tabular-nums">{item.value}</span>
              </div>
              <p className="mt-4 max-w-[34ch] text-lg text-ink/80">{item.detail}</p>
            </div>
            <p className="mt-10 text-sm text-ink/70">
              {item.zones.map(zoneLabel).join(' · ')} — {item.group}, {item.note.toLowerCase()}
            </p>
          </article>
        </li>
      ))}
    </ul>
  )
}

export default function Especialidades() {
  return (
    <section id="especialidades" className="scroll-mt-8 px-5 pt-32 pb-32 sm:px-8 md:px-16 md:pt-48 md:pb-48 lg:px-20">
      <motion.h2 {...reveal(0)} className="text-4xl font-normal leading-[1.05] tracking-[-0.03em] md:text-5xl">
        ¿Dónde te duele?
      </motion.h2>
      <motion.p {...reveal(0.05)} className="mt-4 max-w-md text-base text-ink/80 md:text-lg">
        Lo que trato, en consulta o a domicilio.
      </motion.p>
      <PhoneList />
      <StackedSheets />
    </section>
  )
}
