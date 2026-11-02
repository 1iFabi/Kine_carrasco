import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel, MarkerPopup, useMap } from '@/components/ui/map'
import { DIRECTIONS_URL, MAP_POINTS, PLACES } from '../content'
import { ArrowUpRight, Copy } from 'lucide-react'
import { reveal } from './Especialidades'

// Wide view of Rancagua and Machalí, then the camera settles, tilted, over the consultation.
const OVERVIEW = { center: [-70.696, -34.176] as [number, number], zoom: 11.2, pitch: 0, bearing: 0 }
const ARRIVAL = { center: [MAP_POINTS.rancagua.longitude, MAP_POINTS.rancagua.latitude] as [number, number], zoom: 15.6, pitch: 55, bearing: -18 }

// Lives inside <Map>, so it runs once the map instance exists, even if the visitor jumped straight here.
function Arrival({ go }: { go: boolean }) {
  const { map } = useMap()
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (!go || !map) return
    // Apple's spatial rule: show where you are coming from, then arrive. Reduced motion jumps straight there.
    if (reduceMotion) map.jumpTo(ARRIVAL)
    else map.flyTo({ ...ARRIVAL, duration: 2600, curve: 1.3, essential: false })
  }, [go, map, reduceMotion])
  return null
}

const COPY_LABEL = 'Copiar dirección'

// Copies the address for a taxi or Uber app. The label swaps in place (transitions.dev text swap) and comes back after 2 s.
function CopyAddress({ text }: { text: string }) {
  const label = useRef<HTMLSpanElement>(null)
  const timer = useRef(0)

  // Changes the text outside React on purpose: no re-render, so the exit and enter classes can run back to back.
  const swap = (next: string) => {
    const el = label.current
    if (!el || el.textContent === next) return
    el.classList.add('is-exit')
    setTimeout(() => {
      el.textContent = next
      el.classList.replace('is-exit', 'is-enter-start')
      void el.offsetHeight
      el.classList.remove('is-enter-start')
    }, 150)
  }

  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(text)
      swap('Dirección copiada')
    } catch {
      swap('No se pudo copiar')
    }
    timer.current = window.setTimeout(() => swap(COPY_LABEL), 2000)
  }

  return (
    <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-base font-medium text-ink/80 hover:text-ink">
      <Copy className="size-4" strokeWidth={1.75} aria-hidden="true" />
      <span ref={label} className="t-text-swap" aria-live="polite">
        {COPY_LABEL}
      </span>
    </button>
  )
}

export default function Ubicacion() {
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, amount: 0.5 })
  // MapLibre (~1 MB) loads only as the visitor nears this section
  const near = useInView(boxRef, { once: true, margin: '800px' })

  return (
    <section id="atencion" className="scroll-mt-8 bg-paper px-5 py-section sm:px-8 md:px-16 lg:px-20">
      <div className="grid gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-start md:gap-16">
        <div>
          <motion.h2 {...reveal(0)} className="text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
            Contacto
          </motion.h2>
          <div className="mt-10 space-y-10 md:mt-14">
            {PLACES.map((place, i) => (
              <motion.div key={place.name} {...reveal(i * 0.06)}>
                <h3 className="text-xl font-medium tracking-[-0.02em] md:text-2xl">{place.name}</h3>
                {place.lines.map((line) => (
                  <p key={line} className="mt-1 text-base text-ink/80">
                    {line}
                  </p>
                ))}
                {i === 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a href={DIRECTIONS_URL} className="inline-flex items-center gap-1 text-base font-semibold text-teal underline underline-offset-4 hover:no-underline">
                      Cómo llegar
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                    <CopyAddress text={`${place.lines.join(', ')}, Rancagua`} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two-finger / Ctrl+scroll zoom (cooperative gestures) so the page still scrolls over the map. */}
        <motion.div ref={boxRef} {...reveal(0.1)} data-ui className="h-[380px] overflow-hidden rounded-2xl bg-ink/5 md:h-[560px]">
          {near && (
            <Map
              theme="light"
              {...OVERVIEW}
              cooperativeGestures
              maxPitch={65}
              attributionControl={{ compact: true }}
            >
              <Arrival go={inView} />
              <MapControls position="bottom-right" showZoom showCompass />
              {/* Tapping the pin opens the address with the same "Cómo llegar" link as the list */}
              <MapMarker {...MAP_POINTS.rancagua}>
                <MarkerContent>
                  <span className="block size-5 rounded-full border-[3px] border-white bg-teal shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />{/* taste-skill-ignore: map pin, a real overlay */}
                  <MarkerLabel position="top" className="rounded-full bg-white px-2.5 py-1 text-xs shadow-[0_1px_4px_rgba(0,0,0,0.15)]">Consulta · Box D</MarkerLabel>{/* taste-skill-ignore: map label, a real overlay */}
                </MarkerContent>
                <MarkerPopup offset={44} focusAfterOpen={false} className="max-w-72 rounded-xl border-0 p-4">
                  <p className="text-sm font-medium text-ink">{PLACES[0].name}</p>
                  {PLACES[0].lines.map((line) => (
                    <p key={line} className="mt-0.5 text-sm text-ink/80">
                      {line}
                    </p>
                  ))}
                  <a href={DIRECTIONS_URL} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink underline underline-offset-4 hover:no-underline">
                    Cómo llegar
                    <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </MarkerPopup>
              </MapMarker>
            </Map>
          )}
        </motion.div>
      </div>
    </section>
  )
}
