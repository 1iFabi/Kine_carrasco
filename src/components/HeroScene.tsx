import type { Application } from '@splinetool/runtime'
import { useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// The intro covers the page while the Spline runtime loads, so it starts right away.
const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/3sfiwUfMdZoyh0Eb/scene.splinecode'
// Width at which the scene's camera framing looks right (the desktop hero column).
const DESIGN_WIDTH = 840

// After onLoad the scene still compiles on the GPU and stalls frames in bursts for a few seconds;
// it counts as ready once the browser paints half a second of smooth frames in a row.
const SMOOTH_FRAMES = 30

export default function HeroScene({ zoom, onReady }: { zoom?: number; onReady: () => void }) {
  const reduceMotion = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) onReady()
  }, [reduceMotion, onReady])

  // Wait out the post-load stall behind the intro, so the visitor never scrolls into it.
  useEffect(() => {
    if (!loaded) return
    let raf = 0
    let smooth = 0
    let last = performance.now()
    const tick = (now: number) => {
      smooth = now - last < 40 ? smooth + 1 : 0
      last = now
      if (smooth >= SMOOTH_FRAMES) onReady()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [loaded, onReady])

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
        <Spline scene={SCENE_URL} onLoad={handleLoad} className="h-full w-full" />
      </Suspense>
    </div>
  )
}
