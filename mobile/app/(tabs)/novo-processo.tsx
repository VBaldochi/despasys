import React from 'react';
import { View } from 'react-native';
import NovoProcessoForm from '../../components/NovoProcessoForm';

export default function NovoProcessoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <NovoProcessoForm />
    </View>
  );
}
