import type { Application } from '@splinetool/runtime'
import { useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// Loaded after first paint so the Spline runtime never blocks the headline.
const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/3sfiwUfMdZoyh0Eb/scene.splinecode'
// Width at which the scene's camera framing looks right (the desktop hero column).
const DESIGN_WIDTH = 840

export default function HeroScene({ zoom }: { zoom?: number }) {
  const reduceMotion = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  // The ~2 MB runtime starts only once the page has loaded and gone idle, so it never blocks the first taps.
  const [start, setStart] = useState(false)
  useEffect(() => {
    // Safari has no requestIdleCallback; a short timeout after load does the same job there
    const onIdle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    let idle = 0
    const go = () => (idle = onIdle(() => setStart(true), { timeout: 3000 }))
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
    return () => {
      window.removeEventListener('load', go)
      cancel(idle)
    }
  }, [])

  if (reduceMotion) return null

  // Spline renders at a fixed pixel scale, so a narrower box would only crop the hands; zoom out instead.
  const handleLoad = (app: Application) => {
    const width = boxRef.current?.clientWidth ?? DESIGN_WIDTH
    const fit = Math.min(1, width / DESIGN_WIDTH)
    if (zoom ?? fit !== 1) app.setZoom(zoom ?? fit)
    setLoaded(true)
  }

  return (
    <div
      ref={boxRef}
      // pointer-events-none: the scene is decoration, so wheel and drag scroll the page instead of zooming the camera
      className={`pointer-events-none h-full w-full transition-opacity duration-1000 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        {start && <Spline scene={SCENE_URL} onLoad={handleLoad} className="h-full w-full" />}
      </Suspense>
    </div>
  )
}
