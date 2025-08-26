'use client'

import { motion } from 'framer-motion'
import { LoaderIcon } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'gray'
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  text = 'Carregando...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    gray: 'text-gray-600'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]} mb-2`}
      >
        <LoaderIcon className="h-full w-full" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className={`text-sm ${colorClasses[color]} font-medium`}
      >
        {text}
      </motion.p>
    </div>
  )
}

// Componente de loading para página inteira
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <LoadingSpinner size="lg" text="Carregando página..." />
      </div>
    </div>
  )
}

// Componente de loading para cards
export function CardLoader() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  )
}

// Skeleton loader para tabelas
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }, (_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}
