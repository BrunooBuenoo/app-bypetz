<template>
  <div class="cadastro-categoria">
    <div class="section-header">
      <h2>
        <i class="fas fa-tags"></i>
        Gerenciar Categorias
      </h2>
    </div>

    <!-- Formulário para nova categoria -->
    <div class="form-section">
      <h3>Adicionar Nova Categoria</h3>
      <form @submit.prevent="addCategoria" class="categoria-form">
        <div class="form-group">
          <label for="nome">Nome da Categoria *</label>
          <input
            v-model="novaCategoria.nome"
            type="text"
            id="nome"
            placeholder="Ex: Ração, Brinquedos, Acessórios"
            required
          />
        </div>
        
        <button type="submit" class="btn-add" :disabled="loading">
          <i class="fas fa-plus"></i>
          {{ loading ? 'Adicionando...' : 'Adicionar Categoria' }}
        </button>
      </form>
    </div>

    <!-- Lista de categorias -->
    <div class="categorias-section">
      <h3>Categorias Existentes</h3>
      
      <!-- Loading -->
      <div v-if="loadingCategorias" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando categorias...</p>
      </div>

      <!-- Lista -->
      <div v-else-if="categorias.length > 0" class="categorias-list">
        <div v-for="categoria in categorias" :key="categoria.id" class="categoria-item">
          <div class="categoria-info">
            <span class="categoria-nome">{{ categoria.nome }}</span>
            <span class="categoria-data">
              Criada em {{ formatDate(categoria.criadoEm) }}
            </span>
          </div>
          
          <div class="categoria-actions">
            <button 
              @click="editCategoria(categoria)"
              class="btn-edit"
              title="Editar categoria"
            >
              <i class="fas fa-edit"></i>
            </button>
            
            <button 
              @click="deleteCategoria(categoria.id)"
              class="btn-delete"
              title="Excluir categoria"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sem categorias -->
      <div v-else class="no-categorias">
        <div class="no-categorias-icon">🏷️</div>
        <h4>Nenhuma categoria encontrada</h4>
        <p>Adicione a primeira categoria usando o formulário acima</p>
      </div>
    </div>

    <!-- Modal de edição -->
    <div v-if="editingCategoria" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Categoria</h3>
          <button @click="cancelEdit" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="updateCategoria" class="modal-form">
          <div class="form-group">
            <label for="edit-nome">Nome da Categoria *</label>
            <input
              v-model="editingCategoria.nome"
              type="text"
              id="edit-nome"
              required
            />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="loadingEdit">
              {{ loadingEdit ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensagens -->
    <div v-if="successMessage" class="alert alert-success">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'CadastroCategoria',
  setup() {
    const loading = ref(false)
    const loadingCategorias = ref(true)
    const loadingEdit = ref(false)
    const categorias = ref([])
    const novaCategoria = ref({ nome: '' })
    const editingCategoria = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const fetchCategorias = async () => {
      try {
        const categoriasQuery = query(
          collection(db, 'categorias'),
          orderBy('nome', 'asc')
        )
        
        const querySnapshot = await getDocs(categoriasQuery)
        const fetchedCategorias = []
        
        querySnapshot.forEach((doc) => {
          fetchedCategorias.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        categorias.value = fetchedCategorias
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
        errorMessage.value = 'Erro ao carregar categorias'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingCategorias.value = false
      }
    }

    const addCategoria = async () => {
      if (!novaCategoria.value.nome.trim()) return

      loading.value = true
      try {
        const categoriaData = {
          nome: novaCategoria.value.nome.trim(),
          criadoEm: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, 'categorias'), categoriaData)
        
        // Adicionar à lista local
        categorias.value.push({
          id: docRef.id,
          ...categoriaData,
          criadoEm: new Date()
        })

        // Ordenar lista
        categorias.value.sort((a, b) => a.nome.localeCompare(b.nome))

        novaCategoria.value.nome = ''
        successMessage.value = 'Categoria adicionada com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao adicionar categoria:', error)
        errorMessage.value = 'Erro ao adicionar categoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loading.value = false
      }
    }

    const editCategoria = (categoria) => {
      editingCategoria.value = { ...categoria }
    }

    const cancelEdit = () => {
      editingCategoria.value = null
    }

    const updateCategoria = async () => {
      if (!editingCategoria.value.nome.trim()) return

      loadingEdit.value = true
      try {
        await updateDoc(doc(db, 'categorias', editingCategoria.value.id), {
          nome: editingCategoria.value.nome.trim()
        })

        // Atualizar na lista local
        const index = categorias.value.findIndex(c => c.id === editingCategoria.value.id)
        if (index !== -1) {
          categorias.value[index].nome = editingCategoria.value.nome.trim()
        }

        // Ordenar lista
        categorias.value.sort((a, b) => a.nome.localeCompare(b.nome))

        editingCategoria.value = null
        successMessage.value = 'Categoria atualizada com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
        errorMessage.value = 'Erro ao atualizar categoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingEdit.value = false
      }
    }

    const deleteCategoria = async (categoriaId) => {
      if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

      try {
        await deleteDoc(doc(db, 'categorias', categoriaId))
        
        // Remover da lista local
        categorias.value = categorias.value.filter(c => c.id !== categoriaId)
        
        successMessage.value = 'Categoria excluída com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao excluir categoria:', error)
        errorMessage.value = 'Erro ao excluir categoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    onMounted(() => {
      fetchCategorias()
    })

    return {
      loading,
      loadingCategorias,
      loadingEdit,
      categorias,
      novaCategoria,
      editingCategoria,
      successMessage,
      errorMessage,
      formatDate,
      addCategoria,
      editCategoria,
      cancelEdit,
      updateCategoria,
      deleteCategoria
    }
  }
}
</script>

<style scoped>
.cadastro-categoria {
  width: 100%;
}

.section-header {
  margin-bottom: 2rem;
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

.form-section {
  background: rgba(140, 82, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.form-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.categoria-form {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #8C52FF;
  box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
}

.btn-add {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-add:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.categorias-section {
  margin-top: 2rem;
}

.categorias-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
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

.categorias-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  transition: all 0.3s ease;
}

.categoria-item:hover {
  box-shadow: 0 2px 10px rgba(140, 82, 255, 0.1);
}

.categoria-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.categoria-nome {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.categoria-data {
  color: #666;
  font-size: 0.8rem;
}

.categoria-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.btn-edit:hover {
  background: rgba(33, 150, 243, 0.2);
}

.btn-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.btn-delete:hover {
  background: rgba(244, 67, 54, 0.2);
}

.no-categorias {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.no-categorias-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-categorias h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
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

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
}

.btn-cancel:hover {
  background: rgba(140, 82, 255, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

.alert-error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 1px solid #EF4444;
}

@media (max-width: 768px) {
  .categoria-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-group {
    min-width: auto;
  }
  
  .categoria-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .categoria-actions {
    justify-content: center;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
