<template>
  <div class="cadastro-categoria">

    <!-- Formulário para nova categoria -->
    <div class="form-section">
      <h3>{{ editingCategoria ? 'Editar Categoria' : 'Adicionar Nova Categoria' }}</h3>
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
        
        <div class="form-buttons">
          <button 
            v-if="editingCategoria"
            type="button" 
            @click="cancelEdit" 
            class="btn-cancel"
          >
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          
          <button type="submit" class="btn-add" :disabled="loading">
            <i class="fas fa-plus"></i>
            {{ loading ? 'Salvando...' : (editingCategoria ? 'Atualizar Categoria' : 'Adicionar Categoria') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Formulário para nova subcategoria -->
    <div class="form-section">
      <h3>{{ editingSubcategoria ? 'Editar Subcategoria' : 'Adicionar Nova Subcategoria' }}</h3>
      <form @submit.prevent="addSubcategoria" class="subcategoria-form">
        <div class="form-row">
          <div class="form-group">
            <label for="categoria-pai">Categoria Pai *</label>
            <select v-model="novaSubcategoria.categoriaId" id="categoria-pai" required>
              <option value="">Selecione uma categoria</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nome }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="nome-sub">Nome da Subcategoria *</label>
            <input
              v-model="novaSubcategoria.nome"
              type="text"
              id="nome-sub"
              placeholder="Ex: Peitorais, Guias, Coleiras"
              required
            />
          </div>
        </div>
        
        <div class="form-buttons">
          <button 
            v-if="editingSubcategoria"
            type="button" 
            @click="cancelSubEdit" 
            class="btn-cancel"
          >
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          
          <button type="submit" class="btn-add" :disabled="loadingSub">
            <i class="fas fa-plus"></i>
            {{ loadingSub ? 'Salvando...' : (editingSubcategoria ? 'Atualizar Subcategoria' : 'Adicionar Subcategoria') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de categorias e subcategorias -->
    <div class="categorias-section">
      <h3>Categorias e Subcategorias</h3>
      
      <!-- Loading -->
      <div v-if="loadingCategorias" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando categorias...</p>
      </div>

      <!-- Lista -->
      <div v-else-if="categorias.length > 0" class="categorias-tree">
        <div v-for="categoria in categorias" :key="categoria.id" class="categoria-tree-item">
          <!-- Categoria Principal -->
          <div class="categoria-item">
            <div class="categoria-info">
              <div class="categoria-header">
                <button 
                  @click="toggleCategory(categoria.id)"
                  class="expand-btn"
                  :class="{ expanded: expandedCategories.includes(categoria.id) }"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
                <span class="categoria-nome">{{ categoria.nome }}</span>
                <span class="categoria-count">
                  ({{ getSubcategoryCount(categoria.id) }} subcategorias)
                </span>
              </div>
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
          
          <!-- Subcategorias -->
          <div 
            v-if="expandedCategories.includes(categoria.id)"
            class="subcategorias-list"
          >
            <div 
              v-for="subcategoria in getSubcategorias(categoria.id)" 
              :key="subcategoria.id"
              class="subcategoria-item"
            >
              <div class="subcategoria-info">
                <span class="subcategoria-nome">{{ subcategoria.nome }}</span>
                <span class="subcategoria-data">
                  Criada em {{ formatDate(subcategoria.criadoEm) }}
                </span>
              </div>
              
              <div class="subcategoria-actions">
                <button 
                  @click="editSubcategoria(subcategoria)"
                  class="btn-edit-sub"
                  title="Editar subcategoria"
                >
                  <i class="fas fa-edit"></i>
                </button>
                
                <button 
                  @click="deleteSubcategoria(subcategoria.id)"
                  class="btn-delete-sub"
                  title="Excluir subcategoria"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div v-if="getSubcategorias(categoria.id).length === 0" class="no-subcategorias">
              <span>Nenhuma subcategoria encontrada</span>
            </div>
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
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'CadastroCategoria',
  setup() {
    const loading = ref(false)
    const loadingSub = ref(false)
    const loadingCategorias = ref(true)
    const categorias = ref([])
    const subcategorias = ref([])
    const novaCategoria = ref({ nome: '' })
    const novaSubcategoria = ref({ nome: '', categoriaId: '' })
    const editingCategoria = ref(null)
    const editingSubcategoria = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const expandedCategories = ref([])

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const getSubcategorias = (categoriaId) => {
      return subcategorias.value.filter(sub => sub.categoriaId === categoriaId)
    }

    const getSubcategoryCount = (categoriaId) => {
      return getSubcategorias(categoriaId).length
    }

    const toggleCategory = (categoriaId) => {
      const index = expandedCategories.value.indexOf(categoriaId)
      if (index > -1) {
        expandedCategories.value.splice(index, 1)
      } else {
        expandedCategories.value.push(categoriaId)
      }
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
      }
    }

    const fetchSubcategorias = async () => {
      try {
        const subcategoriasQuery = query(
          collection(db, 'subcategorias'),
          orderBy('nome', 'asc')
        )
        
        const querySnapshot = await getDocs(subcategoriasQuery)
        const fetchedSubcategorias = []
        
        querySnapshot.forEach((doc) => {
          fetchedSubcategorias.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        subcategorias.value = fetchedSubcategorias
      } catch (error) {
        console.error('Erro ao buscar subcategorias:', error)
        errorMessage.value = 'Erro ao carregar subcategorias'
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

        if (editingCategoria.value) {
          // Atualizar categoria existente
          await updateDoc(doc(db, 'categorias', editingCategoria.value.id), {
            nome: novaCategoria.value.nome.trim()
          })

          // Atualizar na lista local
          const index = categorias.value.findIndex(c => c.id === editingCategoria.value.id)
          if (index !== -1) {
            categorias.value[index].nome = novaCategoria.value.nome.trim()
          }

          successMessage.value = 'Categoria atualizada com sucesso!'
          editingCategoria.value = null
        } else {
          // Adicionar nova categoria
          const docRef = await addDoc(collection(db, 'categorias'), categoriaData)
          
          // Adicionar à lista local
          categorias.value.push({
            id: docRef.id,
            ...categoriaData,
            criadoEm: new Date()
          })

          successMessage.value = 'Categoria adicionada com sucesso!'
        }

        // Ordenar lista
        categorias.value.sort((a, b) => a.nome.localeCompare(b.nome))

        novaCategoria.value.nome = ''
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao salvar categoria:', error)
        errorMessage.value = 'Erro ao salvar categoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loading.value = false
      }
    }

    const addSubcategoria = async () => {
      if (!novaSubcategoria.value.nome.trim() || !novaSubcategoria.value.categoriaId) return

      loadingSub.value = true
      try {
        const subcategoriaData = {
          nome: novaSubcategoria.value.nome.trim(),
          categoriaId: novaSubcategoria.value.categoriaId,
          criadoEm: serverTimestamp()
        }

        if (editingSubcategoria.value) {
          // Atualizar subcategoria existente
          await updateDoc(doc(db, 'subcategorias', editingSubcategoria.value.id), {
            nome: novaSubcategoria.value.nome.trim(),
            categoriaId: novaSubcategoria.value.categoriaId
          })

          // Atualizar na lista local
          const index = subcategorias.value.findIndex(s => s.id === editingSubcategoria.value.id)
          if (index !== -1) {
            subcategorias.value[index].nome = novaSubcategoria.value.nome.trim()
            subcategorias.value[index].categoriaId = novaSubcategoria.value.categoriaId
          }

          successMessage.value = 'Subcategoria atualizada com sucesso!'
          editingSubcategoria.value = null
        } else {
          // Adicionar nova subcategoria
          const docRef = await addDoc(collection(db, 'subcategorias'), subcategoriaData)
          
          // Adicionar à lista local
          subcategorias.value.push({
            id: docRef.id,
            ...subcategoriaData,
            criadoEm: new Date()
          })

          successMessage.value = 'Subcategoria adicionada com sucesso!'
        }

        // Ordenar lista
        subcategorias.value.sort((a, b) => a.nome.localeCompare(b.nome))

        novaSubcategoria.value = { nome: '', categoriaId: '' }
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao salvar subcategoria:', error)
        errorMessage.value = 'Erro ao salvar subcategoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingSub.value = false
      }
    }

    const editCategoria = (categoria) => {
      editingCategoria.value = categoria
      novaCategoria.value.nome = categoria.nome
      
      // Scroll para o formulário
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const editSubcategoria = (subcategoria) => {
      editingSubcategoria.value = subcategoria
      novaSubcategoria.value = {
        nome: subcategoria.nome,
        categoriaId: subcategoria.categoriaId
      }
      
      // Scroll para o formulário
      document.querySelectorAll('.form-section')[1].scrollIntoView({ behavior: 'smooth' })
    }

    const cancelEdit = () => {
      editingCategoria.value = null
      novaCategoria.value.nome = ''
    }

    const cancelSubEdit = () => {
      editingSubcategoria.value = null
      novaSubcategoria.value = { nome: '', categoriaId: '' }
    }

    const deleteCategoria = async (categoriaId) => {
      if (!confirm('Tem certeza que deseja excluir esta categoria? Todas as subcategorias também serão excluídas.')) return

      try {
        // Excluir subcategorias relacionadas
        const subcategoriasRelacionadas = subcategorias.value.filter(s => s.categoriaId === categoriaId)
        for (const sub of subcategoriasRelacionadas) {
          await deleteDoc(doc(db, 'subcategorias', sub.id))
        }

        // Excluir categoria
        await deleteDoc(doc(db, 'categorias', categoriaId))
        
        // Remover das listas locais
        categorias.value = categorias.value.filter(c => c.id !== categoriaId)
        subcategorias.value = subcategorias.value.filter(s => s.categoriaId !== categoriaId)
        
        successMessage.value = 'Categoria e subcategorias excluídas com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao excluir categoria:', error)
        errorMessage.value = 'Erro ao excluir categoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const deleteSubcategoria = async (subcategoriaId) => {
      if (!confirm('Tem certeza que deseja excluir esta subcategoria?')) return

      try {
        await deleteDoc(doc(db, 'subcategorias', subcategoriaId))
        
        // Remover da lista local
        subcategorias.value = subcategorias.value.filter(s => s.id !== subcategoriaId)
        
        successMessage.value = 'Subcategoria excluída com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

      } catch (error) {
        console.error('Erro ao excluir subcategoria:', error)
        errorMessage.value = 'Erro ao excluir subcategoria: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    onMounted(async () => {
      await fetchCategorias()
      await fetchSubcategorias()
    })

    return {
      loading,
      loadingSub,
      loadingCategorias,
      categorias,
      subcategorias,
      novaCategoria,
      novaSubcategoria,
      editingCategoria,
      editingSubcategoria,
      successMessage,
      errorMessage,
      expandedCategories,
      formatDate,
      getSubcategorias,
      getSubcategoryCount,
      toggleCategory,
      addCategoria,
      addSubcategoria,
      editCategoria,
      editSubcategoria,
      cancelEdit,
      cancelSubEdit,
      deleteCategoria,
      deleteSubcategoria
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

.categoria-form,
.subcategoria-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #8C52FF;
  box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-add,
.btn-cancel {
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

.btn-cancel {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
}

.btn-cancel:hover {
  background: rgba(140, 82, 255, 0.15);
}

.btn-add {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
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

.categorias-tree {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-tree-item {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  overflow: hidden;
}

.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(140, 82, 255, 0.05);
  border-bottom: 1px solid rgba(140, 82, 255, 0.1);
}

.categoria-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.categoria-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.expand-btn {
  background: none;
  border: none;
  color: #8C52FF;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: rgba(140, 82, 255, 0.1);
}

.expand-btn.expanded {
  transform: rotate(90deg);
}

.categoria-nome {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

.categoria-count {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
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

.subcategorias-list {
  padding: 0;
}

.subcategoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-bottom: 1px solid rgba(140, 82, 255, 0.05);
  transition: all 0.3s ease;
}

.subcategoria-item:hover {
  background: rgba(140, 82, 255, 0.02);
}

.subcategoria-item:last-child {
  border-bottom: none;
}

.subcategoria-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.subcategoria-nome {
  font-weight: 600;
  color: #555;
  font-size: 1rem;
}

.subcategoria-data {
  color: #666;
  font-size: 0.8rem;
}

.subcategoria-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit-sub,
.btn-delete-sub {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit-sub {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.btn-edit-sub:hover {
  background: rgba(33, 150, 243, 0.2);
}

.btn-delete-sub {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.btn-delete-sub:hover {
  background: rgba(244, 67, 54, 0.2);
}

.no-subcategorias {
  padding: 1rem 1rem 1rem 3rem;
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
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
  .form-section {
    padding: 1.5rem;
    margin: 0 1rem 2rem 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .categoria-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .categoria-actions {
    justify-content: center;
  }
  
  .subcategoria-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 1rem 1rem 1rem 2rem;
  }
  
  .subcategoria-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cadastro-categoria {
    padding: 0 0.5rem;
  }
  
  .form-section {
    padding: 1rem;
    margin: 0 0.5rem 1.5rem 0.5rem;
    border-radius: 8px;
  }
  
  .form-section h3 {
    font-size: 1.1rem;
  }
  
  .form-group input,
  .form-group select {
    padding: 0.6rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  .btn-add,
  .btn-cancel {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  .categoria-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .categoria-nome {
    font-size: 1rem;
  }
  
  .subcategoria-item {
    padding: 0.75rem 0.75rem 0.75rem 1.5rem;
  }
  
  .subcategoria-nome {
    font-size: 0.9rem;
  }
  
  .btn-edit,
  .btn-delete,
  .btn-edit-sub,
  .btn-delete-sub {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

/* Melhorar touch targets para mobile */
@media (max-width: 768px) {
  .expand-btn,
  .mobile-expand-btn {
    min-width: 44px;
    min-height: 44px;
    padding: 0.5rem;
  }
  
  .btn-edit,
  .btn-delete,
  .btn-edit-sub,
  .btn-delete-sub {
    min-width: 44px;
    min-height: 44px;
  }
  
  .category-checkbox,
  .subcategory-checkbox,
  .mobile-category-checkbox,
  .mobile-subcategory-checkbox {
    min-height: 44px;
    padding: 0.5rem 0;
  }
}
</style>
