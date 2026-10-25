import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { DOCTORALIA_URL, REVIEWS } from '../content'

const pad = (n: number) => String(n).padStart(2, '0')

export default function Opiniones() {
  const [index, setIndex] = useState(0)
  const go = (step: number) => setIndex((i) => (i + step + REVIEWS.length) % REVIEWS.length)

  return (
    // A blush field, so the patients' words read as their own chapter
    <section id="opiniones" className="scroll-mt-3 px-3">
      <div className="rounded-[2rem] bg-blush px-5 py-28 sm:px-8 md:px-13 md:py-40 lg:px-17">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
          className="text-4xl font-normal leading-[1.05] tracking-[-0.03em] md:text-5xl"
        >
          Lo que dicen sus pacientes
        </motion.h2>
        <a href={DOCTORALIA_URL} className="text-base font-medium underline underline-offset-4 hover:no-underline">
          Leer las 133 opiniones en Doctoralia
        </a>
      </div>

      <div className="review-stage mt-16 md:mt-24" aria-roledescription="carrusel" aria-label="Opiniones de pacientes">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-20">
        {/* Every quote sits in the same grid cell, so the block keeps the height of the longest and never jumps */}
        <div className="grid">
          {REVIEWS.map((review, i) => (
            <motion.figure
              key={review.author}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 16 }}
              // The old quote clears out before the new one rises, so two never overlap
              transition={i === index ? { type: 'spring', bounce: 0, duration: 0.7, delay: 0.3 } : { duration: 0.25 }}
              className="[grid-area:1/1]"
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <span className="block font-serif text-[7rem] leading-[0.6] text-rose md:text-[10rem]" aria-hidden="true">
                “
              </span>
              <blockquote className="-mt-2 max-w-4xl md:-mt-10 text-3xl leading-[1.15] tracking-[-0.03em] sm:text-4xl md:text-6xl">
                {review.quote}
              </blockquote>
              <figcaption className="mt-10 text-lg">
                {review.author}
                <span className="text-ink/70"> · Paciente · {review.date}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Who said it: every patient by name, so the quotes read as people, not a slideshow */}
        <ol className="hidden self-end md:block" aria-label="Pacientes">
          {REVIEWS.map((review, i) => (
            <li key={review.author}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`flex w-full items-baseline justify-between gap-3 border-t border-ink/10 py-2.5 text-left text-sm transition-colors ${
                  i === index ? 'text-ink' : 'text-ink/55 hover:text-ink'
                }`}
              >
                <span className="font-medium">{review.author}</span>
                <span className="tabular-nums">{review.date}</span>
              </button>
            </li>
          ))}
        </ol>
        </div>

        <div className="mt-12 flex items-center gap-6">
          <span className="text-base tabular-nums">
            {pad(index + 1)} / {pad(REVIEWS.length)}
          </span>
          <span className="h-px max-w-48 flex-1 bg-ink/15" aria-hidden="true">
            {/* Remounted per quote; when it fills, the next one comes in */}
            <span key={index} onAnimationEnd={() => go(1)} className="review-timer block h-full bg-rose" />
          </span>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Opinión anterior" className="grid size-11 place-items-center rounded-full bg-white transition-colors hover:bg-petal active:scale-[0.97]">
              <ArrowLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Opinión siguiente" className="grid size-11 place-items-center rounded-full bg-white transition-colors hover:bg-petal active:scale-[0.97]">
              <ArrowRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
