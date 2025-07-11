import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              Made with ❤️ by{' '}
              <Link 
                href="https://yurii.shushanskyi.com/" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yurii Shuhanskyi
              </Link>
              {' '}© 2025
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="https://github.com/Dazzoo" 
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link 
              href="https://www.linkedin.com/in/yurii-shushanskyi-399916160/" 
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <Link 
              href="mailto:yuraks46@gmail.com" 
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 