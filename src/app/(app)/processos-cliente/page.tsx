'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ClientPortal from '@/components/modules/PortalCliente';
import Layout from '@/components/layout/Layout';

export default function ClientPortalPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal do Cliente</h1>
          <p className="text-gray-600">
            Acompanhe seus processos de documentação veicular
          </p>
        </motion.div>

        <ClientPortal />
      </div>
    </Layout>
  );
}
