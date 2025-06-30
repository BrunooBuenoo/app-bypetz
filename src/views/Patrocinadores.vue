<template>
  <div class="patrocinadores">
    <div class="patrocinadores-header">
      <h2>Patrocinadores</h2>
      <button @click="openPatrocinadorModal">Adicionar Patrocinador</button>
    </div>

    <div v-if="isLoading" class="loading">Carregando patrocinadores...</div>
    <div v-else-if="sponsors.length === 0" class="no-sponsors">Nenhum patrocinador cadastrado.</div>
    <div v-else class="patrocinadores-grid">
      <div v-for="patrocinador in sponsors" :key="patrocinador.id" class="patrocinador-card">
        <img :src="patrocinador.logoURL" :alt="patrocinador.nome" class="patrocinador-logo">
        <div class="patrocinador-info">
          <h3>{{ patrocinador.nome }}</h3>
          <p>{{ patrocinador.descricao }}</p>
          <span :class="['status', patrocinador.status]">{{ patrocinador.status }}</span>
        </div>

        <div class="patrocinador-actions">
          <button 
            @click="openModal(patrocinador)"
            class="action-btn view"
            title="Ver detalhes"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          
          <button 
            @click="editPatrocinador(patrocinador)"
            class="action-btn edit"
            title="Editar patrocinador"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button 
            @click="deletePatrocinador(patrocinador.id)"
            class="action-btn delete"
            title="Excluir patrocinador"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
              <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal do Patrocinador -->
    <PatrocinadorModal
      v-if="selectedPatrocinador"
      :patrocinador="selectedPatrocinador"
      :isOpen="showModal"
      @close="closeModal"
      @edit="handleModalEdit"
      @status-change="handleModalStatusChange"
    />

    <Teleport to="body">
      <div v-if="showPatrocinadorModal" class="modal-overlay">
        <div class="modal">
          <header class="modal-header">
            <h2>Adicionar Patrocinador</h2>
            <button @click="closePatrocinadorModal" class="close-button">&times;</button>
          </header>
          <form @submit.prevent="addPatrocinador" class="modal-content">
            <div class="form-group">
              <label for="nome">Nome:</label>
              <input type="text" id="nome" v-model="newPatrocinador.nome" required>
            </div>
            <div class="form-group">
              <label for="descricao">Descrição:</label>
              <textarea id="descricao" v-model="newPatrocinador.descricao" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="logoURL">URL do Logo:</label>
              <input type="url" id="logoURL" v-model="newPatrocinador.logoURL" required>
            </div>
            <div class="form-group">
              <label for="status">Status:</label>
              <select id="status" v-model="newPatrocinador.status">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" @click="closePatrocinadorModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import PatrocinadorModal from '../components/PatrocinadorModal.vue'

