<template>
  <div class="dashboard-page">
    <!-- Verificação de acesso -->
    <div v-if="!hasAccess" class="access-denied">
      <div class="access-denied-icon">
        <i class="fas fa-lock"></i>
      </div>
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta área.</p>
      <router-link to="/" class="btn-home">
        <i class="fas fa-home"></i>
        Voltar ao Início
      </router-link>
    </div>

    <!-- Dashboard Admin -->
    <div v-else class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>
            <i class="fas fa-cog"></i>
            Admin ByPetz
          </h2>
        </div>
        
        <nav class="sidebar-nav">
          <button
            @click="activeSection = 'pedidos'"
            class="nav-item"
            :class="{ active: activeSection === 'pedidos' }"
          >
            <i class="fas fa-shopping-bag"></i>
            <span>Pedidos</span>
          </button>
          
          <button
            @click="activeSection = 'produtos'"
            class="nav-item"
            :class="{ active: activeSection === 'produtos' }"
          >
            <i class="fas fa-box"></i>
            <span>Produtos</span>
          </button>
          
          <button
            @click="activeSection = 'categorias'"
            class="nav-item"
            :class="{ active: activeSection === 'categorias' }"
          >
            <i class="fas fa-tags"></i>
            <span>Categorias</span>
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

export default {
  name: 'DashboardView',
  components: {
    PedidosAdmin,
    CadastroProduto,
    CadastroCategoria
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
        categorias: 'Gerenciar Categorias'
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
  color: #EF4444;
  margin-bottom: 1.5rem;
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
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
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
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
}

.dashboard-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: white;
  border-right: 1px solid rgba(140, 82, 255, 0.1);
  box-shadow: 4px 0 20px rgba(140, 82, 255, 0.05);
}

.sidebar-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(140, 82, 255, 0.1);
}

.sidebar-header h2 {
  color: #8C52FF;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
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
}

.nav-item:hover {
  background: rgba(140, 82, 255, 0.05);
  color: #8C52FF;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(140, 82, 255, 0.1), rgba(140, 82, 255, 0.05));
  color: #8C52FF;
  border-right: 3px solid #8C52FF;
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
  border-bottom: 1px solid rgba(140, 82, 255, 0.1);
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
}

.content-body {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.1);
  border: 1px solid rgba(140, 82, 255, 0.1);
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .content-body {
    padding: 1rem;
  }
}
</style>
