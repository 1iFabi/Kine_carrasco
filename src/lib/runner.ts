// Draws a motion-captured run cycle as a solid silhouette or as a cloud of particles, and bends it into the logo's pose.
// Data: one run cycle at 120 fps from the CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), subject 9,
// trial 10. The database was created with funding from NSF EIA-0196217. Body units are the cycle's own (about 30 units
// tall); `travel` is the hip's real forward distance at each frame.
import RUN from './run-data.json'

type Pt = [number, number]
export type Pose = Record<string, Pt>
// [ax, ay, bx, by, radius at a, radius at b, far (1) or near (0), particle density]
type Seg = [number, number, number, number, number, number, number, number]
type Particle = { si: number; t: number; u: number; cap: Pt; end: boolean; a: number }
export type DrawOptions = {
  mode: 'solid' | 'particles'
  color: string
  farColor: string
  arcColor: string
  arc?: number
  alpha?: number
  count?: number
  pts?: Particle[]
}

const frames = RUN.frames as unknown as Record<string, [number, number, number]>[]
export const N = frames.length
export const FPS = RUN.fps
export const STRIDE = RUN.stride

// Every width below was measured on subject 127 (trunk 6.19 units); scale them to this subject's trunk
const G = frames.reduce((s, f) => s + Math.hypot(f.chest[0] - f.hip[0], f.chest[1] - f.hip[1]), 0) / N / 6.19

// [from, to, radius at from, radius at to]; L/R prefixes are filled in per side.
// Half-widths measured on the logo (its pixels x 0.0815 units per pixel), so the stopped runner fills the logo's outline.
const LIMB: [string, string, number, number][] = [
  ['hip', 'knee', 1.55, 0.88],
  ['knee', 'ankle', 1.0, 0.5],
  ['ankle', 'ball', 0.48, 0.36],
  ['ball', 'toe', 0.36, 0.26],
  ['sho', 'elb', 0.75, 0.57],
  ['elb', 'wri', 0.57, 0.42],
  ['wri', 'hand', 0.5, 0.55],
]

// Near side = the hip closer to the camera, averaged over the cycle
const zl = frames.reduce((s, f) => s + f.lhip[2], 0), zr = frames.reduce((s, f) => s + f.rhip[2], 0)
const NEAR = zl > zr ? 'l' : 'r', FAR = NEAR === 'l' ? 'r' : 'l'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// The recorded neck stands straight up for 3.6 units on a trunk leaning ~38°, which reads as a head on a stick.
// Rebuild neck and head from the trunk instead, with the logo's proportions: a short neck leaning with the trunk
// (2.3 units) and the head held more upright on top ("head" = top of the head, 3.4 units above the neck).
for (const f of frames) {
  const ta = Math.atan2(f.chest[0] - f.hip[0], f.chest[1] - f.hip[1])
  const na = ta * 0.85, ha = ta * 0.5
  f.neck = [f.chest[0] + Math.sin(na) * 2.3 * G, f.chest[1] + Math.cos(na) * 2.3 * G, f.chest[2]]
  f.head = [f.neck[0] + Math.sin(ha) * 3.4 * G, f.neck[1] + Math.cos(ha) * 3.4 * G, f.chest[2]]
}
export const HEIGHT = Math.max(...frames.map((f) => f.head[1]))

// Forward travel at each frame, TRAVEL[N] = one stride. A constant speed lets the planted foot slide (the runner
// really speeds up and slows down within each step), so while a ball of the foot is on the floor the body moves by
// exactly what that foot moves back, and the airborne frames share the rest of the stride by the hip's own speed.
const TRAVEL = (() => {
  const travel = RUN.travel as number[]
  const floor = { l: Math.min(...frames.map((f) => f.lball[1])), r: Math.min(...frames.map((f) => f.rball[1])) }
  const inc: number[] = [], planted: boolean[] = []
  for (let i = 0; i < N; i++) {
    const A = frames[i], B = frames[(i + 1) % N]
    const side = A.lball[1] - floor.l < A.rball[1] - floor.r ? 'l' : 'r'
    planted[i] = A[side + 'ball'][1] < floor[side] + 0.6 * G && B[side + 'ball'][1] < floor[side] + 0.6 * G
    inc[i] = planted[i] ? A[side + 'ball'][0] - B[side + 'ball'][0] : (i + 1 < N ? travel[i + 1] : STRIDE) - travel[i]
  }
  const onFoot = inc.reduce((s, v, i) => s + (planted[i] ? v : 0), 0)
  const inAir = inc.reduce((s, v, i) => s + (planted[i] ? 0 : v), 0)
  for (let i = 0; i < N; i++) if (!planted[i]) inc[i] *= (STRIDE - onFoot) / inAir
  // Switching between foot and hip speed jolts the body at touchdown and toe-off; a circular average over about
  // 1/20 s smooths it out for a sliver of slide back (1.6% of the height, from 3.9% at constant speed)
  const w = Math.round(FPS / 20)
  const smooth = inc.map((_, i) => {
    let s = 0
    for (let d = -w; d <= w; d++) s += inc[(i + d + N) % N]
    return s / (2 * w + 1)
  })
  const out = [0]
  for (let i = 0; i < N; i++) out.push(out[i] + smooth[i])
  return out
})()

