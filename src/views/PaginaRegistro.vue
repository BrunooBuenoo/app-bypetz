<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>Criar Conta</h1>
        <p>Junte-se à comunidade ByPetz</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Seu nome completo"
            required
            :disabled="loading"
          />
        </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              {{ showPassword ? '👁️' : '🙈' }}
            </button>
          </div>
          <div class="password-strength">
            <div class="strength-bar" :class="passwordStrength.class">
              <div class="strength-fill" :style="{ width: passwordStrength.width }"></div>
            </div>
            <span class="strength-text">{{ passwordStrength.text }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            placeholder="Digite a senha novamente"
            required
            :disabled="loading"
          />
          <div v-if="form.confirmPassword && !passwordsMatch" class="password-error">
            As senhas não coincidem
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptTerms" required>
            <span>Aceito os <a href="#" @click.prevent="showTerms = true">Termos de Uso</a> e <a href="#" @click.prevent="showPrivacy = true">Política de Privacidade</a></span>
          </label>
        </div>

        <button type="submit" class="btn-register" :disabled="!canRegister || loading">
          <span v-if="loading">Criando conta...</span>
          <span v-else>Criar Conta</span>
        </button>

        <div class="divider">
          <span>ou</span>
        </div>

        <button type="button" @click="handleGoogleRegister" class="btn-google" :disabled="loading">
          <span class="google-icon">🔍</span>
          Cadastrar com Google
        </button>

        <div class="login-link">
          <p>Já tem uma conta? 
            <router-link to="/login">Faça login aqui</router-link>
          </p>
        </div>
      </form>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'PaginaRegistro',
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

    const passwordsMatch = computed(() => {
      return form.value.password === form.value.confirmPassword
    })

    const passwordStrength = computed(() => {
      const password = form.value.password
      if (!password) return { class: '', width: '0%', text: '' }

      let score = 0
      let feedback = []

      // Critérios de força da senha
      if (password.length >= 8) score += 1
      else feedback.push('8+ caracteres')

      if (/[a-z]/.test(password)) score += 1
      else feedback.push('letra minúscula')

      if (/[A-Z]/.test(password)) score += 1
      else feedback.push('letra maiúscula')

      if (/\d/.test(password)) score += 1
      else feedback.push('número')

      if (/[^a-zA-Z\d]/.test(password)) score += 1
      else feedback.push('símbolo')

      const strength = {
        0: { class: 'weak', width: '20%', text: 'Muito fraca' },
        1: { class: 'weak', width: '20%', text: 'Muito fraca' },
        2: { class: 'fair', width: '40%', text: 'Fraca' },
        3: { class: 'good', width: '60%', text: 'Boa' },
        4: { class: 'strong', width: '80%', text: 'Forte' },
        5: { class: 'very-strong', width: '100%', text: 'Muito forte' }
      }

      return strength[score] || strength[0]
    })

    const canRegister = computed(() => {
      return form.value.name && 
             form.value.email && 
             form.value.password.length >= 6 && 
             passwordsMatch.value && 
             acceptTerms.value
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.register-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.register-form {
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
  font-size: 1.2rem;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-bar.weak .strength-fill { background: #ff4757; }
.strength-bar.fair .strength-fill { background: #ffa502; }
.strength-bar.good .strength-fill { background: #f1c40f; }
.strength-bar.strong .strength-fill { background: #2ed573; }
.strength-bar.very-strong .strength-fill { background: #00b894; }

.strength-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.password-error {
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.checkbox-label a {
  color: #FFD700;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background: linear-gradient(135deg, #7a47e6, #8f5fff);
  transform: translateY(-2px);
}

.btn-register:disabled {
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
}

.login-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.login-link a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
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
  .register-container {
    padding: 2rem;
    margin: 1rem;
  }
  
  .register-header h1 {
    font-size: 1.5rem;
  }
}
</style>
