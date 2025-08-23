'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  CheckCircleIcon, 
  DocumentArrowDownIcon, 
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import { PriceCalculation, formatPrice } from '@/store/calculadoraStore'

interface QuoteResultProps {
  calculation: PriceCalculation
  onBack: () => void
}

export default function QuoteResult({ calculation, onBack }: QuoteResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const element = document.getElementById('quote-content')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`orçamento-lazuli-${calculation.customerInfo.name.replace(/\s+/g, '-')}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const sendWhatsApp = () => {
    const serviceName = getServiceName(calculation.service)
    const vehicleName = getVehicleName(calculation.vehicleType)
    const urgencyName = getUrgencyName(calculation.urgency)
    
    const whatsappMessage = `
🎯 *ORÇAMENTO LAZULI DESPACHANTE*

👤 *Cliente:* ${calculation.customerInfo.name}
📞 *Telefone:* ${calculation.customerInfo.phone}

🚗 *Serviço:* ${serviceName}
🚙 *Veículo:* ${vehicleName} (${calculation.vehicleYear})
⚡ *Urgência:* ${urgencyName}

${calculation.additionalServices.length > 0 ? `🔧 *Serviços Adicionais:*\n${calculation.additionalServices.map(s => `• ${getAdditionalServiceName(s)}`).join('\n')}\n` : ''}

💰 *VALOR TOTAL: ${formatPrice(calculation.finalPrice)}*

Gostaria de prosseguir com este serviço!
    `.trim()

    const whatsappURL = `https://wa.me/5516982477126?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappURL, '_blank')
  }

  const getServiceName = (service: string) => {
    const services: { [key: string]: string } = {
      'licenciamento': 'Licenciamento',
      'transferencia': 'Transferência', 
      'primeiro-registro': '1° Registro',
      'desbloqueio': 'Desbloqueio'
    }
    return services[service] || service
  }

  const getVehicleName = (vehicleType: string) => {
    const vehicles: { [key: string]: string } = {
      'carro': 'Carro',
      'moto': 'Moto',
      'caminhao': 'Caminhão',
      'onibus': 'Ônibus',
      'reboque': 'Reboque'
    }
    return vehicles[vehicleType] || vehicleType
  }

  const getUrgencyName = (urgency: string) => {
    const urgencies: { [key: string]: string } = {
      'normal': 'Normal (5-7 dias)',
      'urgente': 'Urgente (2-3 dias)',
      'expresso': 'Expresso (24h)'
    }
    return urgencies[urgency] || urgency
  }

  const getAdditionalServiceName = (service: string) => {
    const services: { [key: string]: string } = {
      'vistoria': 'Vistoria',
      'leilao': 'Leilão',
      'guincho': 'Guincho',
      'autenticacao': 'Autenticação de Documentos',
      'busca-documento': 'Busca de Documento'
    }
    return services[service] || service
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Orçamento Calculado!
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Confira os detalhes do seu orçamento personalizado
            </p>
          </div>

          {/* Quote Content */}
          <div id="quote-content" className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Company Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Lazuli Despachante
              </h3>
              <p className="text-gray-600">Despachante Credenciado Detran-SP</p>
              <p className="text-sm text-gray-500">
                Av. Alagoas, 882 - Vila Aparecida, Franca-SP | (16) 98247-7126
              </p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Dados do Cliente
                </h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {calculation.customerInfo.name}</p>
                  <p><span className="font-medium">Telefone:</span> {calculation.customerInfo.phone}</p>
                  {calculation.customerInfo.email && (
                    <p><span className="font-medium">Email:</span> {calculation.customerInfo.email}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Informações do Serviço
                </h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Serviço:</span> {getServiceName(calculation.service)}</p>
                  <p><span className="font-medium">Veículo:</span> {getVehicleName(calculation.vehicleType)} ({calculation.vehicleYear})</p>
                  <p><span className="font-medium">Urgência:</span> {getUrgencyName(calculation.urgency)}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhamento do Orçamento
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Serviço Base</span>
                  <span className="font-medium">{formatPrice(calculation.basePrice)}</span>
                </div>

                {calculation.additionalServices.length > 0 && (
                  <>
                    <div className="border-t pt-3">
                      <span className="text-gray-700 font-medium">Serviços Adicionais:</span>
                    </div>
                    {calculation.additionalServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center ml-4">
                        <span className="text-gray-600">• {getAdditionalServiceName(service)}</span>
                        <span className="font-medium">+{formatPrice(50)}</span>
                      </div>
                    ))}
                  </>
                )}

                {calculation.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Desconto</span>
                    <span>-{formatPrice(calculation.discount)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>TOTAL</span>
                    <span className="text-green-600">{formatPrice(calculation.finalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-2">Condições:</h5>
              <ul className="space-y-1">
                <li>• Preços válidos por 30 dias</li>
                <li>• Pagamento: À vista ou parcelado</li>
                <li>• Documentação necessária será informada</li>
                <li>• Atendimento de segunda a sexta-feira</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Orçamento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <button
              onClick={onBack}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar
            </button>

            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gerando PDF...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Baixar PDF
                </>
              )}
            </button>

            <button
              onClick={sendWhatsApp}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Solicitar via WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
