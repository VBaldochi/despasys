'use client'

import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
  LockOpenIcon,
  UserIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface NovoDesbloqueioModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UnlockFormData) => Promise<void>
}

interface Customer {
  id: string
  name: string
  cpf: string
  phone: string
  email?: string
}

interface Vehicle {
  id: string
  brand: string
  model: string
  year: string
  plate: string
  renavam: string
  chassisNumber?: string
}

export interface UnlockFormData {
  // Customer
  customerId: string
  customerName: string
  customerCpf: string
  customerPhone: string
  customerEmail?: string
  
  // Vehicle (optional - can use existing or manual entry)
  vehicleId?: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  renavam: string
  chassisNumber?: string
  
  // Unlock Info
  unlockType: 'ADMINISTRATIVO' | 'JUDICIAL' | 'MULTAS' | 'IPVA' | 'FURTO_ROUBO' | 'OUTROS'
  blockReason: string
  blockDate?: string
  issueDescription: string
  responsibleOrgan: string
  
  // Fees
  detranFee: number
  serviceFee: number
  
  // Documents
  requiredDocuments: string[]
  
  // Other
  priority: 'NORMAL' | 'URGENTE'
  notes?: string
}

export default function NovoDesbloqueioModal({ isOpen, onClose, onSubmit }: NovoDesbloqueioModalProps) {
  // Form state
  const [formData, setFormData] = useState<UnlockFormData>({
    customerId: '',
    customerName: '',
    customerCpf: '',
    customerPhone: '',
    customerEmail: '',
    vehicleId: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    renavam: '',
    chassisNumber: '',
    unlockType: 'ADMINISTRATIVO',
    blockReason: '',
    blockDate: '',
    issueDescription: '',
    responsibleOrgan: 'DETRAN/SP',
    detranFee: 95.75,
    serviceFee: 80.00,
    requiredDocuments: ['CRV', 'CNH', 'CPF', 'Comprovante Residência'],
    priority: 'NORMAL',
    notes: ''
  })

  // UI state
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [useManualVehicle, setUseManualVehicle] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Default documents by unlock type
  const defaultDocumentsByType = {
    ADMINISTRATIVO: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Certidão Negativa'],
    JUDICIAL: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Decisão Judicial', 'Mandado'],
    MULTAS: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Quitação Multas'],
    IPVA: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Quitação IPVA'],
    FURTO_ROUBO: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'BO Recuperação', 'Laudo Pericial'],
    OUTROS: ['CRV', 'CNH', 'CPF', 'Comprovante Residência']
  }

  // Default fees by unlock type
  const defaultFeesByType = {
    ADMINISTRATIVO: { detran: 75.50, service: 60.00 },
    JUDICIAL: { detran: 145.50, service: 120.00 },
    MULTAS: { detran: 95.75, service: 80.00 },
    IPVA: { detran: 95.75, service: 80.00 },
    FURTO_ROUBO: { detran: 145.50, service: 120.00 },
    OUTROS: { detran: 95.75, service: 80.00 }
  }

  // Fetch customers
  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  const fetchCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoadingCustomers(false)
    }
  }

  // Fetch vehicles when customer changes
  useEffect(() => {
    if (formData.customerId) {
      fetchVehicles(formData.customerId)
    } else {
      setVehicles([])
    }
  }, [formData.customerId])

  const fetchVehicles = async (customerId: string) => {
    setLoadingVehicles(true)
    try {
      const response = await fetch(`/api/customers/${customerId}/vehicles`)
      if (response.ok) {
        const data = await response.json()
        setVehicles(data)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoadingVehicles(false)
    }
  }

  // Update fees and documents when unlock type changes
  useEffect(() => {
    const fees = defaultFeesByType[formData.unlockType]
    const documents = defaultDocumentsByType[formData.unlockType]
    
    setFormData(prev => ({
      ...prev,
      detranFee: fees.detran,
      serviceFee: fees.service,
      requiredDocuments: documents
    }))
  }, [formData.unlockType])

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerCpf: customer.cpf,
        customerPhone: customer.phone,
        customerEmail: customer.email || '',
        // Reset vehicle selection
        vehicleId: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: '',
        renavam: '',
        chassisNumber: ''
      }))
      setUseManualVehicle(false)
    }
  }

  const handleVehicleChange = (vehicleId: string) => {
    if (vehicleId === 'manual') {
      setUseManualVehicle(true)
      setFormData(prev => ({
        ...prev,
        vehicleId: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: '',
        renavam: '',
        chassisNumber: ''
      }))
    } else {
      const vehicle = vehicles.find(v => v.id === vehicleId)
      if (vehicle) {
        setUseManualVehicle(false)
        setFormData(prev => ({
          ...prev,
          vehicleId: vehicle.id,
          vehicleBrand: vehicle.brand,
          vehicleModel: vehicle.model,
          vehicleYear: vehicle.year,
          vehiclePlate: vehicle.plate,
          renavam: vehicle.renavam,
          chassisNumber: vehicle.chassisNumber || ''
        }))
      }
    }
  }

  const handleDocumentToggle = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter(d => d !== doc)
        : [...prev.requiredDocuments, doc]
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = 'Selecione um cliente'
    }

    if (!formData.vehiclePlate) {
      newErrors.vehiclePlate = 'Informe a placa do veículo'
    }

    if (!formData.renavam) {
      newErrors.renavam = 'Informe o RENAVAM'
    }

    if (!formData.vehicleBrand) {
      newErrors.vehicleBrand = 'Informe a marca do veículo'
    }

    if (!formData.vehicleModel) {
      newErrors.vehicleModel = 'Informe o modelo do veículo'
    }

    if (!formData.vehicleYear) {
      newErrors.vehicleYear = 'Informe o ano do veículo'
    }

    if (!formData.blockReason) {
      newErrors.blockReason = 'Informe o motivo do bloqueio'
    }

    if (!formData.issueDescription) {
      newErrors.issueDescription = 'Descreva o problema'
    }

    if (!formData.responsibleOrgan) {
      newErrors.responsibleOrgan = 'Informe o órgão responsável'
    }

    if (formData.requiredDocuments.length === 0) {
      newErrors.requiredDocuments = 'Selecione ao menos um documento'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Error submitting unlock:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerCpf: '',
      customerPhone: '',
      customerEmail: '',
      vehicleId: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      renavam: '',
      chassisNumber: '',
      unlockType: 'ADMINISTRATIVO',
      blockReason: '',
      blockDate: '',
      issueDescription: '',
      responsibleOrgan: 'DETRAN/SP',
      detranFee: 95.75,
      serviceFee: 80.00,
      requiredDocuments: ['CRV', 'CNH', 'CPF', 'Comprovante Residência'],
      priority: 'NORMAL',
      notes: ''
    })
    setErrors({})
    setUseManualVehicle(false)
    onClose()
  }

  const totalFee = formData.detranFee + formData.serviceFee

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LockOpenIcon className="h-6 w-6 text-white" />
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Novo Desbloqueio
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Customer Selection */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-sm font-semibold text-blue-900">Cliente</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selecione o Cliente *
                          </label>
                          <select
                            value={formData.customerId}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.customerId ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loadingCustomers}
                          >
                            <option value="">
                              {loadingCustomers ? 'Carregando...' : 'Selecione um cliente'}
                            </option>
                            {customers.map(customer => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name} - {customer.cpf}
                              </option>
                            ))}
                          </select>
                          {errors.customerId && (
                            <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
                          )}
                        </div>

                        {formData.customerId && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">CPF:</span>{' '}
                              <span className="font-medium">{formData.customerCpf}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Telefone:</span>{' '}
                              <span className="font-medium">{formData.customerPhone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Selection */}
                    {formData.customerId && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <TruckIcon className="h-5 w-5 text-gray-600" />
                          <h3 className="text-sm font-semibold text-gray-900">Veículo</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Selecione o Veículo *
                            </label>
                            <select
                              value={useManualVehicle ? 'manual' : formData.vehicleId}
                              onChange={(e) => handleVehicleChange(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              disabled={loadingVehicles}
                            >
                              <option value="">
                                {loadingVehicles ? 'Carregando...' : 'Selecione um veículo'}
                              </option>
                              {vehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.brand} {vehicle.model} {vehicle.year} - {vehicle.plate}
                                </option>
                              ))}
                              <option value="manual">+ Informar veículo manualmente</option>
                            </select>
                          </div>

                          {(useManualVehicle || formData.vehicleId) && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Marca *
                                </label>
                                <input
                                  type="text"
                                  value={formData.vehicleBrand}
                                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.vehicleBrand ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Ex: Honda"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                                {errors.vehicleBrand && (
                                  <p className="text-red-500 text-xs mt-1">{errors.vehicleBrand}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Modelo *
                                </label>
                                <input
                                  type="text"
                                  value={formData.vehicleModel}
                                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Ex: Civic"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                                {errors.vehicleModel && (
                                  <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Ano *
                                </label>
                                <input
                                  type="text"
                                  value={formData.vehicleYear}
                                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.vehicleYear ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Ex: 2020"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                                {errors.vehicleYear && (
                                  <p className="text-red-500 text-xs mt-1">{errors.vehicleYear}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Placa *
                                </label>
                                <input
                                  type="text"
                                  value={formData.vehiclePlate}
                                  onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value.toUpperCase() }))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.vehiclePlate ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="ABC-1234"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                                {errors.vehiclePlate && (
                                  <p className="text-red-500 text-xs mt-1">{errors.vehiclePlate}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  RENAVAM *
                                </label>
                                <input
                                  type="text"
                                  value={formData.renavam}
                                  onChange={(e) => setFormData(prev => ({ ...prev, renavam: e.target.value }))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                    errors.renavam ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="00123456789"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                                {errors.renavam && (
                                  <p className="text-red-500 text-xs mt-1">{errors.renavam}</p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Chassi (opcional)
                                </label>
                                <input
                                  type="text"
                                  value={formData.chassisNumber}
                                  onChange={(e) => setFormData(prev => ({ ...prev, chassisNumber: e.target.value.toUpperCase() }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="9BWZZZ377VT004251"
                                  disabled={!useManualVehicle && formData.vehicleId !== ''}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Unlock Info */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldExclamationIcon className="h-5 w-5 text-red-600" />
                        <h3 className="text-sm font-semibold text-red-900">Informações do Bloqueio</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Desbloqueio *
                          </label>
                          <select
                            value={formData.unlockType}
                            onChange={(e) => setFormData(prev => ({ ...prev, unlockType: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="ADMINISTRATIVO">Administrativo</option>
                            <option value="JUDICIAL">Judicial</option>
                            <option value="MULTAS">Multas</option>
                            <option value="IPVA">IPVA</option>
                            <option value="FURTO_ROUBO">Furto/Roubo</option>
                            <option value="OUTROS">Outros</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Órgão Responsável *
                          </label>
                          <input
                            type="text"
                            value={formData.responsibleOrgan}
                            onChange={(e) => setFormData(prev => ({ ...prev, responsibleOrgan: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.responsibleOrgan ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: DETRAN/SP, Polícia Civil, Judiciário"
                          />
                          {errors.responsibleOrgan && (
                            <p className="text-red-500 text-xs mt-1">{errors.responsibleOrgan}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo do Bloqueio *
                          </label>
                          <input
                            type="text"
                            value={formData.blockReason}
                            onChange={(e) => setFormData(prev => ({ ...prev, blockReason: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.blockReason ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Excesso de multas não pagas"
                          />
                          {errors.blockReason && (
                            <p className="text-red-500 text-xs mt-1">{errors.blockReason}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data do Bloqueio (opcional)
                          </label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              value={formData.blockDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, blockDate: e.target.value }))}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição do Problema *
                          </label>
                          <textarea
                            value={formData.issueDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.issueDescription ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={3}
                            placeholder="Descreva detalhadamente o problema que causou o bloqueio"
                          />
                          {errors.issueDescription && (
                            <p className="text-red-500 text-xs mt-1">{errors.issueDescription}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                        <h3 className="text-sm font-semibold text-green-900">Taxas</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Taxa DETRAN
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.detranFee}
                              onChange={(e) => setFormData(prev => ({ ...prev, detranFee: parseFloat(e.target.value) || 0 }))}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Taxa Serviço
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.serviceFee}
                              onChange={(e) => setFormData(prev => ({ ...prev, serviceFee: parseFloat(e.target.value) || 0 }))}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              R$
                            </span>
                            <input
                              type="text"
                              value={totalFee.toFixed(2)}
                              readOnly
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-green-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-3">
                        <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-sm font-semibold text-yellow-900">Documentos Necessários</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          'CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Certidão Negativa',
                          'Quitação Multas', 'Quitação IPVA', 'BO Recuperação', 'Laudo Pericial',
                          'Decisão Judicial', 'Mandado', 'Outros'
                        ].map(doc => (
                          <label key={doc} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.requiredDocuments.includes(doc)}
                              onChange={() => handleDocumentToggle(doc)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{doc}</span>
                          </label>
                        ))}
                      </div>
                      {errors.requiredDocuments && (
                        <p className="text-red-500 text-xs mt-2">{errors.requiredDocuments}</p>
                      )}
                    </div>

                    {/* Priority and Notes */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridade
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value="NORMAL"
                              checked={formData.priority === 'NORMAL'}
                              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Normal</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value="URGENTE"
                              checked={formData.priority === 'URGENTE'}
                              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                              className="h-4 w-4 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center gap-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                              Urgente
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Informações adicionais sobre o desbloqueio"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Salvando...
                        </>
                      ) : (
                        'Criar Desbloqueio'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
