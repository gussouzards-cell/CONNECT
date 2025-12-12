import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'FLUAP CONNECT - Portal de Integrações',
  description: 'Portal de integrações e APIs do ecossistema Fluap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

