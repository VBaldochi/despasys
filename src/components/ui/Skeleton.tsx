'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'wave' | 'none'
  lines?: number
}

export default function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse',
  lines = 1 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded'
  
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: 'h-4 w-full',
    circular: 'rounded-full w-8 h-8'
  }

  const animationVariants = {
    pulse: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    wave: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    none: {}
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            animate={animation !== 'none' ? animationVariants[animation] : {}}
            style={{
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      animate={animation !== 'none' ? animationVariants[animation] : {}}
    />
  )
}

// Componentes específicos para diferentes casos de uso
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1">
          <Skeleton variant="text" className="h-6 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/2 mt-2" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="h-8 w-20" />
        <Skeleton variant="text" className="h-8 w-24" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="h-6 w-40" />
          <Skeleton variant="text" className="h-8 w-24" />
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Skeleton variant="circular" className="w-8 h-8" />
              <div>
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-24 mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" className="h-4 w-16" />
              <Skeleton variant="text" className="h-4 w-20" />
              <Skeleton variant="text" className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <Skeleton variant="text" className="h-8 w-64" />
      
      <div className="space-y-4">
        <div>
          <Skeleton variant="text" className="h-4 w-24 mb-2" />
          <Skeleton variant="text" className="h-10 w-full" />
        </div>
        
        <div>
          <Skeleton variant="text" className="h-4 w-32 mb-2" />
          <Skeleton variant="text" className="h-10 w-full" />
        </div>
        
        <div>
          <Skeleton variant="text" className="h-4 w-28 mb-2" />
          <Skeleton variant="text" className="h-24 w-full" />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Skeleton variant="text" className="h-10 w-24" />
        <Skeleton variant="text" className="h-10 w-32" />
      </div>
    </div>
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1">
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2 mt-2" />
          </div>
          <Skeleton variant="text" className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}
