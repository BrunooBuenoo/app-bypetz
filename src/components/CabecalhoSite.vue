<template>
  <div>
    <header class="header">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/" class="logo-link">
            <span class="logo-text">ByPetz</span>
          </router-link>
        </div>

        <!-- Menu Desktop -->
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link">Início</router-link>
          <router-link to="/feed" class="nav-link">Feed</router-link>
          <router-link to="/cadastrar-pet" class="nav-link" v-if="isAuthenticated">Cadastrar Pet</router-link>
          <router-link to="/pagina-apoiadores" class="nav-link">Apoiar Causa</router-link>
          <router-link to="/sobre" class="nav-link">Sobre</router-link>
          <router-link to="/contato" class="nav-link">Contato</router-link>
        </nav>

        <!-- Área do usuário -->
        <div class="user-area">
          <!-- Usuário não logado -->
          <div v-if="!isAuthenticated && !loading" class="auth-buttons">
            <router-link to="/login" class="btn-login">Entrar</router-link>
            <router-link to="/registro" class="btn-register">Cadastrar</router-link>
          </div>

          <!-- Usuário logado -->
          <div v-if="isAuthenticated" class="user-menu" ref="userMenuRef">
            <div class="user-info" @click="toggleUserMenu">
              <div class="user-avatar">
                <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" class="avatar-image" />
                <span v-else class="avatar-placeholder">{{ userInitials }}</span>
              </div>
              <div class="user-details">
                <span class="user-name">{{ userDisplayName }}</span>
                <span class="user-status">Online</span>
              </div>
              <div class="dropdown-arrow" :class="{ open: showUserMenu }"></div>
            </div>

            <!-- Dropdown do usuário -->
            <transition name="dropdown">
              <div v-if="showUserMenu" class="user-dropdown" @click.stop>
                <div class="dropdown-header">
                  <div class="dropdown-avatar">
                    <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" class="dropdown-avatar-image" />
                    <span v-else class="dropdown-avatar-placeholder">{{ userInitials }}</span>
                  </div>
                  <div class="dropdown-user-info">
                    <span class="dropdown-name">{{ userDisplayName }}</span>
                    <span class="dropdown-email">{{ user?.email }}</span>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <router-link to="/perfil" class="dropdown-item" @click="showUserMenu = false">
                  <span>Meu Perfil</span>
                </router-link>

                <router-link to="/cadastrar-pet" class="dropdown-item" @click="showUserMenu = false">
                  <span>Cadastrar Pet</span>
                </router-link>

                <!-- Botão visível só para admins -->
                <router-link 
                  v-if="isAdmin"
                  to="/dashboard" 
                  class="dropdown-item admin-item" 
                  @click="showUserMenu = false"
                >
                  <span>Dashboard Admin</span>
                </router-link>

                <div class="dropdown-item" @click="showUserMenu = false">
                  <span>Configurações</span>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <button @click="handleLogout" class="dropdown-item logout-btn">
                  <span>Sair</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="loading-spinner">
            <div class="spinner"></div>
          </div>
        </div>

        <!-- Menu Mobile -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <div class="hamburger" :class="{ open: showMobileMenu }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <!-- Menu Mobile Expandido - NOVO DESIGN CLEAN -->
      <transition name="mobile-menu">
        <div v-if="showMobileMenu" class="mobile-menu">
          <!-- Header do Menu Mobile -->
          <div class="mobile-menu-header">
            <h3 class="mobile-menu-title">Menu</h3>
            <button @click="closeMobileMenu" class="mobile-close-btn">
              <span class="close-x"></span>
            </button>
          </div>

          <!-- Links de Navegação -->
          <nav class="mobile-nav">
            <div class="nav-section">
              <div class="nav-links-grid">
                <router-link to="/" class="mobile-nav-card" @click="closeMobileMenu">
                  <div class="nav-card-content">
                    <span class="nav-card-title">Início</span>
                    <span class="nav-card-desc">Página principal</span>
                  </div>
                </router-link>
                
                <router-link to="/feed" class="mobile-nav-card" @click="closeMobileMenu">
                  <div class="nav-card-content">
                    <span class="nav-card-title">Feed</span>
                    <span class="nav-card-desc">Posts dos pets</span>
                  </div>
                </router-link>
                
                
                <router-link 
                  v-if="isAuthenticated" 
                  to="/cadastrar-pet" 
                  class="mobile-nav-card featured" 
                  @click="closeMobileMenu"
                >
                  <div class="nav-card-content">
                    <span class="nav-card-title">Cadastrar Pet</span>
                    <span class="nav-card-desc">Adicione seu pet</span>
                  </div>
                </router-link>
                
                <router-link to="/sobre" class="mobile-nav-card" @click="closeMobileMenu">
                  <div class="nav-card-content">
                    <span class="nav-card-title">Sobre</span>
                    <span class="nav-card-desc">Nossa história</span>
                  </div>
                </router-link>
                
                <router-link to="/contato" class="mobile-nav-card" @click="closeMobileMenu">
                  <div class="nav-card-content">
                    <span class="nav-card-title">Contato</span>
                    <span class="nav-card-desc">Fale conosco</span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Seção do Usuário (se logado) -->
            <div v-if="isAuthenticated" class="nav-section">
              <h4 class="nav-section-title">Minha Conta</h4>
              <div class="user-section">
                <div class="mobile-user-card">
                  <div class="mobile-user-avatar">
                    <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" class="mobile-avatar-image" />
                    <span v-else class="mobile-avatar-placeholder">{{ userInitials }}</span>
                  </div>
                  <div class="mobile-user-details">
                    <span class="mobile-user-name">{{ userDisplayName }}</span>
                    <span class="mobile-user-email">{{ user?.email }}</span>
                  </div>
                </div>
                
                <div class="user-actions">
                  <router-link to="/perfil" class="user-action-btn" @click="closeMobileMenu">
                    Meu Perfil
                  </router-link>
                  
                  <!-- Admin Dashboard - usando role/isAdmin (mais seguro) -->
                  <router-link 
                    v-if="isAdmin" 
                    to="/dashboard" 
                    class="user-action-btn admin-btn" 
                    @click="closeMobileMenu"
                  >
                    Dashboard Admin
                  </router-link>
                  
                  <button @click="handleLogout" class="user-action-btn logout-btn">
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>

            <!-- Seção de Autenticação (se não logado) -->
            <div v-if="!isAuthenticated" class="nav-section">
              <h4 class="nav-section-title">Acesso</h4>
              <div class="auth-section">
                <router-link to="/login" class="auth-card login-card" @click="closeMobileMenu">
                  <div class="auth-card-content">
                    <span class="auth-card-title">Entrar</span>
                    <span class="auth-card-desc">Acesse sua conta</span>
                  </div>
                </router-link>
                
                <router-link to="/registro" class="auth-card register-card" @click="closeMobileMenu">
                  <div class="auth-card-content">
                    <span class="auth-card-title">Cadastrar</span>
                    <span class="auth-card-desc">Crie sua conta</span>
                  </div>
                </router-link>
              </div>
            </div>
          </nav>
        </div>
      </transition>

      <!-- Overlay para fechar menus -->
      <div 
        v-if="showUserMenu || showMobileMenu" 
        class="menu-overlay" 
        @click="closeAllMenus"
      ></div>
    </header>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'ModernNavbar',
  setup() {
    const router = useRouter()
    const { user, isAuthenticated, userDisplayName, isAdmin, loading, logout } = useAuth()

    const showUserMenu = ref(false)
    const showMobileMenu = ref(false)
    const userMenuRef = ref(null)

    const userInitials = computed(() => {
      if (!userDisplayName.value) return '?'
      return userDisplayName.value
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    })

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showMobileMenu.value = false
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
      showUserMenu.value = false
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    const closeAllMenus = () => {
      showUserMenu.value = false
      showMobileMenu.value = false
    }

    const handleLogout = async () => {
      const result = await logout()
      if (result.success) {
        closeAllMenus()
        router.push('/')
      }
    }

    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      user,
      isAuthenticated,
      userDisplayName,
      isAdmin,
      userInitials,
      loading,
      showUserMenu,
      showMobileMenu,
      userMenuRef,
      toggleUserMenu,
      toggleMobileMenu,
      closeMobileMenu,
      closeAllMenus,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Estilos anteriores mantidos... */
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: white;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}


