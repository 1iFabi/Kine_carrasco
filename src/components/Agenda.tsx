import { motion } from 'motion/react'
import { reveal } from './Especialidades'
import { BookingActions } from './Hero'

const LEFT_FADE = '[mask-image:linear-gradient(to_right,transparent,black_40%)]' // taste-skill-ignore: fade mask, not a fill

// Closing call to action: the page's one hard cut, from paper to night, where the hands come back lit.
export default function Agenda() {
  return (
    <section id="agenda" className="relative overflow-hidden bg-night px-5 py-section text-on-night sm:px-8 md:px-16 lg:px-20">
      {/* The hands return on the right, bookending the page. A still made for this ground (the loop's white keyed out),
          since the video's baked-in white cannot sit on night */}
      <img
        src="/hands-night.webp"
        srcSet="/hands-night-720.webp 720w, /hands-night.webp 1440w"
        sizes="50vw"
        alt=""
        width={1440}
        height={1800}
        loading="lazy"
        className={`hands-agenda pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-left md:block ${LEFT_FADE}`}
      />
      <div className="relative max-w-2xl">
        <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
          Agenda tu hora.
        </motion.h2>
        <motion.p {...reveal(0.05)} className="mt-6 max-w-md text-base text-on-night/85 md:text-lg">
          En la consulta en Rancagua o en tu casa, en Rancagua y Machalí.
        </motion.p>
        <motion.div {...reveal(0.1)} className="mt-10">
          <BookingActions night />
          <p className="mt-4 text-sm text-on-night/80">Atiendo por Fonasa · Boleta reembolsable en tu Isapre</p>
        </motion.div>
      </div>
    </section>
  )
}
