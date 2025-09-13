import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RealtimeDashboard from '@/src/components/RealtimeDashboard';

export default function SyncScreen() {
  // Por enquanto usando tenant demo, depois pegar do contexto do usuário
  const tenantId = 'demo';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RealtimeDashboard tenantId={tenantId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
});
