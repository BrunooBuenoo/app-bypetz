<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h2 class="modal-title">Detalhes do Patrocinador</h2>
            <div class="status-badge" :class="patrocinador.status">
              {{ getStatusLabel(patrocinador.status) }}
            </div>
          </div>
          
          <button @click="$emit('close')" class="close-btn" title="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Logo e Nome -->
          <div class="patrocinador-header">
            <div class="patrocinador-logo">
              <img v-if="patrocinador.logo" :src="patrocinador.logo" :alt="patrocinador.nome" @error="onImageError" />
              <div v-else class="logo-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            
            <div class="patrocinador-info">
              <h3 class="patrocinador-nome">{{ patrocinador.nome }}</h3>
              <div v-if="patrocinador.categoria" class="patrocinador-categoria">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ getCategoriaLabel(patrocinador.categoria) }}
              </div>
            </div>
          </div>

          <!-- Descrição -->
          <div v-if="patrocinador.descricao" class="section">
            <h4 class="section-title">Descrição</h4>
            <p class="section-content">{{ patrocinador.descricao }}</p>
          </div>

          <!-- Informações de Contato -->
          <div class="section">
            <h4 class="section-title">Informações de Contato</h4>
            <div class="contact-grid">
              <div v-if="patrocinador.email" class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="contact-content">
                  <span class="contact-label">Email</span>
                  <a :href="`mailto:${patrocinador.email}`" class="contact-value">{{ patrocinador.email }}</a>
                </div>
              </div>

              <div v-if="patrocinador.telefone" class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.9 21.11 21.74 20.13 21.95C19.88 21.98 19.62 22 19.35 22C8.93 22 0.68 13.75 0.68 3.32C0.68 3.05 0.7 2.79 0.72 2.54C0.93 1.56 1.77 0.67 2.75 0.67H5.75C6.24 0.67 6.66 1.02 6.75 1.5C6.84 2.25 6.98 2.99 7.17 3.71C7.3 4.12 7.18 4.57 6.89 4.84L5.5 6.23C6.57 8.69 8.31 10.43 10.77 11.5L12.16 10.11C12.43 9.82 12.88 9.7 13.29 9.83C14.01 10.02 14.75 10.16 15.5 10.25C15.98 10.34 16.33 10.76 16.33 11.25V14.25C16.33 14.73 15.98 15.15 15.5 15.24C15.25 15.26 14.99 15.28 14.72 15.28C13.73 15.28 12.78 15.11 11.89 14.8" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="contact-content">
                  <span class="contact-label">Telefone</span>
                  <a :href="`tel:${patrocinador.telefone}`" class="contact-value">{{ patrocinador.telefone }}</a>
                </div>
              </div>

              <div v-if="patrocinador.website" class="contact-item">
                <div class="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="contact-content">
                  <span class="contact-label">Website</span>
                  <a :href="patrocinador.website" target="_blank" rel="noopener noreferrer" class="contact-value">
                    {{ formatWebsite(patrocinador.website) }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Período de Patrocínio -->
          <div v-if="patrocinador.dataInicio || patrocinador.dataFim" class="section">
            <h4 class="section-title">Período de Patrocínio</h4>
            <div class="periodo-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ formatPeriodo(patrocinador.dataInicio, patrocinador.dataFim) }}</span>
            </div>
          </div>

          <!-- Status Control -->
          <div class="section">
            <h4 class="section-title">Controle de Status</h4>
            <div class="status-controls">
              <button 
                v-for="status in statusOptions" 
                :key="status.value"
                @click="changeStatus(status.value)"
                :class="['status-btn', status.value, { active: patrocinador.status === status.value }]"
                :disabled="patrocinador.status === status.value"
              >
                <component :is="status.icon" />
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button @click="closeModal" class="btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
            Fechar
          </button>
          
          <button @click="handleEdit" class="btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Editar Patrocinador
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'PatrocinadorModal',
  props: {
    patrocinador: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'edit', 'status-change'],
  setup(props, { emit }) {
  const statusOptions = ref([
    {
      value: 'ativo',
      label: 'Ativo',
      icon: 'CheckIcon'
    },
    {
      value: 'inativo',
      label: 'Inativo', 
      icon: 'XIcon'
    },
    {
      value: 'pendente',
      label: 'Pendente',
      icon: 'ClockIcon'
    }
  ])

  // Salva o scroll original
  let originalScrollY = 0

  const getStatusLabel = (status) => {
    const labels = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'pendente': 'Pendente'
    }
    return labels[status] || status
  }

  const getCategoriaLabel = (categoria) => {
    const labels = {
      'alimentacao': 'Alimentação',
      'veterinaria': 'Veterinária',
      'petshop': 'Pet Shop',
      'servicos': 'Serviços',
      'tecnologia': 'Tecnologia',
      'outros': 'Outros'
    }
    return labels[categoria] || categoria
  }

  const formatWebsite = (website) => {
    return website.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }

  const formatPeriodo = (dataInicio, dataFim) => {
    const formatDate = (date) => {
      if (!date) return null
      return new Date(date).toLocaleDateString('pt-BR')
    }

    const inicio = formatDate(dataInicio)
    const fim = formatDate(dataFim)

    if (inicio && fim) {
      return `${inicio} - ${fim}`
    } else if (inicio) {
      return `A partir de ${inicio}`
    } else if (fim) {
      return `Até ${fim}`
    }
    return 'Período indefinido'
  }

  const handleOverlayClick = () => {
    emit('close')
  }

  const changeStatus = (newStatus) => {
    if (newStatus !== props.patrocinador.status) {
      emit('status-change', { ...props.patrocinador, status: newStatus })
    }
  }

  const closeModal = () => {
    emit('close')
  }

  const handleEdit = () => {
    emit('edit', props.patrocinador)
    closeModal()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const onImageError = (event) => {
    event.target.src = '/placeholder.svg?height=80&width=80'
  }

  // Função para bloquear scroll
  const disableScroll = () => {
    originalScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${originalScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }

  // Função para restaurar scroll
  const enableScroll = () => {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.height = ''
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    window.scrollTo(0, originalScrollY)
  }

  // Controle do ESC
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }

  // Watch para controlar o modal
  watch(() => props.isOpen, (newValue) => {
    if (newValue) {
      disableScroll()
      document.addEventListener('keydown', handleEscapeKey)
    } else {
      enableScroll()
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, { immediate: true })

  onUnmounted(() => {
    enableScroll()
    document.removeEventListener('keydown', handleEscapeKey)
  })

  return {
    statusOptions,
    getStatusLabel,
    getCategoriaLabel,
    formatWebsite,
    formatPeriodo,
    handleOverlayClick,
    changeStatus,
    formatDate,
    onImageError,
    closeModal,
    handleEdit
  }
}
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  flex-shrink: 0;
}

.modal-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
}

.status-badge.ativo {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inativo {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.pendente {
  background: #fef3c7;
  color: #d97706;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.05);
}

/* Modal Content */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Patrocinador Header */
.patrocinador-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.patrocinador-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.patrocinador-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.patrocinador-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.patrocinador-nome {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.patrocinador-categoria {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
}

.patrocinador-categoria svg {
  color: #9333ea;
}

/* Sections */
.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-content {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* Contact Grid */
.contact-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 8px;
  color: #9333ea;
  flex-shrink: 0;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.contact-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
}

.contact-value:hover {
  color: #9333ea;
}

/* Período Info */
.periodo-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.periodo-info svg {
  color: #9333ea;
  flex-shrink: 0;
}

/* Status Controls */
.status-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.status-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f3f4f6;
  color: #6b7280;
  text-align: center;
}

.status-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.status-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status-btn.ativo {
  background: #d1fae5;
  color: #059669;
  border-color: #a7f3d0;
}

.status-btn.ativo.active {
  background: #059669;
  color: white;
  border-color: #059669;
}

.status-btn.inativo {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.status-btn.inativo.active {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.status-btn.pendente {
  background: #fef3c7;
  color: #d97706;
  border-color: #fde68a;
}

.status-btn.pendente.active {
  background: #d97706;
  color: white;
  border-color: #d97706;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 40px;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.secondary:hover {
  background: #e5e7eb;
}

.btn.primary {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
}

.btn.primary:hover {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 90vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-content {
    padding: 1rem;
    gap: 1rem;
  }

  .patrocinador-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .patrocinador-logo {
    width: 50px;
    height: 50px;
  }

  .patrocinador-nome {
    font-size: 1.125rem;
  }

  .status-controls {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.25rem;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: 0.75rem;
  }

  .modal-content {
    padding: 0.75rem;
  }

  .modal-footer {
    padding: 0.75rem;
  }

  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
