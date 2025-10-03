'use client'

import { forwardRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  variant?: 'default' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  success?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    hint, 
    icon, 
    variant = 'default',
    size = 'md',
    success = false,
    className = '',
    type = 'text',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState(false)
    
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    }
    
    const variantClasses = {
      default: 'border border-gray-300 rounded-lg bg-white',
      outlined: 'border-2 border-gray-300 rounded-lg bg-transparent',
      filled: 'border-0 rounded-lg bg-gray-100'
    }
    
    const getStateClasses = () => {
      if (error) {
        return 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      }
      if (success) {
        return 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
      }
      return 'focus:border-blue-500 focus:ring-blue-500/20'
    }
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${getStateClasses()}
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          
          {success && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {error ? (
              <p className="text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            ) : (
              <p className="text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Componente de Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'outlined' | 'filled'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    hint, 
    variant = 'default',
    resize = 'vertical',
    className = '',
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'border border-gray-300 rounded-lg bg-white',
      outlined: 'border-2 border-gray-300 rounded-lg bg-transparent',
      filled: 'border-0 rounded-lg bg-gray-100'
    }
    
    const getStateClasses = () => {
      if (error) {
        return 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      }
      return 'focus:border-blue-500 focus:ring-blue-500/20'
    }
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-3 text-base
              ${variantClasses[variant]}
              ${getStateClasses()}
              ${resizeClasses[resize]}
              transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          
          {error && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {error ? (
              <p className="text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            ) : (
              <p className="text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Componente de Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    hint, 
    options,
    placeholder = 'Selecione uma opção',
    className = '',
    ...props 
  }, ref) => {
    const getStateClasses = () => {
      if (error) {
        return 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      }
      return 'focus:border-blue-500 focus:ring-blue-500/20'
    }
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 text-base
              border border-gray-300 rounded-lg bg-white
              ${getStateClasses()}
              transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {error && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {error ? (
              <p className="text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            ) : (
              <p className="text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
