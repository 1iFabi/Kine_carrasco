import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel, useMap } from '@/components/ui/map'
import { DIRECTIONS_URL, MAP_POINTS, PLACES } from '../content'
import { ArrowUpRight } from 'lucide-react'
import { reveal } from './Especialidades'

// Wide view of both cities, then the camera settles, tilted, over the consultation.
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

export default function Ubicacion() {
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, amount: 0.5 })
  // MapLibre (~1 MB) loads only as the visitor nears this section
  const near = useInView(boxRef, { once: true, margin: '800px' })

  return (
    <section id="atencion" className="scroll-mt-8 px-5 py-32 sm:px-8 md:px-16 md:py-48 lg:px-20">
      <div className="grid gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-start md:gap-16">
        <div>
          <motion.h2 {...reveal(0)} className="text-4xl font-normal leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Dónde atiendo
          </motion.h2>
          <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {PLACES.map((place, i) => (
              <motion.div key={place.name} {...reveal(i * 0.06)} className="py-7">
                <h3 className="text-xl font-medium tracking-[-0.02em] md:text-2xl">{place.name}</h3>
                {place.lines.map((line) => (
                  <p key={line} className="mt-1 text-base text-ink/80">
                    {line}
                  </p>
                ))}
                {i === 0 && (
                  <a href={DIRECTIONS_URL} className="mt-4 inline-flex items-center gap-1 text-base font-medium underline underline-offset-4 hover:no-underline">
                    Cómo llegar
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two-finger / Ctrl+scroll zoom (cooperative gestures) so the page still scrolls over the map. */}
        <motion.div ref={boxRef} {...reveal(0.1)} data-ui className="h-[460px] overflow-hidden rounded-2xl bg-fog md:h-[640px]">
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
              <MapMarker {...MAP_POINTS.rancagua}>
                <MarkerContent>
                  <span className="block size-5 rounded-full border-[3px] border-white bg-ink shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
                  <MarkerLabel position="top" className="rounded-full bg-white px-2.5 py-1 text-xs shadow-[0_1px_4px_rgba(0,0,0,0.15)]">Consulta · Box D</MarkerLabel>
                </MarkerContent>
              </MapMarker>
              <MapMarker {...MAP_POINTS.machali}>
                <MarkerContent>
                  <span className="block size-4 rounded-full border-2 border-ink bg-white" />
                  <MarkerLabel position="top" className="rounded-full bg-white px-2.5 py-1 text-xs shadow-[0_1px_4px_rgba(0,0,0,0.15)]">Domicilio en Machalí</MarkerLabel>
                </MarkerContent>
              </MapMarker>
            </Map>
          )}
        </motion.div>
      </div>
    </section>
  )
}
