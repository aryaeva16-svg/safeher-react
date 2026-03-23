import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDiAHlT64w3E-XgyLgvBbWJkMqqVn7v-mk",
  authDomain: "safeher-3f244.firebaseapp.com",
  projectId: "safeher-3f244",
  storageBucket: "safeher-3f244.firebasestorage.app",
  messagingSenderId: "471118204919",
  appId: "1:471118204919:web:18e2e234afe9e9dc90e8f2",
  measurementId: "G-ZQKWV8JR58"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)