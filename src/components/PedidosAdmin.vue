<template>
  <div class="pedidos-admin">
    <div class="section-header">
      <h2>
        <i class="fas fa-shopping-bag"></i>
        Lista de Pedidos
      </h2>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-number">{{ pedidos.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ pedidosPendentes }}</span>
          <span class="stat-label">Pendentes</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando pedidos...</p>
    </div>

    <!-- Lista de Pedidos -->
    <div v-else-if="pedidos.length > 0" class="pedidos-list">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <div class="pedido-header">
          <div class="pedido-info">
            <span class="pedido-numero">{{ pedido.numeropedido }}</span>
            <span class="pedido-data">{{ formatDate(pedido.criadoEm) }}</span>
          </div>
          <div class="pedido-status">
            <span class="status-badge" :class="pedido.status">
              {{ getStatusLabel(pedido.status) }}
            </span>
          </div>
        </div>

        <div class="pedido-cliente">
          <i class="fas fa-user"></i>
          <span>{{ pedido.userName || pedido.userEmail }}</span>
        </div>

        <div class="pedido-produtos">
          <h4>Produtos:</h4>
          <div class="produtos-list">
            <div v-for="produto in pedido.produtos" :key="produto.id" class="produto-item">
              <img :src="produto.imagem || placeholderImage" :alt="produto.nome" />
              <div class="produto-details">
                <span class="produto-nome">{{ produto.nome }}</span>
                <span class="produto-quantidade">Qtd: {{ produto.quantidade }}</span>
                <span class="produto-preco">R$ {{ formatPrice(produto.preco * produto.quantidade) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pedido-footer">
          <div class="pedido-total">
            <span class="total-label">Total:</span>
            <span class="total-value">R$ {{ formatPrice(pedido.total) }}</span>
          </div>
          <div class="pedido-actions">
            <button 
              @click="updateStatus(pedido.id, 'processando')"
              class="btn-action btn-process"
              :disabled="pedido.status !== 'pendente'"
            >
              <i class="fas fa-cog"></i>
              Processar
            </button>
            <button 
              @click="updateStatus(pedido.id, 'concluido')"
              class="btn-action btn-complete"
              :disabled="pedido.status === 'concluido'"
            >
              <i class="fas fa-check"></i>
              Concluir
            </button>
            <button 
              @click="openDeleteModal(pedido)"
              class="btn-action btn-delete"
              title="Excluir pedido"
            >
              <i class="fas fa-trash"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sem pedidos -->
    <div v-else class="no-pedidos">
      <div class="no-pedidos-icon">📦</div>
      <h3>Nenhum pedido encontrado</h3>
      <p>Os pedidos aparecerão aqui quando forem realizados</p>
    </div>

    <!-- Mensagem de sucesso -->
    <div v-if="successMessage" class="alert alert-success">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-exclamation-triangle"></i>
            Confirmar Exclusão
          </h3>
          <button @click="closeDeleteModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="warning-message">
            <p><strong>⚠️ ATENÇÃO:</strong> Esta ação não pode ser desfeita!</p>
            <p>Você está prestes a excluir permanentemente o pedido:</p>
            <div class="pedido-info-modal">
              <span class="pedido-numero-modal">{{ deletingPedido?.numeropedido }}</span>
              <span class="pedido-total-modal">Total: R$ {{ formatPrice(deletingPedido?.total || 0) }}</span>
            </div>
          </div>
          
          <div class="confirmation-input">
            <label for="delete-confirm">
              Para confirmar, digite exatamente: 
              <strong>"Sim, Excluir pedido {{ deletingPedido?.numeropedido }}"</strong>
            </label>
            <input
              v-model="deleteConfirmText"
              type="text"
              id="delete-confirm"
              placeholder="Digite a confirmação aqui..."
              class="confirm-input"
              :class="{ 'error': errorMessage }"
            />
            <div v-if="errorMessage" class="error-text">
              {{ errorMessage }}
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-cancel-modal">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button 
            @click="deletePedido" 
            class="btn-delete-confirm"
            :disabled="deleteLoading || !deleteConfirmText.trim()"
          >
            <i class="fas fa-trash"></i>
            {{ deleteLoading ? 'Excluindo...' : 'Excluir Pedido' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'PedidosAdmin',
  setup() {
    const loading = ref(true)
    const pedidos = ref([])
    const successMessage = ref('')
    const placeholderImage = 'https://via.placeholder.com/50x50/8C52FF/FFFFFF?text=Item'
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

        // Atualizar localmente
        const pedido = pedidos.value.find(p => p.id === pedidoId)
        if (pedido) {
          pedido.status = newStatus
        }

        successMessage.value = `Status do pedido atualizado para ${getStatusLabel(newStatus)}`
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

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
        
        // Remover da lista local
        pedidos.value = pedidos.value.filter(p => p.id !== deletingPedido.value.id)
        
        successMessage.value = `Pedido ${deletingPedido.value.numeropedido} excluído com sucesso!`
        closeDeleteModal()
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

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
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #8C52FF;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(140, 82, 255, 0.3);
  border-top: 3px solid #8C52FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pedido-card {
  background: rgba(140, 82, 255, 0.02);
  border: 1px solid rgba(140, 82, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.pedido-card:hover {
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pedido-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pedido-numero {
  font-size: 1.1rem;
  font-weight: 700;
  color: #8C52FF;
}

.pedido-data {
  font-size: 0.9rem;
  color: #666;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pendente {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.status-badge.processando {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.status-badge.concluido {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-badge.cancelado {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.pedido-cliente {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-weight: 500;
}

.pedido-produtos h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.produtos-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.produto-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.produto-item img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
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
  color: #333;
  font-size: 0.9rem;
}

.produto-quantidade {
  color: #666;
  font-size: 0.8rem;
}

.produto-preco {
  color: #8C52FF;
  font-weight: 700;
  font-size: 0.9rem;
}

.pedido-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(140, 82, 255, 0.1);
}

.pedido-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label {
  color: #666;
  font-weight: 600;
}

.total-value {
  color: #8C52FF;
  font-size: 1.2rem;
  font-weight: 800;
}

.pedido-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-process {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.btn-process:hover:not(:disabled) {
  background: rgba(33, 150, 243, 0.2);
}

.btn-complete {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.btn-complete:hover:not(:disabled) {
  background: rgba(76, 175, 80, 0.2);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-pedidos {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-pedidos-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-pedidos h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.alert {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  z-index: 10000;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-success {
  background: rgba(34, 197, 94, 0.95);
  color: white;
  border: 1px solid #22C55E;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats {
    justify-content: center;
  }
  
  .pedido-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pedido-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pedido-actions {
    justify-content: center;
  }
  
  .produto-item {
    flex-direction: column;
    text-align: center;
  }
}

.btn-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.btn-delete:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
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
  border-bottom: 1px solid rgba(244, 67, 54, 0.1);
}

.modal-header h3 {
  color: #F44336;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(244, 67, 54, 0.2);
}

.modal-body {
  padding: 1.5rem 2rem;
}

.warning-message {
  background: rgba(244, 67, 54, 0.05);
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.warning-message p {
  margin: 0 0 0.75rem 0;
  color: #333;
}

.warning-message p:last-child {
  margin-bottom: 0;
}

.pedido-info-modal {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.pedido-numero-modal {
  font-size: 1.1rem;
  font-weight: 700;
  color: #8C52FF;
}

.pedido-total-modal {
  font-size: 1rem;
  font-weight: 600;
  color: #F44336;
}

.confirmation-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirmation-input label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.4;
}

.confirm-input {
  padding: 0.75rem;
  border: 2px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.confirm-input:focus {
  outline: none;
  border-color: #F44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.confirm-input.error {
  border-color: #F44336;
  background: rgba(244, 67, 54, 0.05);
}

.error-text {
  color: #F44336;
  font-size: 0.8rem;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: flex-end;
}

.btn-cancel-modal,
.btn-delete-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel-modal {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
}

.btn-cancel-modal:hover {
  background: rgba(140, 82, 255, 0.15);
}

.btn-delete-confirm {
  background: linear-gradient(135deg, #F44336, #D32F2F);
  color: white;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #D32F2F, #B71C1C);
  transform: translateY(-1px);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
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
</style>
