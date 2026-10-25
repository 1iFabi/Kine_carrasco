import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

// Shows up once the visitor reaches the closing call to action and footer.
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 1400)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    // Positioned by this wrapper: .liquid-glass sets position: relative, which would override `fixed` on the button
    <div
      className={`fixed right-5 bottom-5 z-30 transition-[opacity,translate] duration-500 ease-out sm:right-8 sm:bottom-8 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      inert={!show}
    >
      <button
        type="button"
        // 'auto' follows the page's CSS scroll-behavior, so it glides unless reduced motion is on
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Volver arriba"
        className="liquid-glass grid size-12 place-items-center rounded-full text-ink active:scale-[0.97]"
      >
        <ArrowUp className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  )
}
