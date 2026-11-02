import { MotionConfig } from 'motion/react'
import Agenda from './components/Agenda'
import BackToTop from './components/BackToTop'
import Especialidades, { Dolor } from './components/Especialidades'
import BookingBar from './components/BookingBar'
import Footer from './components/Footer'
import Hero, { Header } from './components/Hero'
import QuienSoy from './components/QuienSoy'
import Ubicacion from './components/Ubicacion'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main className="relative z-10">
        {/* Reading order: the promise, what he treats, your case, who he is and what patients say, where, and booking */}
        <Hero />
        <Especialidades />
        <Dolor />
        <QuienSoy />
        <Ubicacion />
        <Agenda />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <BackToTop />
      <BookingBar />
    </MotionConfig>
  )
}
