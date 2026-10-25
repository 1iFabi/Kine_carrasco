import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

// Shared with the header logo: when the intro leaves, motion flies this mark into its place there.
export const LOGO_ID = 'brand-logo'
export const LOGO_SRC = '/logo-kine-carrasco-alt.webp'

// Covers the page while the 3D scene loads and stalls, so nobody scrolls into the freeze.
export default function Intro({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (ready) return
    // The logo lands on the header at the top of the page, so the intro always opens there
    history.scrollRestoration = 'manual'
    const root = document.documentElement
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = ''
    }
  }, [ready])

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[60] grid place-items-center bg-paper"
          aria-hidden="true"
        >
          <motion.img
            layoutId={LOGO_ID}
            src={LOGO_SRC}
            alt=""
            width={220}
            height={267}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
            className="h-40 w-auto sm:h-48"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
