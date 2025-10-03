'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  PhoneIcon, 
  MessageCircleIcon, 
  CalculatorIcon, 
  CalendarIcon,
  XIcon
} from 'lucide-react'

interface FABAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  color?: string
}

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions: FABAction[] = [
    {
      icon: CalculatorIcon,
      label: 'Calcular Preço',
      onClick: () => {
        const calculatorElement = document.getElementById('calculator')
        if (calculatorElement) {
          calculatorElement.scrollIntoView({ behavior: 'smooth' })
        }
        setIsOpen(false)
      },
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: CalendarIcon,
      label: 'Agendar Atendimento',
      onClick: () => {
        const agendamentoElement = document.getElementById('agendamento')
        if (agendamentoElement) {
          agendamentoElement.scrollIntoView({ behavior: 'smooth' })
        }
        setIsOpen(false)
      },
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: MessageCircleIcon,
      label: 'WhatsApp',
      onClick: () => {
        window.open('https://wa.me/5516982477126?text=Olá! Gostaria de mais informações sobre os serviços da Lazuli Despachante.', '_blank')
        setIsOpen(false)
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: PhoneIcon,
      label: 'Ligar',
      onClick: () => {
        window.location.href = 'tel:+5516982477126'
        setIsOpen(false)
      },
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: -20, 
                  scale: 0.8,
                  transition: { delay: (actions.length - index - 1) * 0.1 }
                }}
                onClick={action.onClick}
                className={`flex items-center p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white group ${action.color}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="h-5 w-5" />
                <span className="ml-3 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? (
          <XIcon className="h-6 w-6" />
        ) : (
          <PlusIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  )
}
