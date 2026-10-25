import { useReducedMotion } from 'motion/react'

// Phones only: a recorded loop of the "Particles Hand" scene, the same look without the ~2 MB 3D runtime freezing them.
// The poster is the loop's first frame, so it paints instantly and the video takes over without a jump.
export default function HandsVideo({ className }: { className: string }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <img src="/hands-mob.webp" alt="" className={className} />
  return (
    <video autoPlay muted loop playsInline preload="auto" poster="/hands-mob.webp" aria-hidden="true" className={className}>
      <source src="/hands-mob.mp4" type="video/mp4" />
    </video>
  )
}
