'use client'

import { forwardRef, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  rounded?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }
    
    const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg'
    const widthClasses = fullWidth ? 'w-full' : ''
    
    const isDisabled = disabled || loading
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${roundedClasses}
          ${widthClasses}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Componente de grupo de botões
interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  className = '' 
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }
  
  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  )
}

// Componente de botão de ação flutuante
interface FABProps extends Omit<ButtonProps, 'variant' | 'size'> {
  size?: 'sm' | 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color?: 'primary' | 'secondary' | 'danger'
}

export function FAB({
  size = 'md',
  position = 'bottom-right',
  color = 'primary',
  className = '',
  children,
  ...props
}: FABProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }
  
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }
  
  const colorClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  return (
    <button
      className={`
        fixed ${positionClasses[position]} ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        z-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

// Componente de botão de toggle
interface ToggleButtonProps extends Omit<ButtonProps, 'variant'> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export function ToggleButton({
  pressed = false,
  onPressedChange,
  className = '',
  children,
  ...props
}: ToggleButtonProps) {
  const handleClick = () => {
    onPressedChange?.(!pressed)
  }
  
  return (
    <Button
      variant={pressed ? 'primary' : 'outline'}
      onClick={handleClick}
      className={`
        ${pressed ? 'shadow-inner' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Button>
  )
}

// Componente de botão com ícone
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: ReactNode
  'aria-label': string
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  rounded = true,
  className = '',
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      rounded={rounded}
      className={`${sizeClasses[size]} p-0 ${className}`}
      {...props}
    >
      {icon}
    </Button>
  )
}
