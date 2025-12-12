'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Key, 
  Activity, 
  FileText, 
  Webhook, 
  BookOpen, 
  Store,
  Menu
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/monitoring', label: 'Monitoramento', icon: Activity },
  { href: '/logs', label: 'Logs', icon: FileText },
  { href: '/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/documentation', label: 'Documentação', icon: BookOpen },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-fluap shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-fluap border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-600">FLUAP CONNECT</h1>
          <p className="text-sm text-gray-500 mt-1">Portal de Integrações</p>
        </div>
        <nav className="p-fluap space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-fluap transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

