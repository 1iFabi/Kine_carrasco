import { useReducedMotion } from 'motion/react'

// A recorded loop of the "Particles Hand" scene, the same look without the 3D runtime.
// The poster is the loop's first frame, so it paints instantly and the video takes over without a jump.
export default function HandsVideo({ className, src, poster }: { className: string; src: string; poster: string }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <img src={poster} alt="" className={className} />
  return (
    <video autoPlay muted loop playsInline preload="auto" poster={poster} aria-hidden="true" className={className}>
      <source src={src} type="video/mp4" />
    </video>
  )
}
