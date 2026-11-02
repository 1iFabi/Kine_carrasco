import { useEffect, useState } from 'react'
import { DOCTORALIA_URL, WHATSAPP_URL } from '../content'

// Phones only: the two ways to book, always in reach once the hero's own booking button has scrolled away.
// Plain anchors, outside any animation library, so they work even if motion fails.
export default function BookingBar() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const cta = document.getElementById('hero-cta')
    if (!cta) return setShown(true)
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(cta)
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Reservar"
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-[30] flex gap-2.5 bg-paper px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
        shown ? '' : 'translate-y-full'
      }`}
    >
      <a
        href={DOCTORALIA_URL}
        className="inline-flex h-13 flex-[1_1_68%] items-center justify-center rounded-full bg-teal-deep text-base font-semibold text-white transition-colors active:scale-[0.97] hover:bg-ink"
      >
        Agendar hora
      </a>
      <a
        href={WHATSAPP_URL}
        className="inline-flex h-13 flex-[1_1_32%] items-center justify-center rounded-full border-2 border-teal text-base font-semibold text-teal transition-colors active:scale-[0.97] hover:bg-teal hover:text-white"
      >
        WhatsApp
      </a>
    </nav>
  )
}
