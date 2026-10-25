import { ArrowUpRight } from 'lucide-react'
import { DOCTORALIA_URL, NAV_LINKS, WHATSAPP_URL } from '../content'

const out = <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />

const COLUMNS = [
  { title: 'Kine Carrasco', links: NAV_LINKS.map((l) => ({ ...l, external: false })) },
  {
    title: 'Agenda',
    links: [
      { href: DOCTORALIA_URL, label: 'Doctoralia', external: true },
      { href: WHATSAPP_URL, label: 'WhatsApp', external: true },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { href: 'https://www.instagram.com/kinesiologiayterapiafisica', label: 'Instagram', external: true },
      { href: 'mailto:rehabilitakine24@gmail.com', label: 'rehabilitakine24@gmail.com', external: false },
    ],
  },
]

const CARE = ['Fonasa', 'Boleta reembolsable en Isapre', 'Domicilio en Rancagua y Machalí']

export default function Footer() {
  return (
    <footer className="px-3 pt-3 pb-3">
      <div className="overflow-hidden rounded-[2rem] bg-fog">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 pt-16 sm:px-10 md:grid-cols-4 md:px-14 md:pt-20">
          {COLUMNS.map((col) => (
            // Contacto goes last and full-width on phones so the email fits on one line
            <div key={col.title} className={col.title === 'Contacto' ? 'order-last col-span-2 md:order-none md:col-span-1' : ''}>
              <h2 className="text-sm text-ink/70">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm font-medium">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="inline-flex items-center gap-1 text-ink hover:underline">
                      {link.label}
                      {link.external && out}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="text-sm text-ink/70">Atención</h2>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {CARE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* The full logo returns at the card's width as the page's close */}
        <img
          src="/logo-kine-carrasco.webp"
          alt="Kine Carrasco"
          width={1075}
          height={438}
          loading="lazy"
          className="mx-auto mt-20 block w-[calc(100%-3rem)] max-w-6xl sm:w-[calc(100%-5rem)] md:mt-28 md:w-[calc(100%-7rem)]"
        />

        <div className="mx-6 mt-12 pb-8 sm:mx-10 md:mx-14 md:mt-16 md:pb-10">
          <p className="text-xs text-ink/70">
            © 2026 Kine Carrasco · Ks. José Antonio Carrasco Gómez
            <br />
            {/* Credit required by the scene's CC BY 4.0 licence */}
            Animación basada en{' '}
            <a href="https://community.spline.design/file/4f20ce3b-9705-4c29-96a3-85fe6937eb87" className="text-ink hover:underline">
              Particles Hand
            </a>{' '}
            de @aamarciales (CC BY 4.0)
          </p>
        </div>
      </div>
    </footer>
  )
}
