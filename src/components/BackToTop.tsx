import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SLIDE = 'transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

// Shows up as soon as the visitor starts scrolling, so it is there from anywhere down the page.
// After Uiverse.io, vinodjangid07 "afraid-falcon-17" (MIT): on hover the circle widens and the arrow gives way to the word.
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.scrollY > 120)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    // Phones lift it above the booking bar
    <div
      className={`fixed right-5 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-30 transition-[opacity,translate] duration-500 ease-out sm:right-8 md:bottom-8 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      inert={!show}
    >
      <button
        type="button"
        // 'auto' follows the page's CSS scroll-behavior, so it glides unless reduced motion is on
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Volver arriba"
        className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-teal-night text-white ring-4 ring-paper transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-28 hover:bg-ink focus-visible:w-28 active:scale-[0.97]"
      >
        <ArrowUp className={`size-5 ${SLIDE} group-hover:-translate-y-10 group-focus-visible:-translate-y-10`} strokeWidth={2} aria-hidden="true" />
        <span className={`absolute translate-y-10 text-sm font-semibold opacity-0 ${SLIDE} group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100`} aria-hidden="true">
          Subir
        </span>
      </button>
    </div>
  )
}
