import { motion } from 'motion/react'
import { reveal } from './Especialidades'
import { BookingActions } from './Hero'

// Closing call to action: the hero's promise again, now that the visitor has seen the proof, on a petal field taken from the hands.
export default function Agenda() {
  return (
    <section id="agenda" className="px-3">
      <div className="relative overflow-hidden rounded-[2rem] bg-petal px-5 py-28 sm:px-8 md:px-13 md:py-40 lg:px-17">
      {/* The hands return on the right, bookending the page; multiply drops the still's white so only the particles show */}
      {/* Its own near-lossless still (not the hero's lighter one), since here it sits large and in plain view */}
      <picture>
        <source srcSet="/hands-agenda.avif" type="image/avif" />
        <img
          src="/hands-agenda.webp"
          alt=""
          width={1440}
          height={1800}
          loading="lazy"
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-left mix-blend-multiply [mask-image:linear-gradient(to_right,transparent,black_40%)] md:block"
        />
      </picture>
      <div className="relative max-w-2xl">
        <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
          Agenda tu hora.
        </motion.h2>
        <motion.p {...reveal(0.05)} className="mt-6 max-w-md text-base text-ink md:text-lg">
          En la consulta en Rancagua o en tu casa, en Rancagua y Machalí.
        </motion.p>
        <motion.div {...reveal(0.1)} className="mt-10">
          <BookingActions />
          <p className="mt-4 text-sm text-ink">Atiendo por Fonasa · Boleta reembolsable en tu Isapre</p>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
