import { reactive } from 'vue'

interface AuthState {
  isLogged: boolean
  role: string
  token: string | null
}

// Criando uma store simples, reativa e segura utilizando a Composition API nativa
export const authStore = reactive<AuthState>({
  isLogged: localStorage.getItem('ecoWave_logged') === 'true',
  role: localStorage.getItem('ecoWave_role') || 'USER',
  token: localStorage.getItem('ecoWave_token')
})

export function setSession(token: string, role: string) {
  localStorage.setItem('ecoWave_logged', 'true')
  localStorage.setItem('ecoWave_role', role)
  localStorage.setItem('ecoWave_token', token)
  
  authStore.isLogged = true
  authStore.role = role
  authStore.token = token
}

export function clearSession() {
  localStorage.removeItem('ecoWave_logged')
  localStorage.removeItem('ecoWave_role')
  localStorage.removeItem('ecoWave_token')
  
  authStore.isLogged = false
  authStore.role = 'USER'
  authStore.token = null
}