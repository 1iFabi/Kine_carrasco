import { ArrowRight, CalendarCheck, Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { DOCTORALIA_URL, NAV_LINKS, WHATSAPP_URL } from '../content'
import { DoctoraliaIcon, WhatsAppIcon } from './BrandIcons'
import HandsVideo from './HandsVideo'
import HeroRunner from './HeroRunner'

const LOGO_SRC = '/logo-kine-carrasco-alt.webp'

// Apple-style default: critically damped spring, no overshoot
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, bounce: 0, duration: 0.8, delay: delay + 0.3 },
})

// The sections the bar can point at, in page order; over the closing night band the bar turns night too
const SECTIONS = [...NAV_LINKS.map((link) => link.href.slice(1)), 'agenda']
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

// One scroll listener for the bar: the section under 40% of the screen is "here"
function useNavState() {
  // overHero: the bar is still over the night hero. logo: the runner in the hero has scrolled half away,
  // so the bar's own logo takes over (at the top the runner *is* the logo)
  const [nav, setNav] = useState({ overHero: true, logo: false, active: '' })
  // The phone's progress line moves every frame, so it is written straight to the element instead of through state
  const progress = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      let active = ''
      for (const id of SECTIONS) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= window.innerHeight * 0.4) active = id
      }
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      const hero = document.querySelector<HTMLElement>('[data-hero]')
      const overHero = !!hero && hero.getBoundingClientRect().bottom > (bar.current?.offsetHeight ?? 0)
      const logo = !hero || y > hero.offsetHeight * 0.45
      setNav((n) => (n.overHero === overHero && n.logo === logo && n.active === active ? n : { overHero, logo, active }))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ...nav, progress, bar }
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { overHero, logo, active, progress, bar } = useNavState()
  const night = overHero || active === 'agenda'

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-5 py-3 transition-[background-color,color] duration-300 ${EASE} sm:px-8 md:px-16 md:py-4 lg:px-20 ${
          // Clear only while the hero's runner stands in for the logo; once the logo shows, the hero scrolls under a solid bar
          overHero && !logo ? '' : night ? 'bg-night' : 'bg-paper'
        } ${night ? 'text-on-night' : 'text-ink'}`}
      >
        <a
          href="#"
          aria-label="Kine Carrasco"
          className="block aspect-[220/267] h-16 shrink-0 md:h-20 lg:h-24"
        >
          <img
            src={LOGO_SRC}
            alt=""
            width={220}
            height={267}
            // On night the logo inverts and turns half way round the colour wheel: the runner white, the arc a light teal
            className={`h-full w-full transition-[filter,opacity] duration-500 ${EASE} ${night ? 'invert hue-rotate-180' : ''} ${logo ? '' : 'opacity-0'}`}
          />
        </a>

        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex gap-5 text-sm font-semibold whitespace-nowrap lg:gap-10 lg:text-base">
            {NAV_LINKS.map((link) => {
              const current = link.href === `#${active}`
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? 'location' : undefined}
                    className={`relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      night ? 'after:bg-teal-night' : 'after:bg-teal'
                    } ${current ? `after:scale-x-100 ${night ? 'text-teal-night' : 'text-teal'}` : 'after:scale-x-0'}`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <a
          href={DOCTORALIA_URL}
          className={`hidden h-12 items-center gap-2 rounded-full px-6 text-base font-semibold transition-[background-color,color,transform] duration-300 active:scale-[0.97] md:flex ${BOOK[night ? 'night' : 'day']}`}
        >
          <CalendarCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Agendar
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="relative z-50 grid h-12 w-12 place-items-center rounded-full md:hidden"
        >
          <Menu className={`absolute h-5 w-5 transition-[transform,opacity] duration-300 ${menuOpen ? 'rotate-90 scale-95 opacity-0' : ''}`} strokeWidth={1.5} />
          <X className={`absolute h-5 w-5 transition-[transform,opacity] duration-300 ${menuOpen ? '' : '-rotate-90 scale-95 opacity-0'}`} strokeWidth={1.5} />
        </button>

        {/* Phones: how far down the page you are, since the bar there has no links to mark */}
        <span ref={progress} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-teal md:hidden" />
      </header>

      <div
        id="menu-movil"
        className={`fixed inset-0 z-[65] flex flex-col items-center justify-center gap-8 bg-paper transition-[opacity,visibility] duration-500 ease-out md:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        inert={!menuOpen}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            // Texts reveal (transitions.dev): each link rises in from a blur, staggered 40ms apart
            style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : '0ms' }}
            className={`text-2xl font-medium text-ink transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              menuOpen ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-3 opacity-0 blur-[3px]'
            }`}
          >
            {link.label}
          </a>
        ))}
        <a href={DOCTORALIA_URL} className="rounded-full bg-teal-deep px-7 py-4 text-base font-semibold text-white">
          Agendar en Doctoralia
        </a>
      </div>
    </>
  )
}

const ARROW = 'size-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

// Booking is filled sky blue on every ground; WhatsApp is the same blue in outline: one colour, told apart by fill
const BOOK = {
  day: 'bg-teal-deep text-white hover:bg-ink',
  night: 'bg-teal-deep text-white hover:bg-on-night hover:text-night',
}

// Booking button: pill with a round arrow badge (after Uiverse.io, vinodjangid07 "lucky-bulldog-57", MIT).
// On hover the arrow leaves to the right and a new one slides in, once, instead of the original's endless loop.
export function BookLink({ children, night = false }: { children: string; night?: boolean }) {
  return (
    <a
      href={DOCTORALIA_URL}
      className={`group inline-flex h-14 items-center gap-4 rounded-full py-1.5 pr-1.5 pl-7 text-base font-semibold transition-[background-color,scale] duration-300 active:scale-[0.97] ${BOOK[night ? 'night' : 'day']}`}
    >
      {children}
      <span
        className="relative grid size-11 place-items-center overflow-hidden rounded-full bg-white text-teal-deep"
        aria-hidden="true"
      >
        <ArrowRight className={`${ARROW} group-hover:translate-x-[180%]`} strokeWidth={2} />
        <ArrowRight className={`${ARROW} absolute -translate-x-[180%] group-hover:translate-x-0`} strokeWidth={2} />
      </span>
    </a>
  )
}

// The page's one call to action, used at the top and again at the end.
export function BookingActions({ phoneWhatsApp = true, night = false }: { phoneWhatsApp?: boolean; night?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <BookLink night={night}>Agendar en Doctoralia</BookLink>
      <WhatsAppLink night={night} className={phoneWhatsApp ? '' : 'hidden md:inline-flex'} />
    </div>
  )
}

// WhatsApp wears the logo's teal in outline, so it reads as the second way to reach him beside the filled booking button
export function WhatsAppLink({ className = '', night = false, children = 'Escríbeme por WhatsApp' }: { className?: string; night?: boolean; children?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      className={`inline-flex h-14 items-center rounded-full border-2 px-6 text-base font-semibold transition-colors duration-200 ${
        night ? 'border-teal-night text-teal-night hover:bg-teal-night hover:text-night' : 'border-teal text-teal hover:bg-teal hover:text-white'
      } ${className}`}
    >
      {children}
    </a>
  )
}

// Compact pair for inside a symptom row or a service card: each way to book as its brand's mark and name,
// under a line that says what both are for
// onNight: the same buttons drawn for the dark cards of "¿Qué trato?"
export function QuickBook({ onNight = false }: { onNight?: boolean }) {
  return (
    <div>
      <p className={`text-base font-semibold ${onNight ? 'text-on-night' : 'text-ink'}`}>Agenda tu hora</p>
      <div className="mt-3 flex flex-wrap gap-3">
      <a
        href={DOCTORALIA_URL}
        aria-label="Agendar en Doctoralia"
        className={`inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-base font-semibold transition-colors duration-200 active:scale-[0.97] ${onNight ? 'bg-teal-deep text-white hover:bg-on-night hover:text-night' : 'bg-teal-deep text-white hover:bg-ink'}`}
      >
        <DoctoraliaIcon className="size-5" />
        Doctoralia
      </a>
      <a
        href={WHATSAPP_URL}
        aria-label="Escribir por WhatsApp"
        className={`inline-flex h-12 items-center gap-2.5 rounded-full border-2 px-5 text-base font-semibold transition-colors duration-200 active:scale-[0.97] ${onNight ? 'border-teal-night text-teal-night hover:bg-teal-night hover:text-night' : 'border-teal text-teal hover:bg-teal hover:text-white'}`}
      >
        <WhatsAppIcon className="size-5" />
        WhatsApp
      </a>
      </div>
    </div>
  )
}

// The page's one night piece: the sentence as the poster, the hands turning behind it, and the runner who
// sprints in and becomes the logo. Below it the page cuts straight to paper.
export default function Hero() {
  // Where the runner stops: above the sentence on phones and tablets; on desktop, its own column on the right,
  // its foot on the fine print's last line and its right edge on the page margin
  const slot = useRef<HTMLDivElement>(null)
  return (
    <section
      data-hero
      className="relative flex min-h-svh flex-col overflow-hidden bg-night px-5 pt-24 pb-10 text-on-night sm:px-8 md:px-16 md:pt-32 md:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_24vw] lg:items-end lg:gap-x-[4vw] lg:px-20 lg:pt-36"
    >
      {/* A round mask dissolves the hands' square into the night */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid items-start justify-items-center mix-blend-lighten [mask-image:radial-gradient(closest-side,#000_60%,transparent)] md:items-center" // taste-skill-ignore: fade mask, not a fill
      >
        <HandsVideo src="/hands-teal.mp4" poster="/hands-teal.webp" className="hand-sway hands-hero mt-[8%] aspect-[720/900] h-[80%] object-cover md:mt-0 md:h-[115%]" />
      </div>
      <HeroRunner slot={slot} />
      {/* text-align tells HeroRunner where the logo sits across the slot: centred, or on its right edge */}
      <div
        ref={slot}
        aria-hidden="true"
        className="relative min-h-44 flex-1 text-center lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:self-stretch lg:text-right"
      />

      {/* One left edge for the promise, what it is, and what to do */}
      <div className="relative mt-6 lg:col-start-1 lg:row-start-1 lg:mt-0">
        <h1 className="text-[15.5vw] leading-[0.92] font-light tracking-[-0.055em] md:text-[11vw] lg:text-[clamp(4rem,10.5vw,12rem)]">
          <motion.span {...rise(0.1)} className="block">
            Te explico
          </motion.span>
          <motion.span {...rise(0.2)} className="block">
            qué te <span className="text-teal-night">pasa.</span>
          </motion.span>
        </h1>
        <motion.p {...rise(0.35)} className="mt-6 max-w-[28rem] text-base md:mt-8 md:text-lg">
          Y lo tratamos juntos. Kinesiología y terapia física en Rancagua y Machalí, en consulta o a domicilio.
        </motion.p>
        {/* The phone's booking bar stays down until this has scrolled away */}
        <motion.div {...rise(0.45)} id="hero-cta" className="mt-8">
          <BookingActions phoneWhatsApp={false} night />
          <p className="mt-3 text-sm text-on-night/70">Atiendo por Fonasa · Boleta reembolsable en tu Isapre</p>
        </motion.div>
      </div>
    </section>
  )
}
