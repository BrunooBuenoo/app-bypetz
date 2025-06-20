<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Bem-vindo de volta!</h1>
        <p>Entre na sua conta ByPetz</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="seu@email.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="password-input">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Sua senha"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>Lembrar de mim</span>
          </label>
          <button type="button" @click="showResetPassword = true" class="forgot-password">
            Esqueci minha senha
          </button>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>

        <div class="divider">
          <span>ou</span>
        </div>

        <button type="button" @click="handleGoogleLogin" class="btn-google" :disabled="loading">
          <span class="google-icon">G</span>
          Entrar com Google
        </button>

        <div class="signup-link">
          <p>Nao tem uma conta? 
            <router-link to="/registro">Cadastre-se aqui</router-link>
          </p>
        </div>
      </form>

      <!-- Modal de Reset de Senha -->
      <div v-if="showResetPassword" class="modal-overlay" @click="showResetPassword = false">
        <div class="modal-content" @click.stop>
          <h3>Recuperar Senha</h3>
          <p>Digite seu email para receber o link de recuperacao:</p>
          <input
            v-model="resetEmail"
            type="email"
            placeholder="seu@email.com"
            class="reset-input"
          />
          <div class="modal-buttons">
            <button @click="handleResetPassword" class="btn-reset" :disabled="loading">
              Enviar Link
            </button>
            <button @click="showResetPassword = false" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Mensagens de erro/sucesso -->
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'PaginaLogin',
  setup() {
    const router = useRouter()
    const { login, loginWithGoogle, resetPassword, loading, error } = useAuth()

    const form = ref({
      email: '',
      password: ''
    })

    const showPassword = ref(false)
    const rememberMe = ref(false)
    const showResetPassword = ref(false)
    const resetEmail = ref('')
    const successMessage = ref('')

    const handleLogin = async () => {
      if (!form.value.email || !form.value.password) {
        alert('Preencha todos os campos')
        return
      }

      const result = await login(form.value.email, form.value.password)
      
      if (result.success) {
        successMessage.value = 'Login realizado com sucesso!'
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }

    const handleGoogleLogin = async () => {
      const result = await loginWithGoogle()
      
      if (result.success) {
        successMessage.value = 'Login realizado com sucesso!'
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }

    const handleResetPassword = async () => {
      if (!resetEmail.value) {
        alert('Digite seu email')
        return
      }

      const result = await resetPassword(resetEmail.value)
      
      if (result.success) {
        successMessage.value = 'Link de recuperacao enviado para seu email!'
        showResetPassword.value = false
        resetEmail.value = ''
      }
    }

    return {
      form,
      showPassword,
      rememberMe,
      showResetPassword,
      resetEmail,
      successMessage,
      loading,
      error,
      handleLogin,
      handleGoogleLogin,
      handleResetPassword
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.login-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #FFD700;
  font-weight: 600;
  font-size: 1rem;
}

.form-group input {
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-group input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 255, 255, 0.15);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.forgot-password {
  background: none;
  border: none;
  color: #FFD700;
  cursor: pointer;
  text-decoration: underline;
}

.btn-login {
  background: linear-gradient(135deg, #8C52FF, #a071ff);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  background: linear-gradient(135deg, #7a47e6, #8f5fff);
  transform: translateY(-2px);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider span {
  background: rgba(140, 82, 255, 0.8);
  padding: 0 1rem;
  position: relative;
}

.btn-google {
  background: white;
  color: #333;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-google:hover:not(:disabled) {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.google-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.signup-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.signup-link a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  color: #333;
}

.modal-content h3 {
  color: #8C52FF;
  margin-bottom: 1rem;
}

.reset-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #8C52FF;
  border-radius: 8px;
  margin: 1rem 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-reset {
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: #ccc;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.alert {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.alert-error {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.alert-success {
  background: rgba(46, 213, 115, 0.2);
  color: #2ed573;
  border: 1px solid rgba(46, 213, 115, 0.3);
}

@media (max-width: 768px) {
  .login-container {
    padding: 2rem;
    margin: 1rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
