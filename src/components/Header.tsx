'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                URL Shortener
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/')} text-sm font-medium`}
              >
                URL Shortener
              </Link>
              <Link
                href="/analytics"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/analytics' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/analytics')} text-sm font-medium`}
              >
                URL Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 