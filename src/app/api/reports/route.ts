import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - List technical reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const reportType = searchParams.get('reportType')
    const priority = searchParams.get('priority')

    // Build where clause
    const where: any = {
      // tenantId: session.user.tenantId // TODO: Get from session when multi-tenant is active
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (reportType && reportType !== 'ALL') {
      where.reportType = reportType
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority
    }

    // Fetch all reports for stats
    const allReports = await prisma.technicalReport.findMany({
      // where: { tenantId: session.user.tenantId },
      orderBy: { requestedDate: 'desc' }
    })

    // Fetch filtered reports
    const reports = await prisma.technicalReport.findMany({
      where,
      orderBy: { requestedDate: 'desc' }
    })

    // Calculate statistics
    const totalLaudos = allReports.length
    const emAndamento = allReports.filter(r => 
      ['EM_ANALISE', 'EM_CAMPO', 'ELABORANDO'].includes(r.status)
    ).length
    const concluidos = allReports.filter(r => r.status === 'CONCLUIDO').length
    const valorMedio = allReports.length > 0
      ? allReports.reduce((sum, r) => sum + r.value, 0) / allReports.length
      : 0

    return NextResponse.json({
      reports,
      stats: {
        totalLaudos,
        emAndamento,
        concluidos,
        valorMedio
      }
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar laudos' },
      { status: 500 }
    )
  }
}

// POST - Create new technical report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validation
    if (!data.customerName) {
      return NextResponse.json(
        { error: 'Nome do cliente é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.customerPhone) {
      return NextResponse.json(
        { error: 'Telefone do cliente é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.vehicleBrand) {
      return NextResponse.json(
        { error: 'Marca do veículo é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.vehicleModel) {
      return NextResponse.json(
        { error: 'Modelo do veículo é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.vehicleYear) {
      return NextResponse.json(
        { error: 'Ano do veículo é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.vehiclePlate) {
      return NextResponse.json(
        { error: 'Placa do veículo é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.reportType) {
      return NextResponse.json(
        { error: 'Tipo de laudo é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.purpose) {
      return NextResponse.json(
        { error: 'Finalidade é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.value || data.value <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (!data.location) {
      return NextResponse.json(
        { error: 'Local é obrigatório' },
        { status: 400 }
      )
    }

    // Create new technical report
    const newReport = await prisma.technicalReport.create({
      data: {
        tenantId: 'tenant-default', // TODO: session.user.tenantId when multi-tenant is active
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        vehiclePlate: data.vehiclePlate,
        chassisNumber: data.chassisNumber || null,
        reportType: data.reportType,
        purpose: data.purpose,
        status: 'SOLICITADO',
        requestedDate: new Date(),
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        completedDate: null,
        value: parseFloat(data.value),
        location: data.location,
        findings: [],
        conclusion: null,
        recommendations: [],
        attachments: [],
        priority: data.priority || 'MEDIA',
        notes: data.notes || null,
      }
    })

    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Erro ao criar laudo' },
      { status: 500 }
    )
  }
}

// PUT - Update technical report
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'ID do laudo é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.status) {
      prismaUpdateData.status = updateData.status
      
      // Set completedDate when status changes to CONCLUIDO
      if (updateData.status === 'CONCLUIDO') {
        prismaUpdateData.completedDate = new Date()
      }
    }
    
    if (updateData.scheduledDate !== undefined) {
      prismaUpdateData.scheduledDate = updateData.scheduledDate ? new Date(updateData.scheduledDate) : null
    }
    
    if (updateData.findings) prismaUpdateData.findings = updateData.findings
    if (updateData.conclusion !== undefined) prismaUpdateData.conclusion = updateData.conclusion
    if (updateData.recommendations) prismaUpdateData.recommendations = updateData.recommendations
    if (updateData.attachments) prismaUpdateData.attachments = updateData.attachments
    if (updateData.notes !== undefined) prismaUpdateData.notes = updateData.notes
    if (updateData.priority) prismaUpdateData.priority = updateData.priority
    if (updateData.value) prismaUpdateData.value = parseFloat(updateData.value)

    // Update report
    const updatedReport = await prisma.technicalReport.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar laudo' },
      { status: 500 }
    )
  }
}

// DELETE - Delete technical report
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do laudo é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.technicalReport.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Laudo removido com sucesso' })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Erro ao remover laudo' },
      { status: 500 }
    )
  }
}
