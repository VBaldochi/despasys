'use client'

import DetranConsulta from '@/components/modules/DetranConsulta'
import DocumentValidator from '@/components/modules/ValidadorDocumento'
import RelatorioPendencias from '@/components/modules/RelatorioPendencias'
import Layout from '@/components/layout/Layout'

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
