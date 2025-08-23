'use client'

import DetranConsulta from '@/components/DetranConsulta'
import DocumentValidator from '@/components/ValidadorDocumento'
import RelatorioPendencias from '@/components/RelatorioPendencias'
import Layout from '@/components/Layout'

export default function ConsultasPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <DetranConsulta />
        <DocumentValidator />
        <RelatorioPendencias />
      </div>
    </Layout>
  )
}
