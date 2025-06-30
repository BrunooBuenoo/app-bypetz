<template>
  <div class="login-page">
    <!-- Background Elements - Mais sutis -->
    <div class="background-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <div class="login-container">
      <!-- Brand Section - Sem ícone, mais clean -->
      <div class="brand-section">
        <div class="brand-logo">
          <span class="logo-text">ByPetz</span>
        </div>
        <h1>Bem-vindo de volta!</h1>
        <p>Entre na sua conta e continue ajudando pets</p>
      </div>

      <!-- Login Form - Inputs mais limpos -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container">
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
              :class="{ 'has-value': form.email }"
            />
            <div class="input-border"></div>
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Senha</label>
          <div class="input-container password-container">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Sua senha"
              required
              :disabled="loading"
              :class="{ 'has-value': form.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
            <div class="input-border"></div>
          </div>
        </div>

        <!-- Form Options -->
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            <span class="label-text">Lembrar de mim</span>
          </label>
          <button type="button" @click="showResetPassword = true" class="forgot-password">
            Esqueci minha senha
          </button>
        </div>

        <!-- Login Button -->
        <button type="submit" class="btn-login" :disabled="loading || !canLogin">
          <div class="btn-content">
            <div v-if="loading" class="loading-spinner"></div>
            <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
          </div>
          <div class="btn-bg"></div>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>ou continue com</span>
        </div>

        <!-- Google Login -->
        <button type="button" @click="handleGoogleLogin" class="btn-google" :disabled="loading">
          <span>Entrar com Google</span>
          <div class="btn-shine"></div>
        </button>

        <!-- Signup Link -->
        <div class="signup-link">
          <p>
            Não tem uma conta? 
            <router-link to="/registro">
              <strong>Cadastre-se aqui</strong>
            </router-link>
          </p>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <transition name="alert">
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
      </transition>
      
      <transition name="alert">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
      </transition>
    </div>

    <!-- Reset Password Modal -->
    <transition name="modal">
      <div v-if="showResetPassword" class="modal-overlay" @click="showResetPassword = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Recuperar Senha</h3>
            <button @click="showResetPassword = false" class="modal-close">
              ×
            </button>
          </div>
          
          <div class="modal-body">
            <p>Digite seu email para receber o link de recuperação:</p>
            <div class="input-container">
              <input
                v-model="resetEmail"
                type="email"
                placeholder="seu@email.com"
                class="reset-input"
                :class="{ 'has-value': resetEmail }"
              />
              <div class="input-border"></div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="handleResetPassword" class="btn-reset" :disabled="loading || !resetEmail">
              {{ loading ? 'Enviando...' : 'Enviar Link' }}
            </button>
            <button @click="showResetPassword = false" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'LoginClean',
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

    const canLogin = computed(() => {
      return form.value.email && form.value.password
    })

    const handleLogin = async () => {
      if (!canLogin.value) return

      const result = await login(form.value.email, form.value.password)
      
      if (result.success) {
        successMessage.value = 'Login realizado com sucesso!'
        setTimeout(() => {
          router.push('/')
        }, 1500)
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
      if (!resetEmail.value) return

      const result = await resetPassword(resetEmail.value)
      
      if (result.success) {
        successMessage.value = 'Link de recuperação enviado para seu email!'
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
      canLogin,
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
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 90px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background Elements - Mais sutis */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Main Container */
.login-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

/* Brand Section - Mais clean */
.brand-section {
  text-align: center;
  margin-bottom: 3rem;
}

.brand-logo {
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.brand-section h1 {
  color: white;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand-section p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.input-container {
  position: relative;
}

.input-container input {
  width: 100%;
  padding: 1.25rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
}

.input-container input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-container input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

.input-container input.has-value {
  border-color: rgba(255, 215, 0, 0.6);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  transform: scaleX(0);
  transition: transform 0.4s ease;
  border-radius: 0 0 16px 16px;
}

.input-container input:focus + .input-border {
  transform: scaleX(1);
}

/* Password Field */
.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 2;
  font-size: 0.8rem;
  font-weight: 500;
}

.password-toggle:hover {
  color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -0.5rem 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.remember-me:hover {
  color: white;
}

.remember-me input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.remember-me input:checked + .checkmark {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: #FFD700;
  transform: scale(1.1);
}

.remember-me input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8B5CF6;
  font-size: 0.8rem;
  font-weight: bold;
}

.forgot-password {
  background: none;
  border: none;
  color: #FFD700;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.forgot-password:hover {
  color: #FFA500;
  background: rgba(255, 215, 0, 0.1);
}

/* Login Button */
.btn-login {
  position: relative;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 1.25rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-login:hover .btn-bg {
  left: 100%;
}

/* Divider */
.divider {
  text-align: center;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 1rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.divider span {
  background: rgba(102, 126, 234, 0.8);
  padding: 0 1.5rem;
  position: relative;
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

/* Google Button */
.btn-google {
  position: relative;
  background: white;
  color: #333;
  border: none;
  padding: 1.25rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.btn-google:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.btn-google:hover .btn-shine {
  left: 100%;
}

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: 1rem;
}

.signup-link p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.signup-link a {
  color: #FFD700;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.signup-link a:hover {
  color: #FFA500;
  background: rgba(255, 215, 0, 0.1);
}

/* Alerts */
.alert {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.alert-error {
  background: rgba(239, 68, 68, 0.2);
  color: #FCA5A5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.alert-success {
  background: rgba(34, 197, 94, 0.2);
  color: #86EFAC;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* Alert Transitions */
.alert-enter-active, .alert-leave-active {
  transition: all 0.4s ease;
}

.alert-enter-from, .alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal Styles */
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
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  color: #333;
  font-size: 1.4rem;
  font-weight: 700;
}

.modal-close {
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  color: #666;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.modal-body {
  padding: 0 2rem 1rem;
}

.modal-body p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.reset-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.reset-input:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.reset-input.has-value {
  border-color: #8B5CF6;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-reset {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.btn-reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #F3F4F6;
  color: #6B7280;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #E5E7EB;
  color: #374151;
}

/* Modal Transitions */
.modal-enter-active, .modal-leave-active {
  transition: all 0.4s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.8) translateY(-50px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
    padding-top: 90px;
  }
  
  .login-container {
    padding: 2rem;
  }
  
  .brand-section h1 {
    font-size: 1.8rem;
  }
  
  .brand-section p {
    font-size: 0.9rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .modal-content {
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .brand-section h1 {
    font-size: 1.5rem;
  }
}
</style>