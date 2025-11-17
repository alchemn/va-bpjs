'use client'

import { useRouter } from 'next/navigation'

interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: Crumb[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="text-sm text-gray-600 mb-6">
      <ol className="flex flex-wrap items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <button
                onClick={() => router.push(item.href!)}
                className="hover:text-green-700 hover:underline font-medium transition"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-800 font-semibold">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
