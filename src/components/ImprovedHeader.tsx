'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MenuIcon, 
  XIcon, 
  HomeIcon, 
  CalculatorIcon, 
  CalendarIcon, 
  SearchIcon, 
  FileTextIcon, 
  InfoIcon, 
  PhoneIcon,
  UserIcon,
  ChevronDownIcon
} from 'lucide-react'

export default function ImprovedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { 
      href: '/', 
      label: 'Início', 
      icon: HomeIcon, 
      description: 'Página inicial' 
    },
    { 
      href: '/servicos', 
      label: 'Serviços', 
      icon: FileTextIcon, 
      description: 'Nossos serviços',
      hasDropdown: true,
      subItems: [
        { href: '/calculadora', label: 'Calculadora', icon: CalculatorIcon },
        { href: '/agendamento', label: 'Agendamento', icon: CalendarIcon },
        { href: '/consultas', label: 'Consultas', icon: SearchIcon },
        { href: '/processos', label: 'Processos', icon: FileTextIcon },
      ]
    },
    { 
      href: '/consultas', 
      label: 'Consultas', 
      icon: SearchIcon, 
      description: 'DETRAN e documentos' 
    },
    { 
      href: '/processos', 
      label: 'Processos', 
      icon: FileTextIcon, 
      description: 'Acompanhe seus processos' 
    },
    { 
      href: '/sobre', 
      label: 'Sobre', 
      icon: InfoIcon, 
      description: 'Sobre a empresa' 
    },
    { 
      href: '/contato', 
      label: 'Contato', 
      icon: PhoneIcon, 
      description: 'Fale conosco' 
    },
  ]

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/logo/333639480_607887381351075_3074158683519753451_n.jpg"
                alt="Lazuli Despachante"
                width={40}
                height={40}
                className="rounded-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Lazuli Despachante
              </span>
              <p className="text-xs text-gray-500 -mt-1">Franca-SP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                      <ChevronDownIcon className="h-4 w-4 ml-1 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        >
                          {item.subItems?.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <subItem.icon className="h-4 w-4 mr-3 text-gray-400" />
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 font-medium transition-colors duration-200 rounded-lg relative group ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Admin
            </Link>
            <Link
              href="/#calculator"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Calcular Preço
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          <div>
                            <span className="font-medium">{item.label}</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {isActive(item.href) && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </Link>
                      
                      {item.hasDropdown && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.subItems?.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <subItem.icon className="h-4 w-4 mr-2" />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                  >
                    <UserIcon className="h-5 w-5 mr-3" />
                    Área Administrativa
                  </Link>
                  <Link
                    href="/#calculator"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Calcular Preço
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
