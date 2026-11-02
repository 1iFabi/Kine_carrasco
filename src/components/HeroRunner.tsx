import { useEffect, useRef, type RefObject } from 'react'
import * as R from '../lib/runner'

const SLOW = 0.7 // the whole run in slight slow motion: stride and travel together, so the feet never slide
const BRAKE = 1.2 // seconds of slowing down
const FADE = 0.6 // seconds in which the drawn runner hands over to the real logo
const DELAY = 0.45 // seconds before it sets off, so the page has painted
const WORD = 0.7 // seconds in which the name rises in under the logo, once the runner has become it
// The name stacked as in the header's logo (logo-kine-carrasco-alt.webp): KINE over CARRASCO, the width of the
// runner's crop, a gap of a third of KINE's height above it. logo-wordmark-night.png is 344x140, KINE 81 tall.
const WM_RATIO = 140 / 344, WM_GAP = (0.32 * 81) / 344
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (x: number) => x * x * (3 - 2 * x)

// The hero's entrance: a motion-captured runner sprints in from the left, slows, settles into the logo's exact
// pose inside `slot`, fades into the real logo and its name rises in under it. The slot's box decides where and
// how big, per layout.
export default function HeroRunner({ slot }: { slot: RefObject<HTMLDivElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current, box = slot.current, hero = cv?.parentElement
    const ctx = cv?.getContext('2d')
    if (!cv || !box || !hero || !ctx) return
    const css = getComputedStyle(document.documentElement)
    const color = css.getPropertyValue('--color-on-night').trim()
    const opts: R.DrawOptions = { mode: 'particles', color, farColor: color, arcColor: css.getPropertyValue('--color-teal-night').trim() }
    const logo = new Image()
    logo.src = '/logo-runner-night.png' // logo-runner.png inverted for the night ground: the runner light, the arc light teal
    const word = new Image()
    word.src = '/logo-wordmark-night.png' // the name cut from logo-kine-carrasco.webp, in the night's light ink
    const img = R.LOGO_FIT.image
    // In body units (y up, floor 0): the name's top sits a gap below the logo crop's bottom edge
    const wordTop = img.y - img.h - WM_GAP * img.w, wordH = WM_RATIO * img.w

    // Size and stop point from the slot, which holds the runner and the name under it, both on its bottom edge;
    // the run starts off screen to the left
    let g = { W: 0, H: 0, s: 1, stopX: 0, baseY: 0, T1: 0, total: 0 }
    const measure = () => {
      const dpr = devicePixelRatio || 1, W = hero.clientWidth, H = hero.clientHeight
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const h = hero.getBoundingClientRect(), b = box.getBoundingClientRect()
      const s = Math.min(b.height / (R.HEIGHT - wordTop + wordH), b.width / img.w)
      // The logo (crop and name share its width) on the slot's centre, or on its right edge when the slot says so
      const right = getComputedStyle(box).textAlign === 'right'
      const stopX = b.left - h.left + (right ? b.width - img.w * s : (b.width - img.w * s) / 2) - img.x * s
      const v = (R.STRIDE / (R.N / R.FPS)) * s * SLOW // px per second at full speed, on average
      const startX = -img.w * s
      const T1 = Math.max(0, (stopX - startX) / v - BRAKE / 3)
      opts.count = W < 768 ? 1800 : 3200
      // Floor placed so the name's bottom lands on the slot's bottom
      g = { W, H, s, stopX, baseY: b.bottom - h.top + (wordTop - wordH) * s, T1, total: T1 + BRAKE }
    }

    const paint = (t: number) => {
      const { W, H, s, stopX, baseY, T1, total } = g
      // Running time elapsed: full speed, then a cubic ease to a stop (its slope is 1 where the slowing starts)
      const p = t < T1 ? t : T1 + (BRAKE / 3) * (1 - (1 - clamp((t - T1) / BRAKE)) ** 3)
      const phase = R.LOGO - (T1 + BRAKE / 3 - p) * R.FPS * SLOW
      // Back from the stop by the distance still to run, at the pace the feet set, so the planted foot stays put
      const X = stopX - (R.travelAt(R.LOGO) - R.travelAt(phase)) * s
      const u = clamp((t - T1) / BRAKE) // 0..1 through the slowing
      const fade = smooth(clamp((t - total) / FADE))
      ctx.clearRect(0, 0, W, H)
      opts.arc = clamp((u - 0.25) / 0.75)
      opts.alpha = 1 - fade
      // While it slows, the stride bends toward the logo's exact pose, so it stops already in it
      const pose = R.towardLogo(R.poseAt(phase), smooth(clamp((u - 0.3) / 0.7)))
      if (fade < 1) R.draw(ctx, pose, X, baseY, s, opts)
      if (fade > 0 && logo.complete) {
        ctx.globalAlpha = fade
        ctx.drawImage(logo, X + img.x * s, baseY - img.y * s, img.w * s, img.h * s)
        ctx.globalAlpha = 1
      }
      // Only once the runner has become the logo, the name rises in under it
      const shown = smooth(clamp((t - total - FADE * 0.7) / WORD))
      if (shown > 0 && word.complete) {
        ctx.globalAlpha = shown
        ctx.drawImage(word, X + img.x * s, baseY - wordTop * s + (1 - shown) * 10, img.w * s, wordH * s)
        ctx.globalAlpha = 1
      }
    }

    measure()
    let raf = 0, t0 = performance.now() + DELAY * 1000
    const end = () => g.total + FADE * 0.7 + WORD
    // Reduced motion, or the page opened part way down: show the logo where the run would end
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY > g.H / 2) t0 = -Infinity
    const frame = (now: number) => {
      const t = Math.min(end(), Math.max(0, (now - t0) / 1000))
      paint(t)
      if (t < end()) raf = requestAnimationFrame(frame)
    }
    const done = () => (performance.now() - t0) / 1000 >= end()
    logo.onload = word.onload = () => { if (done()) paint(end()) }
    raf = requestAnimationFrame(frame)

    // shortcut: a resize mid-run re-measures and the run jumps to its new pace; fine for a 3 s entrance
    const ro = new ResizeObserver(() => {
      measure()
      if (done()) paint(end())
    })
    ro.observe(hero)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [slot])

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