.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
}

.logo-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 1024px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  position: relative;
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #f9fafb;
  color: #9333ea;
}

.nav-link.active {
  color: #9333ea;
}

.user-area {
  display: none;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .user-area {
    display: flex;
  }
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-login {
  color: #374151;
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-login:hover {
  color: #9333ea;
  background-color: #ede9fe;
}

.btn-register {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-register:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f9fafb;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.user-avatar::before {
  content: '';
  position: absolute;
  inset: -3px;
  padding: 3px;
  background: linear-gradient(45deg, #9333ea, #2563eb, #9333ea);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.avatar-image, .dropdown-avatar-image, .mobile-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-details {
  display: none;
  flex-direction: column;
  gap: 0.125rem;
}

@media (min-width: 1280px) {
  .user-details {
    display: flex;
  }
}

.user-name {
  color: #111827;
  font-weight: 500;
  font-size: 0.875rem;
  max-width: 7.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 500;
}

.dropdown-arrow {
  width: 0.5rem;
  height: 0.5rem;
  border-right: 2px solid #9ca3af;
  border-bottom: 2px solid #9ca3af;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(225deg);
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  min-width: 18rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(229, 231, 235, 0.5);
  z-index: 9999;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dropdown-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.dropdown-avatar::before {
  content: '';
  position: absolute;
  inset: -3px;
  padding: 3px;
  background: linear-gradient(45deg, #9333ea, #2563eb, #9333ea);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-name {
  color: #111827;
  font-weight: 600;
  font-size: 1.125rem;
}

.dropdown-email {
  color: #6b7280;
  font-size: 0.875rem;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent);
  margin: 1rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: rgba(147, 51, 234, 0.1);
  color: #9333ea;
  transform: translateX(0.25rem);
}

.admin-item {
  background: rgba(159, 11, 245, 0.1);
  border: 1px solid rgba(112, 11, 245, 0.2);
  color: #6d05f5;
  font-weight: 600;
}

.admin-item:hover {
  color: white;
  background: rgba(159, 11, 245, 0.9);
  border-color: solid rgba(112, 11, 245, 0.3);
}

.logout-btn {
  color: #dc2626 !important;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.1) !important;
  color: #dc2626 !important;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-top: 2px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mobile-menu-btn {
  display: block;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

.mobile-menu-btn:hover {
  background-color: #f3f4f6;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 1.5rem;
  height: 1.25rem;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 0.125rem;
  background: #6b7280;
  border-radius: 0.125rem;
  transition: all 0.3s ease;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(0.375rem, 0.375rem);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(0.375rem, -0.375rem);
}

/* NOVO DESIGN DO MENU MOBILE - CLEAN E MODERNO */
.mobile-menu {
  background: white;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  position: relative;
  z-index: 1000;
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
}

@media (min-width: 1024px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.3);
}

.mobile-menu-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.mobile-close-btn {
  background: rgba(147, 51, 234, 0.1);
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: rgba(147, 51, 234, 0.2);
  transform: scale(1.1);
}

.close-x {
  width: 1rem;
  height: 1rem;
  position: relative;
}

.close-x::before,
.close-x::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #9333ea;
  border-radius: 1px;
}

.close-x::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-x::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.mobile-nav {
  padding: 1.5rem;
  margin-bottom: 8rem;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
  padding-left: 0.5rem;
}

.nav-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.mobile-nav-card {
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}

.mobile-nav-card:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-nav-card.featured {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
  border-color: rgba(147, 51, 234, 0.3);
}

.mobile-nav-card.featured:hover {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15));
  border-color: rgba(147, 51, 234, 0.4);
}

.nav-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-card-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.nav-card-desc {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.3;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(147, 51, 234, 0.1);
  border-radius: 1rem;
}

.mobile-user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
  flex-shrink: 0;
}

.mobile-user-avatar::before {
  content: '';
  position: absolute;
  inset: -3px;
  padding: 3px;
  background: linear-gradient(45deg, #9333ea, #2563eb, #9333ea);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.mobile-user-name {
  color: #111827;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-user-email {
  color: #6b7280;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-action-btn {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  text-align: center;
  cursor: pointer;
}

.user-action-btn:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  color: #9333ea;
}

.user-action-btn.admin-btn {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #d97706;
}

.user-action-btn.admin-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
}

.user-action-btn.logout-btn {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
  color: #dc2626;
}

.user-action-btn.logout-btn:hover {
  background: rgba(220, 38, 38, 0.15);
  border-color: rgba(220, 38, 38, 0.4);
}

.auth-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.auth-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}

.auth-card.login-card:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
}

.auth-card.register-card {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
  border-color: rgba(147, 51, 234, 0.3);
}

.auth-card.register-card:hover {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15));
  border-color: rgba(147, 51, 234, 0.4);
  transform: translateY(-2px);
}

.auth-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.auth-card-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.auth-card-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 40;
}

@media (min-width: 1024px) {
  .menu-overlay {
    display: none;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem) scale(0.95);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-1.25rem);
}

/* Responsividade para telas muito pequenas */
@media (max-width: 480px) {
  .nav-links-grid,
  .auth-section {
    grid-template-columns: 1fr;
  }
  
  .mobile-nav-card,
  .auth-card {
    padding: 0.875rem;
  }
  
  .mobile-user-card {
    padding: 0.875rem;
  }
  
  .mobile-user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.875rem;
  }
}
</style>