// Distance run at a fractional frame, over any number of cycles
export function travelAt(phase: number) {
  const c = Math.floor(phase / N), p = phase - c * N, i = Math.floor(p)
  return c * STRIDE + lerp(TRAVEL[i], TRAVEL[i + 1], p - i)
}

// Pose at a fractional frame, looping
export function poseAt(phase: number): Pose {
  const p = ((phase % N) + N) % N
  const i = Math.floor(p), j = (i + 1) % N, t = p - i
  const A = frames[i], B = frames[j], out: Pose = {}
  for (const k in A) out[k] = [lerp(A[k][0], B[k][0], t), lerp(A[k][1], B[k][1], t)]
  return out
}

// The logo's pose, measured on the middle runner of logo-kine-carrasco.webp, in pixels of logo-runner.png
// (a 260x330 crop at 390,0). F = the leg/arm reaching forward, B = the one behind.
const LOGO_PX: Record<string, Pt> = {
  hip: [163, 157], chest: [187, 73], neck: [205, 50], head: [215, 8],
  Fhip: [170, 157], Fknee: [230, 203], Fankle: [177, 277], Fball: [172, 305], Ftoe: [183, 317],
  Bhip: [157, 163], Bknee: [97, 217], Bankle: [32, 263], Bball: [15, 293], Btoe: [12, 313],
  Fsho: [192, 72], Felb: [203, 122], Fwri: [233, 100], Fhand: [247, 93],
  Bsho: [172, 70], Belb: [128, 95], Bwri: [113, 143], Bhand: [108, 157],
}
const LEG = ['hip', 'knee', 'ankle', 'ball', 'toe'], ARM = ['sho', 'elb', 'wri', 'hand']

// The logo pose in body units, scaled and placed on a mocap pose's hip and torso length
function logoFor(P: Pose) {
  const leg = P.lknee[0] > P.rknee[0] ? 'l' : 'r', arm = leg === 'l' ? 'r' : 'l' // the forward arm swings opposite the forward leg
  const back = (side: string) => (side === 'l' ? 'r' : 'l')
  const k = Math.hypot(P.neck[0] - P.hip[0], P.neck[1] - P.hip[1]) / Math.hypot(LOGO_PX.neck[0] - LOGO_PX.hip[0], LOGO_PX.neck[1] - LOGO_PX.hip[1])
  const at = ([u, v]: Pt): Pt => [P.hip[0] + (u - LOGO_PX.hip[0]) * k, P.hip[1] - (v - LOGO_PX.hip[1]) * k]
  const pose: Pose = { hip: at(LOGO_PX.hip), chest: at(LOGO_PX.chest), neck: at(LOGO_PX.neck), head: at(LOGO_PX.head) }
  for (const j of LEG) { pose[leg + j] = at(LOGO_PX['F' + j]); pose[back(leg) + j] = at(LOGO_PX['B' + j]) }
  for (const j of ARM) { pose[arm + j] = at(LOGO_PX['F' + j]); pose[back(arm) + j] = at(LOGO_PX['B' + j]) }
  // Where logo-runner.png sits so its runner lands on this pose: top-left corner and size, in body units
  const image = { x: P.hip[0] - LOGO_PX.hip[0] * k, y: P.hip[1] + LOGO_PX.hip[1] * k, w: 260 * k, h: 330 * k }
  return { pose, image, k }
}

