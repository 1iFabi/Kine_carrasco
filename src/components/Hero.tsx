import { CalendarCheck, Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { DOCTORALIA_URL, NAV_LINKS, WHATSAPP_URL } from '../content'
import HandsVideo from './HandsVideo'
import { LOGO_ID, LOGO_SRC } from './Intro'

// Apple-style default: critically damped spring, no overshoot.
// Held until the intro's logo has started its flight, so the page rises in behind it.
const rise = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: { type: 'spring' as const, bounce: 0, duration: 0.8, delay: delay + 0.3 },
})

// The header's controls fade in once the logo has landed.
const appear = (ready: boolean) => ({
  initial: { opacity: 0 },
  animate: { opacity: ready ? 1 : 0 },
  transition: { duration: 0.5, delay: ready ? 0.6 : 0 },
})

export function Header({ ready }: { ready: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-[70] flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 md:px-16 lg:px-20">
        <a href="#" aria-label="Kine Carrasco" className="block aspect-[220/267] h-16 shrink-0 lg:h-20">
          {ready && (
            <motion.img
              layoutId={LOGO_ID}
              src={LOGO_SRC}
              alt=""
              width={220}
              height={267}
              transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
              className="h-full w-full"
            />
          )}
        </a>

        <motion.nav {...appear(ready)} aria-label="Secciones" className="liquid-glass hidden rounded-full px-8 py-3 md:block">
          <ul className="flex gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-ink/75 transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.a
          {...appear(ready)}
          href={DOCTORALIA_URL}
          className="liquid-glass hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink transition-transform active:scale-[0.97] md:flex"
        >
          <CalendarCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Agendar
        </motion.a>

        <motion.button
          {...appear(ready)}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="liquid-glass relative z-50 grid h-11 w-11 place-items-center rounded-full text-ink md:hidden"
        >
          <Menu className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? 'rotate-90 scale-0 opacity-0' : ''}`} strokeWidth={1.5} />
          <X className={`absolute h-5 w-5 transition-all duration-300 ${menuOpen ? '' : '-rotate-90 scale-0 opacity-0'}`} strokeWidth={1.5} />
        </motion.button>
      </header>

      <div
        id="menu-movil"
        className={`fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-white/90 backdrop-blur-xl transition-[opacity,visibility] duration-500 ease-out md:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        inert={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-2xl font-medium text-ink">
            {link.label}
          </a>
        ))}
        <a href={DOCTORALIA_URL} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">
          Agendar en Doctoralia
        </a>
      </div>
    </>
  )
}

// The page's one call to action, used at the top and again at the end.
export function BookingActions({ phoneWhatsApp = true }: { phoneWhatsApp?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <a
        href={DOCTORALIA_URL}
        className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition-transform hover:bg-ink/85 active:scale-[0.97]"
      >
        Agendar en Doctoralia
      </a>
      <WhatsAppLink className={phoneWhatsApp ? '' : 'hidden md:inline'} />
    </div>
  )
}

function WhatsAppLink({ className = '' }: { className?: string }) {
  return (
    <a href={WHATSAPP_URL} className={`text-sm font-medium text-ink underline underline-offset-4 hover:no-underline ${className}`}>
      o escríbeme por WhatsApp
    </a>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section className="flex flex-col justify-between px-5 pt-[4.5rem] pb-8 sm:px-8 sm:pt-20 sm:pb-10 md:min-h-svh md:px-16 lg:px-20">
      {/* Phones: the first screen holds only the promise, one action and the hands; the rest waits below it */}
      <div className="flex min-h-[calc(100svh-4.5rem)] flex-col sm:min-h-[calc(100svh-5rem)] md:block md:min-h-0">
        <div className="mt-14 max-w-2xl sm:mt-20 md:mt-24">
          <motion.h1
            {...rise(0.1, ready)}
            className="text-[2.6rem] font-normal leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl lg:text-7xl"
          >
            Te explico qué te pasa.
          </motion.h1>
          <motion.p {...rise(0.2, ready)} className="mt-6 max-w-md text-base text-ink/80 md:text-lg">
            Y lo tratamos juntos. Kinesiología y terapia física con Ks. José Antonio Carrasco, 15 años en Rancagua y
            Machalí, en consulta o a domicilio.
          </motion.p>
          <motion.div {...rise(0.3, ready)} className="mt-8">
            <BookingActions phoneWhatsApp={false} />
          </motion.div>
          <motion.p {...rise(0.35, ready)} className="mt-4 hidden text-sm text-ink/70 md:block">
            Atiendo por Fonasa · Boleta reembolsable en tu Isapre
          </motion.p>
        </div>

        <motion.div
          {...rise(0.35, ready)}
          // The top edge fades so the particles never start on a hard line under the button
          className="relative -mx-5 mt-6 min-h-64 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%)] sm:-mx-8 md:hidden"
        >
          {/* No overscan: the clip's white ground matches the page, so corners the sway uncovers stay invisible */}
          <div className="hand-sway absolute inset-0">
            <HandsVideo className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </motion.div>
      </div>

      <motion.div {...rise(0.4, ready)} className="mt-8 space-y-3 md:hidden">
        <WhatsAppLink />
        <p className="text-sm text-ink/70">Atiendo por Fonasa · Boleta reembolsable en tu Isapre</p>
      </motion.div>

      <motion.dl {...rise(0.45, ready)} className="mt-16 flex items-end gap-8 sm:gap-12 md:gap-16">
        <div>
          <dt className="sr-only">Opiniones</dt>
          <dd className="text-xl text-ink sm:text-2xl md:text-3xl">133 opiniones</dd>
          <dd className="text-sm text-ink/70">de pacientes en Doctoralia</dd>
        </div>
        <div>
          <dt className="sr-only">Reconocimiento</dt>
          <dd className="text-xl text-ink sm:text-2xl md:text-3xl">2024 · 2025</dd>
          <dd className="text-sm text-ink/70">Certificado de excelencia</dd>
        </div>
      </motion.dl>
    </section>
  )
}
