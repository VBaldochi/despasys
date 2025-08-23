import Image from 'next/image'
import Link from 'next/link'

const footerSections = [
  {
    title: 'Serviços',
    links: [
      { name: 'Licenciamentos', href: '#services' },
      { name: 'Transferências', href: '#services' },
      { name: '1° Registro', href: '#services' },
      { name: 'Desbloqueios', href: '#services' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { name: 'Sobre', href: '#about' },
      { name: 'Serviços', href: '#services' },
      { name: 'Contato', href: '#contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo/333639480_607887381351075_3074158683519753451_n.jpg"
                alt="Lazuli Despachante"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-xl font-semibold">Lazuli Despachante</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Despachante credenciado ao Detran-SP, oferecendo serviços automotivos 
              com qualidade e agilidade em Franca-SP.
            </p>
            <div className="flex space-x-4">
              <a
                href="tel:+5516982477126"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>📞</span>
                <span>(16) 98247-7126</span>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-gray-400">
              <p>&copy; 2025 Lazuli Despachante. Todos os direitos reservados.</p>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Av. Alagoas, 882 - Vila Aparecida, Franca-SP</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="https://wa.me/5516982477126"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors duration-300 flex items-center space-x-2"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
