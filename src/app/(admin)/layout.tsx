'use client'

import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AuthGuard from '@/components/admin/AuthGuard'
import ServerAuthGuard from '@/components/admin/ServerAuthGuard'
import SimpleAuthGuard from '@/components/admin/SimpleAuthGuard'
import DebugAuthGuard from '@/components/admin/DebugAuthGuard'
import FinalAuthGuard from '@/components/admin/FinalAuthGuard'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SessionProvider>
      <FinalAuthGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen">
            {/* Sidebar para desktop */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col">
              <div className="flex flex-col h-full bg-white shadow-lg">
                {/* Header do Sidebar */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">DespaSys Admin</h2>
                </div>
                <AdminSidebar isOpen={true} setIsOpen={setSidebarOpen} />
              </div>
            </div>
            
            {/* Sidebar mobile (overlay) */}
            <div className="lg:hidden">
              <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            </div>
            
            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Top Navigation */}
              <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                  <div className="relative flex flex-1">
                    {/* Search can be added here later */}
                  </div>
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                    {/* Profile dropdown can be added here later */}
                  </div>
                </div>
              </div>

              <main className="flex-1 overflow-y-auto">
                <div className="px-4 sm:px-6 lg:px-8 py-2">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </FinalAuthGuard>
    </SessionProvider>
  )
}
