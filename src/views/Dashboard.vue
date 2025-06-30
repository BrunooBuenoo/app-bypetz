<template>
  <div class="dashboard-page">
    <!-- Verificação de acesso -->
    <div v-if="!hasAccess" class="access-denied">
      <div class="access-denied-icon">
        <span class="lock-icon">🔒</span>
      </div>
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta área.</p>
      <router-link to="/" class="btn-home">
        Voltar ao Início
      </router-link>
    </div>

    <!-- Dashboard Admin -->
    <div v-else class="dashboard-container">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <h1>Admin ByPetz</h1>
        <div class="mobile-nav">
          <button
            @click="activeSection = 'pedidos'"
            class="mobile-nav-item"
            :class="{ active: activeSection === 'pedidos' }"
          >
            <span class="nav-icon">📦</span>
            <span>Pedidos</span>
          </button>
          
          <button
            @click="activeSection = 'produtos'"
            class="mobile-nav-item"
            :class="{ active: activeSection === 'produtos' }"
          >
            <span class="nav-icon">🎁</span>
            <span>Produtos</span>
          </button>
          
          <button
            @click="activeSection = 'categorias'"
            class="mobile-nav-item"
            :class="{ active: activeSection === 'categorias' }"
          >
            <span class="nav-icon">🏷️</span>
            <span>Categorias</span>
          </button>

          <button
            @click="activeSection = 'patrocinadores'"
            class="mobile-nav-item"
            :class="{ active: activeSection === 'patrocinadores' }"
          >
            <span class="nav-icon">🤝</span>
            <span>Parceiros</span>
          </button>
        </div>
      </div>

      <!-- Desktop Sidebar -->
      <aside class="desktop-sidebar">
        <div class="sidebar-header">
          <h2>
            <span class="logo-text">ByPetz</span>
            <span class="admin-text">Admin</span>
          </h2>
        </div>
        
        <nav class="sidebar-nav">
          <button
            @click="activeSection = 'pedidos'"
            class="nav-item"
            :class="{ active: activeSection === 'pedidos' }"
          >
            <span class="nav-icon">📦</span>
            <span>Pedidos</span>
          </button>
          
          <button
            @click="activeSection = 'produtos'"
            class="nav-item"
            :class="{ active: activeSection === 'produtos' }"
          >
            <span class="nav-icon">🎁</span>
            <span>Produtos</span>
          </button>
          
          <button
            @click="activeSection = 'categorias'"
            class="nav-item"
            :class="{ active: activeSection === 'categorias' }"
          >
            <span class="nav-icon">🏷️</span>
            <span>Categorias</span>
          </button>

          <button
            @click="activeSection = 'patrocinadores'"
            class="nav-item"
            :class="{ active: activeSection === 'patrocinadores' }"
          >
            <span class="nav-icon">🤝</span>
            <span>Patrocinadores</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-header">
          <h1>{{ getSectionTitle() }}</h1>
          <div class="user-info">
            <span>Bem-vindo, {{ user?.displayName || user?.email }}</span>
          </div>
        </div>

        <!-- Seções -->
        <div class="content-body">
          <PedidosAdmin v-if="activeSection === 'pedidos'" />
          <CadastroProduto v-else-if="activeSection === 'produtos'" />
          <CadastroCategoria v-else-if="activeSection === 'categorias'" />
          <CadastroPatrocinador v-else-if="activeSection === 'patrocinadores'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import PedidosAdmin from '../components/PedidosAdmin.vue'
import CadastroProduto from '../components/CadastroProduto.vue'
import CadastroCategoria from '../components/CadastroCategoria.vue'
import CadastroPatrocinador from '../components/CadastroPatrocinador.vue'

export default {
  name: 'DashboardView',
  components: {
    PedidosAdmin,
    CadastroProduto,
    CadastroCategoria,
    CadastroPatrocinador
  },
  setup() {
    const { user } = useAuth()
    const activeSection = ref('pedidos')

    const hasAccess = computed(() => {
      return user.value?.email === 'bruno.buens@gmail.com'
    })

    const getSectionTitle = () => {
      const titles = {
        pedidos: 'Gerenciar Pedidos',
        produtos: 'Gerenciar Produtos',
        categorias: 'Gerenciar Categorias',
        patrocinadores: 'Gerenciar Patrocinadores'
      }
      return titles[activeSection.value] || 'Dashboard'
    }

    return {
      user,
      activeSection,
      hasAccess,
      getSectionTitle
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-top: 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.access-denied-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.lock-icon {
  font-size: 4rem;
  filter: grayscale(100%);
}

.access-denied h2 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.access-denied p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.btn-home {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-home:hover {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.3);
}

.dashboard-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.mobile-header {
  display: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem;
  border-bottom: 1px solid rgba(147, 51, 234, 0.1);
  box-shadow: 0 2px 20px rgba(147, 51, 234, 0.1);
}

.mobile-header h1 {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
}

.mobile-nav {
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
}

.mobile-nav-item {
  background: none;
  border: none;
  padding: 0.75rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  border-radius: 12px;
  flex: 1;
  min-width: 0;
}

.mobile-nav-item .nav-icon {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.mobile-nav-item span:last-child {
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-nav-item:hover {
  background: rgba(147, 51, 234, 0.05);
  color: #9333ea;
}

.mobile-nav-item:hover .nav-icon {
  filter: grayscale(0%);
}

.mobile-nav-item.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(37, 99, 235, 0.05));
  color: #9333ea;
}

.mobile-nav-item.active .nav-icon {
  filter: grayscale(0%);
}

.desktop-sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(147, 51, 234, 0.1);
  box-shadow: 4px 0 20px rgba(147, 51, 234, 0.1);
}

.sidebar-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(147, 51, 234, 0.1);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.logo-text {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.admin-text {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem 2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  border-radius: 0;
}

.nav-item .nav-icon {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.nav-item:hover {
  background: rgba(147, 51, 234, 0.05);
  color: #9333ea;
}

.nav-item:hover .nav-icon {
  filter: grayscale(0%);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(37, 99, 235, 0.05));
  color: #9333ea;
  border-right: 3px solid #9333ea;
}

.nav-item.active .nav-icon {
  filter: grayscale(0%);
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(147, 51, 234, 0.1);
}

.content-header h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
}

.user-info {
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(147, 51, 234, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(147, 51, 234, 0.1);
}

.content-body {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
  border: 1px solid rgba(147, 51, 234, 0.1);
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  
  .desktop-sidebar {
    display: none;
  }
  
  .mobile-header {
    display: block;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .content-header h1 {
    font-size: 1.5rem;
  }
  
  .content-body {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .mobile-header {
    padding: 0.75rem;
  }
  
  .mobile-header h1 {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
  }
  
  .mobile-nav {
    gap: 0.25rem;
  }
  
  .mobile-nav-item {
    padding: 0.5rem 0.25rem;
    font-size: 0.7rem;
  }
  
  .mobile-nav-item .nav-icon {
    font-size: 1rem;
  }
  
  .mobile-nav-item span:last-child {
    font-size: 0.65rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .content-header h1 {
    font-size: 1.3rem;
  }
  
  .content-body {
    padding: 0.75rem;
  }
}

@media (max-width: 360px) {
  .mobile-nav-item span:last-child {
    display: none;
  }
  
  .mobile-nav-item {
    padding: 0.75rem 0.25rem;
  }
}
</style>