<template>
  <div class="register-page">
    <!-- Background Elements - Mais sutis -->
    <div class="background-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <div class="register-container">
      <!-- Brand Section - Logo como texto -->
      <div class="brand-section">
        <div class="brand-logo">
          <span class="logo-text">ByPetz</span>
        </div>
        <h1>Junte-se à ByPetz!</h1>
        <p>Crie sua conta e ajude a reunir famílias com seus pets</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <div class="input-container">
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="Seu nome completo"
              required
              :disabled="loading"
              :class="{ 'has-value': form.name }"
            />
            <div class="input-border"></div>
          </div>
        </div>

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
              placeholder="Mínimo 6 caracteres"
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
          
          <!-- Password Strength Indicator -->
          <div v-if="form.password" class="password-strength">
            <div class="strength-bar" :class="passwordStrength.class">
              <div class="strength-fill" :style="{ width: passwordStrength.width }"></div>
            </div>
            <div class="strength-info">
              <span class="strength-text">{{ passwordStrength.text }}</span>
              <div class="strength-requirements">
                <div class="requirement" :class="{ 'met': form.password.length >= 8 }">
                  <span class="requirement-indicator">{{ form.password.length >= 8 ? '✓' : '○' }}</span>
                  8+ caracteres
                </div>
                <div class="requirement" :class="{ 'met': /[A-Z]/.test(form.password) }">
                  <span class="requirement-indicator">{{ /[A-Z]/.test(form.password) ? '✓' : '○' }}</span>
                  Maiúscula
                </div>
                <div class="requirement" :class="{ 'met': /\d/.test(form.password) }">
                  <span class="requirement-indicator">{{ /\d/.test(form.password) ? '✓' : '○' }}</span>
                  Número
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <div class="input-container">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              placeholder="Digite a senha novamente"
              required
              :disabled="loading"
              :class="{ 
                'has-value': form.confirmPassword,
                'error': form.confirmPassword && !passwordsMatch
              }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
            >
              {{ showConfirmPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
            <div class="input-border"></div>
          </div>
          
          <transition name="error">
            <div v-if="form.confirmPassword && !passwordsMatch" class="password-error">
              As senhas não coincidem
            </div>
          </transition>
        </div>

        <!-- Terms Checkbox -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptTerms" required>
            <span class="checkmark"></span>
            <span class="label-text">
              Aceito os 
              <a href="#" @click.prevent="showTerms = true">Termos de Uso</a> 
              e 
              <a href="#" @click.prevent="showPrivacy = true">Política de Privacidade</a>
            </span>
          </label>
        </div>

        <!-- Register Button -->
        <button type="submit" class="btn-register" :disabled="!canRegister || loading">
          <div class="btn-content">
            <div v-if="loading" class="loading-spinner"></div>
            <span>{{ loading ? 'Criando conta...' : 'Criar Conta' }}</span>
          </div>
          <div class="btn-bg"></div>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>ou cadastre-se com</span>
        </div>

        <!-- Google Register -->
        <button type="button" @click="handleGoogleRegister" class="btn-google" :disabled="loading">
          <span>Cadastrar com Google</span>
          <div class="btn-shine"></div>
        </button>

        <!-- Login Link -->
        <div class="login-link">
          <p>
            Já tem uma conta? 
            <router-link to="/login">
              <strong>Faça login aqui</strong>
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

    <!-- Progress Indicator - Simplificado -->
    <div class="progress-indicator">
      <div class="progress-step" :class="{ 'active': form.name }">
        <span>1</span>
      </div>
      <div class="progress-step" :class="{ 'active': form.email }">
        <span>2</span>
      </div>
      <div class="progress-step" :class="{ 'active': form.password && passwordStrength.score >= 3 }">
        <span>3</span>
      </div>
      <div class="progress-step" :class="{ 'active': passwordsMatch && form.confirmPassword }">
        <span>4</span>
      </div>
      <div class="progress-step" :class="{ 'active': acceptTerms }">
        <span>5</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Registro',
  setup() {
    const router = useRouter()
    const { register, loginWithGoogle, loading, error } = useAuth()

    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const acceptTerms = ref(false)
    const successMessage = ref('')
    const showTerms = ref(false)
    const showPrivacy = ref(false)

    const passwordsMatch = computed(() => {
      return form.value.password === form.value.confirmPassword
    })

    const passwordStrength = computed(() => {
      const password = form.value.password
      if (!password) return { class: '', width: '0%', text: '', score: 0 }

      let score = 0

      // Critérios de força da senha
      if (password.length >= 8) score += 1
      if (/[a-z]/.test(password)) score += 1
      if (/[A-Z]/.test(password)) score += 1
      if (/\d/.test(password)) score += 1
      if (/[^a-zA-Z\d]/.test(password)) score += 1

      const strength = {
        0: { class: 'very-weak', width: '10%', text: 'Muito fraca', score: 0 },
        1: { class: 'weak', width: '25%', text: 'Fraca', score: 1 },
        2: { class: 'fair', width: '50%', text: 'Regular', score: 2 },
        3: { class: 'good', width: '75%', text: 'Boa', score: 3 },
        4: { class: 'strong', width: '90%', text: 'Forte', score: 4 },
        5: { class: 'very-strong', width: '100%', text: 'Muito forte', score: 5 }
      }

      return strength[score] || strength[0]
    })

    const canRegister = computed(() => {
      return form.value.name && 
             form.value.email && 
             form.value.password.length >= 6 && 
             passwordsMatch.value && 
             acceptTerms.value &&
             passwordStrength.value.score >= 2
    })

    const handleRegister = async () => {
      if (!canRegister.value) return

      const result = await register(
        form.value.email, 
        form.value.password, 
        form.value.name
      )
      
      if (result.success) {
        successMessage.value = 'Conta criada com sucesso! Redirecionando...'
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    }

    const handleGoogleRegister = async () => {
      const result = await loginWithGoogle()
      
      if (result.success) {
        successMessage.value = 'Conta criada com sucesso!'
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }

    return {
      form,
      showPassword,
      showConfirmPassword,
      acceptTerms,
      successMessage,
      showTerms,
      showPrivacy,
      loading,
      error,
      passwordsMatch,
      passwordStrength,
      canRegister,
      handleRegister,
      handleGoogleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
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
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  left: 15%;
  animation-delay: 4s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  top: 30%;
  right: 30%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Main Container */
.register-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
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
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.input-container input.error {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
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

/* Password Strength */
.password-strength {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strength-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.4s ease;
  border-radius: 3px;
}

.strength-bar.very-weak .strength-fill { background: #DC2626; }
.strength-bar.weak .strength-fill { background: #EF4444; }
.strength-bar.fair .strength-fill { background: #F59E0B; }
.strength-bar.good .strength-fill { background: #10B981; }
.strength-bar.strong .strength-fill { background: #059669; }
.strength-bar.very-strong .strength-fill { background: #047857; }

.strength-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.strength-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.strength-requirements {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.requirement.met {
  color: #10B981;
}

.requirement-indicator {
  font-size: 0.7rem;
  font-weight: bold;
  width: 12px;
  text-align: center;
}

/* Password Error */
.password-error {
  color: #FCA5A5;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-enter-active, .error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from, .error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  margin-top: 2px;
  position: relative;
}

.checkbox-label input:checked + .checkmark {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: #FFD700;
  transform: scale(1.1);
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8B5CF6;
  font-size: 0.8rem;
  font-weight: bold;
}

.label-text a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.label-text a:hover {
  color: #FFA500;
  text-decoration: underline;
}

/* Register Button */
.btn-register {
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
  margin-top: 1rem;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
}

.btn-register:disabled {
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

.btn-register:hover .btn-bg {
  left: 100%;
}

/* Divider */
.divider {
  text-align: center;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 1.5rem 0;
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

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.login-link a {
  color: #FFD700;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.login-link a:hover {
  color: #FFA500;
  background: rgba(255, 215, 0, 0.1);
}

/* Progress Indicator - Simplificado */
.progress-indicator {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
}

.progress-step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
}

.progress-step span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  transition: all 0.4s ease;
}

.progress-step.active {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: #FFD700;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

.progress-step.active span {
  color: #8B5CF6;
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

/* Responsive Design */
@media (max-width: 768px) {
  .register-page {
    padding: 1rem;
    padding-top: 90px;
  }
  
  .register-container {
    padding: 2rem;
  }
  
  .brand-section h1 {
    font-size: 1.8rem;
  }
  
  .brand-section p {
    font-size: 0.9rem;
  }
  
  .progress-indicator {
    display: none;
  }
  
  .strength-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .strength-requirements {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1.5rem;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .brand-section h1 {
    font-size: 1.5rem;
  }
  
  .checkbox-label {
    font-size: 0.85rem;
  }
  
  .strength-requirements {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>