export default {
  components: {
    PatrocinadorModal
  },
  setup() {
    const sponsors = ref([])
    const isLoading = ref(true)
    const showPatrocinadorModal = ref(false)
    const newPatrocinador = ref({
      nome: '',
      descricao: '',
      logoURL: '',
      status: 'ativo'
    })
    const successMessage = ref('')
    const errorMessage = ref('')

    const showModal = ref(false)
    const selectedPatrocinador = ref(null)

    const openModal = (patrocinador) => {
      selectedPatrocinador.value = patrocinador
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedPatrocinador.value = null
    }

    const handleModalEdit = (patrocinador) => {
      editPatrocinador(patrocinador)
      closeModal()
    }

    const handleModalStatusChange = async (updatedPatrocinador) => {
      try {
        await updateDoc(doc(db, 'patrocinadores', updatedPatrocinador.id), {
          status: updatedPatrocinador.status,
          atualizadoEm: serverTimestamp()
        })

        const index = sponsors.value.findIndex(p => p.id === updatedPatrocinador.id)
        if (index !== -1) {
          sponsors.value[index].status = updatedPatrocinador.status
        }

        successMessage.value = `Patrocinador ${updatedPatrocinador.status === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`
        setTimeout(() => { successMessage.value = '' }, 3000)
        closeModal()
      } catch (error) {
        console.error('Erro ao alterar status:', error)
        errorMessage.value = 'Erro ao alterar status do patrocinador'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const fetchPatrocinadores = async () => {
      isLoading.value = true
      try {
        const querySnapshot = await getDocs(collection(db, 'patrocinadores'))
        sponsors.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('Erro ao buscar patrocinadores:', error)
        errorMessage.value = 'Erro ao buscar patrocinadores.'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(fetchPatrocinadores)

    const openPatrocinadorModal = () => {
      showPatrocinadorModal.value = true
    }

    const closePatrocinadorModal = () => {
      showPatrocinadorModal.value = false
      newPatrocinador.value = {
        nome: '',
        descricao: '',
        logoURL: '',
        status: 'ativo'
      }
    }

    const addPatrocinador = async () => {
      try {
        await addDoc(collection(db, 'patrocinadores'), {
          ...newPatrocinador.value,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        })
        successMessage.value = 'Patrocinador adicionado com sucesso!'
        setTimeout(() => { successMessage.value = '' }, 3000)
        closePatrocinadorModal()
        await fetchPatrocinadores() // Recarrega os patrocinadores após adicionar
      } catch (error) {
        console.error('Erro ao adicionar patrocinador:', error)
        errorMessage.value = 'Erro ao adicionar patrocinador.'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const editPatrocinador = (patrocinador) => {
      // Implemente a lógica para editar o patrocinador aqui
      console.log('Editar patrocinador:', patrocinador)
    }

    const deletePatrocinador = async (id) => {
      if (confirm('Tem certeza que deseja excluir este patrocinador?')) {
        try {
          await deleteDoc(doc(db, 'patrocinadores', id))
          sponsors.value = sponsors.value.filter(patrocinador => patrocinador.id !== id)
          successMessage.value = 'Patrocinador excluído com sucesso!'
          setTimeout(() => { successMessage.value = '' }, 3000)
        } catch (error) {
          console.error('Erro ao excluir patrocinador:', error)
          errorMessage.value = 'Erro ao excluir patrocinador.'
          setTimeout(() => { errorMessage.value = '' }, 3000)
        }
      }
    }

    return {
      sponsors,
      isLoading,
      showPatrocinadorModal,
      newPatrocinador,
      successMessage,
      errorMessage,
      fetchPatrocinadores,
      openPatrocinadorModal,
      closePatrocinadorModal,
      addPatrocinador,
      editPatrocinador,
      deletePatrocinador,
      showModal,
      selectedPatrocinador,
      openModal,
      closeModal,
      handleModalEdit,
      handleModalStatusChange,
    }
  }
}
</script>

<style scoped>
.patrocinadores {
  padding: 20px;
}

.patrocinadores-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.patrocinadores-header h2 {
  margin: 0;
}

.patrocinadores-header button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.patrocinadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.patrocinador-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.patrocinador-logo {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

.patrocinador-info h3 {
  margin: 0;
  font-size: 1.2em;
}

.patrocinador-info p {
  margin: 5px 0;
  font-size: 0.9em;
  color: #666;
}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
  color: white;
}

.status.ativo {
  background-color: #28a745;
}

.status.inativo {
  background-color: #dc3545;
}

.patrocinador-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.action-btn {
  background: #eee;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.action-btn svg {
  display: block;
}

.action-btn.edit {
  background: #d1c4e9;
  color: #4527a0;
}

.action-btn.edit:hover {
  background: #b39ddb;
  transform: scale(1.1);
}

.action-btn.delete {
  background: #ffcdd2;
  color: #b71c1c;
}

.action-btn.delete:hover {
  background: #ef9a9a;
  transform: scale(1.1);
}

.action-btn.view {
  background: #f3e8ff;
  color: #9333ea;
}

.action-btn.view:hover {
  background: #e9d5ff;
  transform: scale(1.1);
}

.loading,
.no-sponsors {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #888;
}

/* Estilos do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
}

.modal-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #5c6bc0;
  color: white;
}

.success-message {
  background-color: #4CAF50;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
}

.error-message {
  background-color: #f44336;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
}
</style>
