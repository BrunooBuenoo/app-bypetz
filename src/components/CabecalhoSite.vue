<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <div class="logo-icon">
            <span class="logo-symbol">BP</span>
          </div>
          <span class="logo-text">ByPetz</span>
        </router-link>
      </div>

      <!-- Menu Desktop -->
      <nav class="desktop-nav">
        <router-link to="/" class="nav-link">Inicio</router-link>
        <router-link to="/feed" class="nav-link">Feed</router-link>
        <router-link to="/cadastrar-pet" class="nav-link" v-if="isAuthenticated">Cadastrar Pet</router-link>
        <router-link to="/sobre" class="nav-link">Sobre</router-link>
        <router-link to="/contato" class="nav-link">Contato</router-link>
      </nav>

      <!-- Area do usuario -->
      <div class="user-area">
        <!-- Usuario nao logado -->
        <div v-if="!isAuthenticated && !loading" class="auth-buttons">
          <router-link to="/login" class="btn-login">Entrar</router-link>
          <router-link to="/registro" class="btn-register">Cadastrar</router-link>
        </div>

        <!-- Usuario logado -->
        <div v-if="isAuthenticated" class="user-menu" ref="userMenuRef">
          <div class="user-info" @click="toggleUserMenu">
            <div class="user-avatar">
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" />
              <span v-else class="avatar-placeholder">{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userDisplayName }}</span>
              <span class="user-status">Online</span>
            </div>
            <span class="dropdown-arrow" :class="{ open: showUserMenu }">▼</span>
          </div>

          <!-- Dropdown do usuario -->
          <transition name="dropdown">
            <div v-if="showUserMenu" class="user-dropdown" @click.stop>
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" />
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
              
              <router-link to="/meus-pets" class="dropdown-item" @click="showUserMenu = false">
                <span>Meus Pets</span>
              </router-link>
              
              <div class="dropdown-item" @click="showUserMenu = false">
                <span>Configuracoes</span>
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

    <!-- Menu Mobile Expandido -->
    <transition name="mobile-menu">
      <div v-if="showMobileMenu" class="mobile-menu">
        <nav class="mobile-nav">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
            <span>Inicio</span>
          </router-link>
          
          <router-link to="/feed" class="mobile-nav-link" @click="closeMobileMenu">
            <span>Feed</span>
          </router-link>
          
          <router-link 
            v-if="isAuthenticated" 
            to="/cadastrar-pet" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
          >
            <span>Cadastrar Pet</span>
          </router-link>
          
          <router-link to="/sobre" class="mobile-nav-link" @click="closeMobileMenu">
            <span>Sobre</span>
          </router-link>
          
          <router-link to="/contato" class="mobile-nav-link" @click="closeMobileMenu">
            <span>Contato</span>
          </router-link>
          
          <router-link 
            v-if="isAuthenticated" 
            to="/perfil" 
            class="mobile-nav-link" 
            @click="closeMobileMenu"
          >
            <span>Meu Perfil</span>
          </router-link>
        </nav>

        <div class="mobile-auth">
          <div v-if="!isAuthenticated" class="mobile-auth-buttons">
            <router-link to="/login" class="mobile-btn-login" @click="closeMobileMenu">
              Entrar
            </router-link>
            <router-link to="/registro" class="mobile-btn-register" @click="closeMobileMenu">
              Cadastrar
            </router-link>
          </div>
          
          <div v-if="isAuthenticated" class="mobile-user-info">
            <div class="mobile-user-card">
              <div class="mobile-user-avatar">
                <img v-if="user?.photoURL" :src="user.photoURL" :alt="userDisplayName" />
                <span v-else class="mobile-avatar-placeholder">{{ userInitials }}</span>
              </div>
              <div class="mobile-user-details">
                <span class="mobile-user-name">{{ userDisplayName }}</span>
                <span class="mobile-user-email">{{ user?.email }}</span>
              </div>
            </div>
            <button @click="handleLogout" class="mobile-logout-btn">
              Sair
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay para fechar menus -->
    <div 
      v-if="showUserMenu || showMobileMenu" 
      class="menu-overlay" 
      @click="closeAllMenus"
    ></div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'CabecalhoSite',
  setup() {
    const router = useRouter()
    const { user, isAuthenticated, userDisplayName, loading, logout } = useAuth()

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
.header {
  background: linear-gradient(135deg, #8C52FF 0%, #a071ff 50%, #b794ff 100%);
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
}

.logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #FFD700;
  font-size: 1.8rem;
  font-weight: 800;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  background: rgba(255, 215, 0, 0.2);
  padding: 0.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  max-width: 600px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-link.router-link-active {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-register {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #FFD700;
  color: #8C52FF;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.btn-register:hover {
  background: #FFA500;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD700;
  color: #8C52FF;
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  color: #90EE90;
  font-size: 0.75rem;
  font-weight: 500;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  min-width: 280px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 999; /* Maior que o overlay */
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dropdown-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD700;
  color: #8C52FF;
  font-weight: bold;
  font-size: 1.2rem;
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-name {
  color: #333;
  font-weight: 700;
  font-size: 1.1rem;
}

.dropdown-email {
  color: #666;
  font-size: 0.85rem;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.75rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  transform: translateX(5px);
}

.logout-btn {
  color: #ff4757 !important;
}

.logout-btn:hover {
  background: rgba(255, 71, 87, 0.1) !important;
  color: #ff4757 !important;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  height: 18px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-menu {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1.5rem;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #333;
  text-decoration: none;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  transform: translateX(5px);
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-btn-login,
.mobile-btn-register {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.mobile-btn-login {
  color: #8C52FF;
  border: 2px solid #8C52FF;
  background: transparent;
}

.mobile-btn-login:hover {
  background: rgba(140, 82, 255, 0.1);
}

.mobile-btn-register {
  background: #8C52FF;
  color: white;
}

.mobile-btn-register:hover {
  background: #7a47e6;
}

.mobile-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(140, 82, 255, 0.1);
  border-radius: 16px;
  margin-bottom: 1rem;
}

.mobile-user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD700;
  color: #8C52FF;
  font-weight: bold;
  font-size: 1.3rem;
}

.mobile-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-user-name {
  color: #333;
  font-weight: 700;
  font-size: 1.1rem;
}

.mobile-user-email {
  color: #666;
  font-size: 0.9rem;
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ff4757;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.mobile-logout-btn:hover {
  background: #ff3742;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998; /* Menor que o dropdown */
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 1024px) {
  .desktop-nav {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .user-details {
    display: none;
  }
}

@media (max-width: 768px) {
  .desktop-nav,
  .auth-buttons,
  .user-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-container {
    padding: 1rem;
  }
  
  .logo-link {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.75rem;
  }
  
  .logo-link {
    font-size: 1.3rem;
  }
  
  .logo-text {
    display: none;
  }
}

.logo-symbol {
  font-weight: 900;
  font-size: 1.2rem;
  color: #8C52FF;
}
</style>
