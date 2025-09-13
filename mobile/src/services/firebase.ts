// Firebase Configuration for React Native
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Configuração do Firebase (mesma do web)
const firebaseConfig = {
  apiKey: "AIzaSyBGPo7ZfhliBCLv_CekTJessJzAYWC59ig",
  authDomain: "despasys-production-80bf2.firebaseapp.com",
  databaseURL: "https://despasys-production-80bf2-default-rtdb.firebaseio.com",
  projectId: "despasys-production-80bf2",
  storageBucket: "despasys-production-80bf2.firebasestorage.app",
  messagingSenderId: "417464252759",
  appId: "1:417464252759:web:1f0737d89431b28ce36612"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)

// Export for easy importing
export default app
