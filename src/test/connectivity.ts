// Testes de conectividade GCP + Firebase
import { PubSub } from '@google-cloud/pubsub'
import { database } from '../lib/firebase'
import { DespaSysEventBus } from '../lib/pubsub'
import { ref, set, get } from 'firebase/database'

export class ConnectivityTests {
  
  /**
   * Testar conexão com Pub/Sub
   */
  static async testPubSub() {
    console.log('🧪 Testando Pub/Sub...')
    
    try {
      const pubsub = new PubSub({ projectId: 'despasys-production' })
      
      // Listar tópicos existentes
      const [topics] = await pubsub.getTopics()
      console.log(`✅ Pub/Sub conectado! ${topics.length} tópicos encontrados`)
      
      // Criar tópico de teste
      const testTopicName = 'despasys-test-connectivity'
      const testTopic = pubsub.topic(testTopicName)
      
      const [exists] = await testTopic.exists()
      if (!exists) {
        await testTopic.create()
        console.log(`✅ Tópico de teste criado: ${testTopicName}`)
      }
      
      // Publicar mensagem de teste
      const messageId = await testTopic.publishMessage({
        data: Buffer.from(JSON.stringify({
          message: 'Teste de conectividade DespaSys',
          timestamp: Date.now()
        }))
      })
      
      console.log(`✅ Mensagem de teste publicada: ${messageId}`)
      
      // Limpar tópico de teste
      await testTopic.delete()
      console.log('🧹 Tópico de teste removido')
      
      return true
      
    } catch (error) {
      console.error('❌ Erro no teste Pub/Sub:', error)
      return false
    }
  }
  
  /**
   * Testar conexão com Firebase Realtime Database
   */
  static async testFirebase() {
    console.log('🧪 Testando Firebase Realtime Database...')
    
    try {
      // Escrever dados de teste
      const testRef = ref(database, 'test/connectivity')
      const testData = {
        message: 'Teste de conectividade DespaSys',
        timestamp: Date.now(),
        version: '1.0'
      }
      
      await set(testRef, testData)
      console.log('✅ Dados de teste escritos no Firebase')
      
      // Ler dados de teste
      const snapshot = await get(testRef)
      if (snapshot.exists()) {
        const data = snapshot.val()
        console.log('✅ Dados de teste lidos do Firebase:', data.message)
      } else {
        throw new Error('Dados de teste não encontrados')
      }
      
      // Limpar dados de teste
      await set(testRef, null)
      console.log('🧹 Dados de teste removidos')
      
      return true
      
    } catch (error) {
      console.error('❌ Erro no teste Firebase:', error)
      return false
    }
  }
  
  /**
   * Testar Event Bus completo
   */
  static async testEventBus() {
    console.log('🧪 Testando Event Bus completo...')
    
    try {
      // Publicar evento de teste
      const messageId = await DespaSysEventBus.publishEvent(
        'test-tenant',
        'system',
        {
          action: 'connectivity_test',
          message: 'Teste de conectividade completo'
        },
        {
          testMode: true
        }
      )
      
      console.log(`✅ Evento de teste publicado: ${messageId}`)
      
      return true
      
    } catch (error) {
      console.error('❌ Erro no teste Event Bus:', error)
      return false
    }
  }
  
  /**
   * Executar todos os testes
   */
  static async runAllTests() {
    console.log('🚀 Iniciando testes de conectividade DespaSys...\n')
    
    const results = {
      pubsub: false,
      firebase: false,
      eventBus: false
    }
    
    // Teste Pub/Sub
    results.pubsub = await this.testPubSub()
    console.log('')
    
    // Teste Firebase
    results.firebase = await this.testFirebase()
    console.log('')
    
    // Teste Event Bus
    results.eventBus = await this.testEventBus()
    console.log('')
    
    // Resumo
    console.log('📊 RESUMO DOS TESTES:')
    console.log(`Pub/Sub: ${results.pubsub ? '✅' : '❌'}`)
    console.log(`Firebase: ${results.firebase ? '✅' : '❌'}`)
    console.log(`Event Bus: ${results.eventBus ? '✅' : '❌'}`)
    
    const allPassed = Object.values(results).every(Boolean)
    console.log(`\n${allPassed ? '🎉' : '⚠️'} Resultado geral: ${allPassed ? 'TODOS OS TESTES PASSARAM!' : 'ALGUNS TESTES FALHARAM'}`)
    
    return results
  }
}