// The frame of the cycle closest to the logo, so the run settles into it with the least change
export const LOGO = (() => {
  let best = 0, bestErr = Infinity
  for (let i = 0; i < N; i++) {
    const P = poseAt(i), L = logoFor(P).pose
    const err = Object.keys(L).reduce((s, k) => s + (P[k][0] - L[k][0]) ** 2 + (P[k][1] - L[k][1]) ** 2, 0)
    if (err < bestErr) { bestErr = err; best = i }
  }
  return best
})()
export const LOGO_FIT = logoFor(poseAt(LOGO))

// A pose part way (w 0..1) from P toward the logo pose
export function towardLogo(P: Pose, w: number): Pose {
  if (w <= 0) return P
  const out: Pose = {}
  for (const k in P) out[k] = LOGO_FIT.pose[k] ? [lerp(P[k][0], LOGO_FIT.pose[k][0], w), lerp(P[k][1], LOGO_FIT.pose[k][1], w)] : P[k]
  return out
}

// Segments for one pose, back to front
function segments(P: Pose): Seg[] {
  const s: Seg[] = []
  for (const [a, b, ra, rb] of LIMB) s.push([...P[FAR + a], ...P[FAR + b], ra * G, rb * G, 1, 1])
  // Torso: one smooth taper from pelvis to shoulders. "chest" is the base of the neck, so the trunk's
  // widest point sits below it (at 80%) and narrows into the neck instead of bulging round it.
  const tx = P.chest[0] - P.hip[0], ty = P.chest[1] - P.hip[1], tl = Math.hypot(tx, ty) || 1
  const fx = ty / tl, fy = -tx / tl // perpendicular to the trunk, pointing forward
  const at = (t: number, f = 0): Pt => [lerp(P.hip[0], P.chest[0], t) + fx * f * G, lerp(P.hip[1], P.chest[1], t) + fy * f * G]
  s.push([...P.hip, ...at(0.8), 1.55 * G, 1.85 * G, 0, 1])
  s.push([...at(0.8), ...P.chest, 1.85 * G, 1.4 * G, 0, 1])
  s.push([...at(0.45, 0.25), ...at(0.78, 0.3), 1.4 * G, 1.6 * G, 0, 1]) // chest, a little forward of the spine
  // Head along the neck-to-top-of-head line
  let dx = P.head[0] - P.neck[0], dy = P.head[1] - P.neck[1]
  const dl = Math.hypot(dx, dy) || 1
  dx /= dl; dy /= dl
  // Head shaped like the logo's: an upright oval skull, the face (brow to chin) on its front, and a neck under
  // half the head's width (about 15 px against 40 on logo-runner.png), so it reads as a neck and not a bulge.
  // at2(up, fwd) = a point from the neck along the head and forward of it. The head gets more particles.
  const at2 = (u: number, f: number): Pt => [P.neck[0] + (dx * u + dy * f) * G, P.neck[1] + (dy * u - dx * f) * G]
  s.push([...at(0.88, -0.4), ...at2(0.8, -0.2), 1.15 * G, 0.75 * G, 0, 1.4]) // neck, tapering up from the trapezius
  s.push([...at2(1.9, 0.05), ...at2(2.15, 0.15), 1.45 * G, 1.45 * G, 0, 2]) // skull: top 3.6 up, back 1.4 behind
  s.push([...at2(2.0, 0.95), ...at2(0.65, 1.15), 1.0 * G, 0.6 * G, 0, 2]) // face, brow to chin (nose 2.0 forward)
  s.push([...at2(0.8, 0.5), ...at2(0.75, 1.0), 0.55 * G, 0.55 * G, 0, 2]) // jaw line, closing the face's underside
  for (const [a, b, ra, rb] of LIMB) s.push([...P[NEAR + a], ...P[NEAR + b], ra * G, rb * G, 0, 1])
  return s
}

// Tapered capsule: the hull of two circles
function capsule(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, ra: number, rb: number) {
  const d = Math.hypot(bx - ax, by - ay)
  ctx.beginPath()
  if (d < 1e-3 || d <= Math.abs(ra - rb)) { ctx.arc(ax, ay, Math.max(ra, rb), 0, Math.PI * 2); ctx.fill(); return }
  const th = Math.atan2(by - ay, bx - ax), ph = Math.acos((ra - rb) / d)
  ctx.arc(ax, ay, ra, th + ph, th - ph + Math.PI * 2)
  ctx.arc(bx, by, rb, th - ph, th + ph)
  ctx.closePath()
  ctx.fill()
}

