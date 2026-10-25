import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Agenda from './components/Agenda'
import BackToTop from './components/BackToTop'
import Especialidades from './components/Especialidades'
import Footer from './components/Footer'
import Hero, { Header } from './components/Hero'
import HandsVideo from './components/HandsVideo'
import HeroScene from './components/HeroScene'
import Intro from './components/Intro'
import Opiniones from './components/Opiniones'
import Ubicacion from './components/Ubicacion'

const DESKTOP = '(min-width: 768px)'
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export default function App() {
  // Desktop: the live 3D scene in the sticky column. Phones: a recorded loop as the page backdrop, so they never run the 3D runtime.
  const isDesktop = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches)

  // The intro stays until the 3D scene has loaded and settled; phones have no scene to wait for.
  const [scene, setScene] = useState<'loading' | 'ready' | 'dropped'>(isDesktop ? 'loading' : 'ready')
  const [held, setHeld] = useState(true)
  useEffect(() => {
    const min = setTimeout(() => setHeld(false), 1000)
    // Still not settled: a slow machine or network would lag the whole page, so keep the still image instead
    const max = setTimeout(() => setScene((s) => (s === 'loading' ? 'dropped' : s)), 8000)
    return () => {
      clearTimeout(min)
      clearTimeout(max)
    }
  }, [])
  const onSceneReady = useCallback(() => setScene((s) => (s === 'loading' ? 'ready' : s)), [])
  const ready = scene !== 'loading' && !held

  return (
    <MotionConfig reducedMotion="user">
      {!isDesktop && (
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-30">
          <div className="hand-sway absolute inset-[-15%]">
            <HandsVideo className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      )}
      <Intro ready={ready} />
      <Header ready={ready} />
      <main>
        <div className="md:grid md:grid-cols-2">
          <div className="min-w-0">
            <Hero ready={ready} />
            <Especialidades />
          </div>
          {isDesktop && (
            // Split stage: the hands stay in view while the left column scrolls, tilted on a diagonal.
            // The left edge fades out so the scene has no hard frame against the text column.
            <div className="sticky top-0 h-svh overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%)]">
              {/* A still from the same framing shows instantly; the live scene fades in over it once loaded */}
              <img src="/hands-desk.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-left-top" />
              {/* inset -30%: after the tilt, the canvas's bottom-right corner (Spline's logo) lands below the viewport */}
              {scene !== 'dropped' && (
                <div className="absolute inset-[-30%] translate-x-[6%] -rotate-[14deg]">
                  <HeroScene zoom={1.15} onReady={onSceneReady} />
                </div>
              )}
            </div>
          )}
        </div>
        <Opiniones />
        <Ubicacion />
        <Agenda />
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  )
}
