<template>
  <div class="cadastro-categoria">
    <!-- Header -->
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
              <path d="M7 7V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          Gerenciar Categorias
        </h2>
        <p class="section-subtitle">Organize produtos em categorias e subcategorias</p>
      </div>
    </div>

    <!-- Formulário de Categoria -->
    <div class="form-section">
      <div class="form-header">
        <h3 class="form-title">
          {{ editingCategoria ? 'Editar Categoria' : 'Nova Categoria' }}
        </h3>
        <div v-if="editingCategoria" class="editing-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Editando
        </div>
      </div>

      <form @submit.prevent="addCategoria" class="categoria-form">
        <div class="form-field">
          <label for="nome" class="field-label">Nome da Categoria *</label>
          <input
            v-model="novaCategoria.nome"
            type="text"
            id="nome"
            placeholder="Ex: Ração, Brinquedos, Acessórios"
            required
            class="field-input"
          />
        </div>
        
        <div class="form-actions">
          <button 
            v-if="editingCategoria"
            type="button" 
            @click="cancelEdit" 
            class="btn secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
            Cancelar
          </button>
          
          <button type="submit" class="btn primary" :disabled="loading">
            <svg v-if="loading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loading ? 'Salvando...' : (editingCategoria ? 'Atualizar Categoria' : 'Adicionar Categoria') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Formulário de Subcategoria -->
    <div class="form-section">
      <div class="form-header">
        <h3 class="form-title">
          {{ editingSubcategoria ? 'Editar Subcategoria' : 'Nova Subcategoria' }}
        </h3>
        <div v-if="editingSubcategoria" class="editing-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Editando
        </div>
      </div>

      <form @submit.prevent="addSubcategoria" class="subcategoria-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="categoria-pai" class="field-label">Categoria Pai *</label>
            <select v-model="novaSubcategoria.categoriaId" id="categoria-pai" required class="field-select">
              <option value="">Selecione uma categoria</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nome }}
              </option>
            </select>
          </div>
          
          <div class="form-field">
            <label for="nome-sub" class="field-label">Nome da Subcategoria *</label>
            <input
              v-model="novaSubcategoria.nome"
              type="text"
              id="nome-sub"
              placeholder="Ex: Peitorais, Guias, Coleiras"
              required
              class="field-input"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            v-if="editingSubcategoria"
            type="button" 
            @click="cancelSubEdit" 
            class="btn secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
            Cancelar
          </button>
          
          <button type="submit" class="btn primary" :disabled="loadingSub">
            <svg v-if="loadingSub" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loadingSub ? 'Salvando...' : (editingSubcategoria ? 'Atualizar Subcategoria' : 'Adicionar Subcategoria') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Categorias -->
    <div class="categorias-section">
      <div class="categorias-header">
        <div class="header-content">
          <h3 class="categorias-title">Categorias e Subcategorias</h3>
          <p class="categorias-subtitle">{{ categorias.length }} categoria(s) cadastrada(s)</p>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loadingCategorias" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando categorias...</p>
      </div>

      <!-- Tree de Categorias -->
      <div v-else-if="categorias.length > 0" class="categorias-tree">
        <div v-for="categoria in categorias" :key="categoria.id" class="categoria-tree-item">
          <!-- Categoria Principal -->
          <div class="categoria-item">
            <div class="categoria-content">
              <button 
                @click="toggleCategory(categoria.id)"
                class="expand-btn"
                :class="{ expanded: expandedCategories.includes(categoria.id) }"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="9,18 15,12 9,6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <div class="categoria-info">
                <div class="categoria-header">
                  <h4 class="categoria-nome">{{ categoria.nome }}</h4>
                  <span class="categoria-count">
                    {{ getSubcategoryCount(categoria.id) }} subcategoria(s)
                  </span>
                </div>
                <span class="categoria-data">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Criada em {{ formatDate(categoria.criadoEm) }}
                </span>
              </div>
            </div>
            
            <div class="categoria-actions">
              <button 
                @click="editCategoria(categoria)"
                class="action-btn edit"
                title="Editar categoria"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <button 
                @click="deleteCategoria(categoria.id)"
                class="action-btn delete"
                title="Excluir categoria"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                  <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
                </svg>
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
              <div class="subcategoria-content">
                <div class="subcategoria-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <div class="subcategoria-info">
                  <h5 class="subcategoria-nome">{{ subcategoria.nome }}</h5>
                  <span class="subcategoria-data">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Criada em {{ formatDate(subcategoria.criadoEm) }}
                  </span>
                </div>
              </div>
              
              <div class="subcategoria-actions">
                <button 
                  @click="editSubcategoria(subcategoria)"
                  class="action-btn edit small"
                  title="Editar subcategoria"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  @click="deleteSubcategoria(subcategoria.id)"
                  class="action-btn delete small"
                  title="Excluir subcategoria"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                    <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div v-if="getSubcategorias(categoria.id).length === 0" class="no-subcategorias">
              <div class="empty-subcategoria-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12H16" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="empty-subcategoria-text">Nenhuma subcategoria encontrada</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 7V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3 class="empty-title">Nenhuma categoria encontrada</h3>
        <p class="empty-description">Adicione a primeira categoria usando o formulário acima</p>
      </div>
    </div>

    <!-- Notificações -->
    <div v-if="successMessage" class="notification success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="notification error">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
      </svg>
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
          await updateDoc(doc(db, 'categorias', editingCategoria.value.id), {
            nome: novaCategoria.value.nome.trim()
          })

          const index = categorias.value.findIndex(c => c.id === editingCategoria.value.id)
          if (index !== -1) {
            categorias.value[index].nome = novaCategoria.value.nome.trim()
          }

          successMessage.value = 'Categoria atualizada com sucesso!'
          editingCategoria.value = null
        } else {
          const docRef = await addDoc(collection(db, 'categorias'), categoriaData)
          
          categorias.value.push({
            id: docRef.id,
            ...categoriaData,
            criadoEm: new Date()
          })

          successMessage.value = 'Categoria adicionada com sucesso!'
        }

        categorias.value.sort((a, b) => a.nome.localeCompare(b.nome))
        novaCategoria.value.nome = ''
        
        setTimeout(() => { successMessage.value = '' }, 3000)
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
          await updateDoc(doc(db, 'subcategorias', editingSubcategoria.value.id), {
            nome: novaSubcategoria.value.nome.trim(),
            categoriaId: novaSubcategoria.value.categoriaId
          })

          const index = subcategorias.value.findIndex(s => s.id === editingSubcategoria.value.id)
          if (index !== -1) {
            subcategorias.value[index].nome = novaSubcategoria.value.nome.trim()
            subcategorias.value[index].categoriaId = novaSubcategoria.value.categoriaId
          }

          successMessage.value = 'Subcategoria atualizada com sucesso!'
          editingSubcategoria.value = null
        } else {
          const docRef = await addDoc(collection(db, 'subcategorias'), subcategoriaData)
          
          subcategorias.value.push({
            id: docRef.id,
            ...subcategoriaData,
            criadoEm: new Date()
          })

          successMessage.value = 'Subcategoria adicionada com sucesso!'
        }

        subcategorias.value.sort((a, b) => a.nome.localeCompare(b.nome))
        novaSubcategoria.value = { nome: '', categoriaId: '' }
        
        setTimeout(() => { successMessage.value = '' }, 3000)
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
      
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const editSubcategoria = (subcategoria) => {
      editingSubcategoria.value = subcategoria
      novaSubcategoria.value = {
        nome: subcategoria.nome,
        categoriaId: subcategoria.categoriaId
      }
      
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
        const subcategoriasRelacionadas = subcategorias.value.filter(s => s.categoriaId === categoriaId)
        for (const sub of subcategoriasRelacionadas) {
          await deleteDoc(doc(db, 'subcategorias', sub.id))
        }

        await deleteDoc(doc(db, 'categorias', categoriaId))
        
        categorias.value = categorias.value.filter(c => c.id !== categoriaId)
        subcategorias.value = subcategorias.value.filter(s => s.categoriaId !== categoriaId)
        
        successMessage.value = 'Categoria e subcategorias excluídas com sucesso!'
        setTimeout(() => { successMessage.value = '' }, 3000)
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
        subcategorias.value = subcategorias.value.filter(s => s.id !== subcategoriaId)
        
        successMessage.value = 'Subcategoria excluída com sucesso!'
        setTimeout(() => { successMessage.value = '' }, 3000)
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.section-header {
  margin-bottom: 2rem;
}

.header-content {
  max-width: 600px;
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

/* Form Section */
.form-section {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.editing-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Forms */
.categoria-form,
.subcategoria-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field-input,
.field-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
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

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-1px);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Categorias Section */
.categorias-section {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.categorias-header {
  margin-bottom: 2rem;
}

.categorias-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.categorias-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

/* Loading State */
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

.loading-text {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Categorias Tree */
.categorias-tree {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-tree-item {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.categoria-tree-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Categoria Item */
.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e5e7eb;
}

.categoria-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.expand-btn:hover {
  background: #f3f4f6;
  border-color: #9333ea;
  color: #9333ea;
}

.expand-btn.expanded {
  transform: rotate(90deg);
  background: #9333ea;
  border-color: #9333ea;
  color: white;
}

.categoria-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.categoria-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.categoria-nome {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.categoria-count {
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.categoria-data {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.categoria-data svg {
  color: #9333ea;
}

/* Categoria Actions */
.categoria-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.small {
  width: 32px;
  height: 32px;
}

.action-btn.edit {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.edit:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Subcategorias */
.subcategorias-list {
  background: #fafafa;
}

.subcategoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 1rem 3rem;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.subcategoria-item:hover {
  background: #f3f4f6;
}

.subcategoria-item:last-child {
  border-bottom: none;
}

.subcategoria-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.subcategoria-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #d1fae5;
  color: #059669;
  border-radius: 6px;
}

.subcategoria-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.subcategoria-nome {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.subcategoria-data {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.subcategoria-data svg {
  color: #9333ea;
}

.subcategoria-actions {
  display: flex;
  gap: 0.5rem;
}

/* Empty States */
.no-subcategorias {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem 2rem 3rem;
  color: #9ca3af;
  font-style: italic;
}

.empty-subcategoria-icon {
  color: #d1d5db;
}

.empty-subcategoria-text {
  font-size: 0.875rem;
  font-weight: 500;
}

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
  line-height: 1.5;
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

.notification.error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cadastro-categoria {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .title-icon {
    width: 36px;
    height: 36px;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .categoria-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .categoria-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .categoria-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .categoria-actions {
    justify-content: center;
  }

  .subcategoria-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem 1.5rem 1rem 2rem;
  }

  .subcategoria-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .subcategoria-actions {
    justify-content: center;
  }

  .no-subcategorias {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
    padding: 2rem 1.5rem 2rem 2rem;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.125rem;
  }

  .field-input,
  .field-select {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .categoria-nome {
    font-size: 1rem;
  }

  .subcategoria-nome {
    font-size: 0.875rem;
  }

  .action-btn {
    width: 40px;
    height: 40px;
  }

  .action-btn.small {
    width: 36px;
    height: 36px;
  }
}
</style>