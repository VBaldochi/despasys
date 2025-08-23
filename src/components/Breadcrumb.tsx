'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export default function Breadcrumb() {
  const pathname = usePathname()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Início', href: '/', icon: HomeIcon }
    ]

    if (!pathname || pathname === '/') {
      return breadcrumbs
    }

    const pathSegments = pathname.split('/').filter(Boolean)
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      
      let label = segment
      
      // Mapear segmentos para labels mais amigáveis
      switch (segment) {
        case 'consultas':
          label = 'Consultas DETRAN'
          break
        case 'processos':
          label = 'Meus Processos'
          break
        case 'admin':
          label = 'Administração'
          break
        case 'dashboard':
          label = 'Dashboard'
          break
        case 'login':
          label = 'Login'
          break
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }
      
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Não mostrar breadcrumb na página inicial
  if (pathname === '/') {
    return null
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {index === breadcrumbs.length - 1 ? (
                <span className="flex items-center font-medium text-blue-600">
                  {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
