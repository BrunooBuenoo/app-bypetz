<template>
  <div class="pedidos-admin">
    <!-- Header com estatísticas -->
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L12 1L5 7V20H19V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          Gerenciar Pedidos
        </h2>
        <p class="section-subtitle">Acompanhe e gerencie todos os pedidos da loja</p>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="2"/>
              <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ pedidos.length }}</span>
            <span class="stat-label">Total de Pedidos</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ pedidosPendentes }}</span>
            <span class="stat-label">Pendentes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Carregando pedidos...</p>
    </div>

    <!-- Lista de Pedidos -->
    <div v-else-if="pedidos.length > 0" class="pedidos-container">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <!-- Header do Pedido -->
        <div class="pedido-header">
          <div class="pedido-info">
            <h3 class="pedido-numero">{{ pedido.numeropedido }}</h3>
            <span class="pedido-data">{{ formatDate(pedido.criadoEm) }}</span>
          </div>
          <div class="status-container">
            <span class="status-badge" :class="pedido.status">
              {{ getStatusLabel(pedido.status) }}
            </span>
          </div>
        </div>

        <!-- Cliente -->
        <div class="cliente-info">
          <div class="cliente-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="cliente-nome">{{ pedido.userName || pedido.userEmail }}</span>
        </div>

        <!-- Produtos -->
        <div class="produtos-section">
          <h4 class="produtos-title">Produtos do Pedido</h4>
          <div class="produtos-list">
            <div v-for="produto in pedido.produtos" :key="produto.id" class="produto-item">
              <div class="produto-image">
                <img :src="produto.imagem || placeholderImage" :alt="produto.nome" />
              </div>
              <div class="produto-details">
                <span class="produto-nome">{{ produto.nome }}</span>
                <div class="produto-meta">
                  <span class="produto-quantidade">Qtd: {{ produto.quantidade }}</span>
                  <span class="produto-preco">R$ {{ formatPrice(produto.preco * produto.quantidade) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer com Total e Ações -->
        <div class="pedido-footer">
          <div class="total-section">
            <span class="total-label">Total do Pedido</span>
            <span class="total-value">R$ {{ formatPrice(pedido.total) }}</span>
          </div>
          
          <div class="actions-section">
            <button 
              @click="updateStatus(pedido.id, 'processando')"
              class="action-btn primary"
              :disabled="pedido.status !== 'pendente'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1V9" stroke="currentColor" stroke-width="2"/>
                <path d="M21 12H13" stroke="currentColor" stroke-width="2"/>
                <path d="M12 15V23" stroke="currentColor" stroke-width="2"/>
                <path d="M3 12H11" stroke="currentColor" stroke-width="2"/>
              </svg>
              Processar
            </button>
            
            <button 
              @click="updateStatus(pedido.id, 'concluido')"
              class="action-btn success"
              :disabled="pedido.status === 'concluido'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
              </svg>
              Concluir
            </button>
            
            <button 
              @click="openDeleteModal(pedido)"
              class="action-btn danger"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      <h3 class="empty-title">Nenhum pedido encontrado</h3>
      <p class="empty-description">Os pedidos aparecerão aqui quando forem realizados pelos clientes</p>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            Confirmar Exclusão
          </h3>
          <button @click="closeDeleteModal" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="warning-card">
            <div class="warning-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.29 3.86L1.82 18C1.64 18.37 1.9 18.75 2.31 18.75H21.69C22.1 18.75 22.36 18.37 22.18 18L13.71 3.86C13.32 3.15 12.68 3.15 12.29 3.86V3.86Z" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="warning-content">
              <p class="warning-title">Esta ação não pode ser desfeita!</p>
              <p class="warning-text">Você está prestes a excluir permanentemente o pedido:</p>
              <div class="pedido-preview">
                <span class="preview-numero">{{ deletingPedido?.numeropedido }}</span>
                <span class="preview-total">Total: R$ {{ formatPrice(deletingPedido?.total || 0) }}</span>
              </div>
            </div>
          </div>
          
          <div class="confirmation-section">
            <label for="delete-confirm" class="confirm-label">
              Para confirmar, digite: <strong>"Sim, Excluir pedido {{ deletingPedido?.numeropedido }}"</strong>
            </label>
            <input
              v-model="deleteConfirmText"
              type="text"
              id="delete-confirm"
              placeholder="Digite a confirmação aqui..."
              class="confirm-input"
              :class="{ 'error': errorMessage }"
            />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="modal-btn secondary">
            Cancelar
          </button>
          <button 
            @click="deletePedido" 
            class="modal-btn danger"
            :disabled="deleteLoading || !deleteConfirmText.trim()"
          >
            {{ deleteLoading ? 'Excluindo...' : 'Excluir Pedido' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notificações -->
    <div v-if="successMessage" class="notification success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'Pedidos',
  setup() {
    const loading = ref(true)
    const pedidos = ref([])
    const successMessage = ref('')
    const placeholderImage = 'https://via.placeholder.com/60x60/9333ea/FFFFFF?text=Item'
    const showDeleteModal = ref(false)
    const deletingPedido = ref(null)
    const deleteConfirmText = ref('')
    const deleteLoading = ref(false)
    const errorMessage = ref('')

    const pedidosPendentes = computed(() => {
      return pedidos.value.filter(pedido => pedido.status === 'pendente').length
    })

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusLabel = (status) => {
      const labels = {
        'pendente': 'Pendente',
        'processando': 'Processando',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
      }
      return labels[status] || status
    }

    const fetchPedidos = async () => {
      try {
        const pedidosQuery = query(
          collection(db, 'pedidos'),
          orderBy('criadoEm', 'desc')
        )
        
        const querySnapshot = await getDocs(pedidosQuery)
        const fetchedPedidos = []
        
        querySnapshot.forEach((doc) => {
          fetchedPedidos.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        pedidos.value = fetchedPedidos
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      } finally {
        loading.value = false
      }
    }

    const updateStatus = async (pedidoId, newStatus) => {
      try {
        await updateDoc(doc(db, 'pedidos', pedidoId), {
          status: newStatus
        })
        
        const pedido = pedidos.value.find(p => p.id === pedidoId)
        if (pedido) {
          pedido.status = newStatus
        }
        
        successMessage.value = `Status atualizado para ${getStatusLabel(newStatus)}`
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
      }
    }

    const deletePedido = async () => {
      if (!deletingPedido.value) return
      
      const expectedText = `Sim, Excluir pedido ${deletingPedido.value.numeropedido}`
      
      if (deleteConfirmText.value !== expectedText) {
        errorMessage.value = 'Texto de confirmação incorreto'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      deleteLoading.value = true
      try {
        await deleteDoc(doc(db, 'pedidos', deletingPedido.value.id))
        
        pedidos.value = pedidos.value.filter(p => p.id !== deletingPedido.value.id)
        
        successMessage.value = `Pedido ${deletingPedido.value.numeropedido} excluído com sucesso!`
        closeDeleteModal()
        
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao excluir pedido:', error)
        errorMessage.value = 'Erro ao excluir pedido: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        deleteLoading.value = false
      }
    }

    const openDeleteModal = (pedido) => {
      deletingPedido.value = pedido
      deleteConfirmText.value = ''
      showDeleteModal.value = true
      errorMessage.value = ''
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      deletingPedido.value = null
      deleteConfirmText.value = ''
      deleteLoading.value = false
      errorMessage.value = ''
    }

    onMounted(() => {
      fetchPedidos()
    })

    return {
      loading,
      pedidos,
      pedidosPendentes,
      successMessage,
      placeholderImage,
      showDeleteModal,
      deletingPedido,
      deleteConfirmText,
      deleteLoading,
      errorMessage,
      formatPrice,
      formatDate,
      getStatusLabel,
      updateStatus,
      deletePedido,
      openDeleteModal,
      closeDeleteModal
    }
  }
}
</script>

<style scoped>
.pedidos-admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
}

/* Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
  
}

.header-content {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 12px;
  color: white;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

/* Stats Cards */
.stats-cards {
  display: flex;
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 160px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #9333ea, #2563eb);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Pedidos Container */
.pedidos-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pedido-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Pedido Header */
.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e5e7eb;
}

.pedido-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pedido-numero {
  font-size: 1.25rem;
  font-weight: 700;
  color: #9333ea;
  margin: 0;
}

.pedido-data {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.status-container {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pendente {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.processando {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.concluido {
  background: #d1fae5;
  color: #059669;
}

.status-badge.cancelado {
  background: #fee2e2;
  color: #dc2626;
}

/* Cliente Info */
.cliente-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
}

.cliente-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 8px;
  color: white;
}

.cliente-nome {
  font-weight: 600;
  color: #374151;
}

/* Produtos Section */
.produtos-section {
  padding: 1.5rem 2rem;
}

.produtos-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.produtos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.produto-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.produto-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 1px solid #e5e7eb;
}

.produto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.produto-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.produto-nome {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.produto-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.produto-quantidade {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.produto-preco {
  font-size: 0.95rem;
  font-weight: 700;
  color: #9333ea;
}

/* Footer */
.pedido-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.total-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.total-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #9333ea;
}

.actions-section {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.primary:hover:not(:disabled) {
  background: #bfdbfe;
}

.action-btn.success {
  background: #d1fae5;
  color: #059669;
}

.action-btn.success:hover:not(:disabled) {
  background: #a7f3d0;
}

.action-btn.danger {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.danger:hover:not(:disabled) {
  background: #fecaca;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
  max-width: 400px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.warning-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.warning-icon {
  color: #dc2626;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.warning-text {
  color: #374151;
  margin: 0 0 1rem 0;
}

.pedido-preview {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.preview-numero {
  font-weight: 700;
  color: #9333ea;
}

.preview-total {
  font-weight: 600;
  color: #dc2626;
}

.confirmation-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirm-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.4;
}

.confirm-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.confirm-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.confirm-input.error {
  border-color: #dc2626;
  background: #fef2f2;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.modal-btn.secondary:hover {
  background: #e5e7eb;
}

.modal-btn.danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
}

.modal-btn.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
}

.modal-btn.danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Notifications */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1001;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.notification.success {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

/* Responsive */
@media (max-width: 768px) {
  .pedidos-admin {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stats-cards {
    flex-direction: column;
    width: 100%;
  }

  .stat-card {
    min-width: auto;
  }

  .pedido-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .pedido-footer {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }

  .actions-section {
    justify-content: center;
  }

  .produto-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .produto-meta {
    flex-direction: column;
    gap: 0.25rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .modal-body {
    padding: 1rem 1.5rem;
  }

  .modal-actions {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
  }

  .title-icon {
    width: 36px;
    height: 36px;
  }

  .actions-section {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .warning-card {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>