// Particles: fixed spots inside each segment, so they travel with the limb they belong to
function seedParticles(count: number): Particle[] {
  const segs = segments(poseAt(0))
  // Body (the band between the circles) and caps (the end circles) get particles by their own area,
  // so a short, round segment like the skull fills as a disc instead of a stripe
  const body = segs.map(([ax, ay, bx, by, ra, rb]) => Math.hypot(bx - ax, by - ay) * (ra + rb))
  const caps = segs.map(([, , , , ra, rb]) => (Math.PI * (ra * ra + rb * rb)) / 2)
  const area = segs.map((g, i) => (body[i] + caps[i]) * g[7])
  const total = area.reduce((a, b) => a + b, 0)
  const pts: Particle[] = []
  segs.forEach((_, si) => {
    const n = Math.round((count * area[si]) / total)
    for (let k = 0; k < n; k++) {
      const ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random())
      pts.push({ si, t: Math.random(), u: (Math.random() * 2 - 1) * Math.sqrt(1 - Math.random() * 0.3), cap: [Math.cos(ang) * rr, Math.sin(ang) * rr], end: Math.random() < caps[si] / (caps[si] + body[si]), a: 0.45 + Math.random() * 0.55 })
    }
  })
  return pts
}

// The logo's arc: a tapered swoosh trailing up behind the runner's back to above his head.
// Measured on the logo too: it grows from the shoulders back to its tail, like a trail left behind.
function arc(ctx: CanvasRenderingContext2D, P: Pose, X: number, Y: number, s: number, grow: number, color: string) {
  if (grow <= 0) return
  const k = LOGO_FIT.k
  const at = ([u, v]: Pt): Pt => [P.hip[0] + (u - LOGO_PX.hip[0]) * k, P.hip[1] - (v - LOGO_PX.hip[1]) * k]
  const p0 = at([150, 64]), p1 = at([74, 86]), p2 = at([63, 155])
  const q = (t: number): Pt => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]]
  const steps = 40, top: Pt[] = [], bot: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * grow
    const [x, y] = q(t), [x2, y2] = q(Math.min(1, t + 0.01))
    let nx = -(y2 - y), ny = x2 - x
    const l = Math.hypot(nx, ny) || 1
    nx /= l; ny /= l
    const w = 4.5 * k * Math.sin(Math.PI * t) ** 0.8
    top.push([X + (x + nx * w) * s, Y - (y + ny * w) * s])
    bot.push([X + (x - nx * w) * s, Y - (y - ny * w) * s])
  }
  ctx.fillStyle = color
  ctx.beginPath()
  top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  bot.reverse().forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.closePath()
  ctx.fill()
}

// Draw one pose with the hip at screen X and the feet's floor at screen Y, s px per body unit
export function draw(ctx: CanvasRenderingContext2D, P: Pose, X: number, Y: number, s: number, o: DrawOptions) {
  ctx.globalAlpha = o.alpha ?? 1
  arc(ctx, P, X, Y, s, o.arc ?? 0, o.arcColor)
  const segs = segments(P)
  if (o.mode === 'particles') {
    o.pts ??= seedParticles(o.count ?? 2600)
    const size = Math.max(1.2, s * 0.11)
    ctx.fillStyle = o.color
    for (const p of o.pts) {
      const [ax, ay, bx, by, ra, rb, far] = segs[p.si]
      let x, y
      if (p.end) { // rounded caps
        const r = p.t < 0.5 ? ra : rb, c = p.t < 0.5 ? [ax, ay] : [bx, by]
        x = c[0] + p.cap[0] * r; y = c[1] + p.cap[1] * r
      } else {
        const d = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / d, ny = (bx - ax) / d
        const r = lerp(ra, rb, p.t)
        x = lerp(ax, bx, p.t) + nx * p.u * r; y = lerp(ay, by, p.t) + ny * p.u * r
      }
      ctx.globalAlpha = p.a * (far ? 0.55 : 1) * (o.alpha ?? 1)
      ctx.fillRect(X + x * s - size / 2, Y - y * s - size / 2, size, size)
    }
    ctx.globalAlpha = 1
    return
  }
  for (const [ax, ay, bx, by, ra, rb, far] of segs) {
    ctx.fillStyle = far ? o.farColor : o.color
    capsule(ctx, X + ax * s, Y - ay * s, X + bx * s, Y - by * s, ra * s, rb * s)
  }
  ctx.globalAlpha = 1
}
