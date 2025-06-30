<template>
  <div class="cadastro-produto">
    <!-- Header -->
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
              <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          Gerenciar Produtos
        </h2>
        <p class="section-subtitle">Adicione e gerencie produtos da sua loja</p>
      </div>
    </div>

    <!-- Formulário -->
    <div class="form-section">
      <div class="form-header">
        <h3 class="form-title">
          {{ editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto' }}
        </h3>
        <div v-if="editingProduct" class="editing-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Editando
        </div>
      </div>

      <form @submit.prevent="submitProduct" class="produto-form">
        <!-- Upload de Imagens -->
        <div class="form-section-group">
          <h4 class="group-title">Imagens do Produto</h4>
          <div class="images-upload-container">
            <div 
              v-for="(image, index) in productForm.imagens" 
              :key="index"
              class="image-upload-slot"
            >
              <div class="image-upload-area" @click="triggerFileInput(index)">
                <img v-if="image" :src="image" alt="Preview" class="image-preview" />
                <div v-else class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span class="upload-text">Foto {{ index + 1 }}</span>
                </div>
                <button 
                  v-if="image" 
                  type="button" 
                  class="remove-image-btn"
                  @click.stop="removeImage(index)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <input 
                :ref="el => fileInputs[index] = el"
                type="file" 
                accept="image/*" 
                @change="handleImageChange($event, index)" 
                style="display: none"
              />
            </div>
          </div>
          <p class="upload-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/>
            </svg>
            Adicione até 3 fotos do produto. A primeira será a foto principal.
          </p>
        </div>

        <!-- Informações Básicas -->
        <div class="form-section-group">
          <h4 class="group-title">Informações Básicas</h4>
          <div class="form-grid">
            <div class="form-field">
              <label for="nome" class="field-label">Nome do Produto *</label>
              <input
                v-model="productForm.nome"
                type="text"
                id="nome"
                placeholder="Ex: Ração Premium, Brinquedo Interativo"
                required
                @input="generateCodeFromName"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="codigo" class="field-label">Código do Produto *</label>
              <div class="input-with-action">
                <input
                  v-model="productForm.codigo"
                  type="text"
                  id="codigo"
                  placeholder="Ex: RAC001, BRI002"
                  required
                  @input="validateCode"
                  :class="['field-input', { 'error': codeError }]"
                />
                <button 
                  type="button" 
                  class="input-action-btn"
                  @click="generateRandomCode"
                  title="Gerar código automaticamente"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="23,4 23,10 17,10" stroke="currentColor" stroke-width="2"/>
                    <polyline points="1,20 1,14 7,14" stroke="currentColor" stroke-width="2"/>
                    <path d="M20.49 9C19.9828 7.56678 19.1209 6.28392 17.9845 5.27304C16.8482 4.26216 15.4745 3.55682 13.9917 3.21834C12.5089 2.87986 10.9652 2.91902 9.50481 3.33329C8.04437 3.74757 6.71475 4.52306 5.64 5.58L1 10M23 14L18.36 18.42C17.2853 19.477 15.9556 20.2525 14.4952 20.6667C13.0348 21.081 11.4911 21.1201 10.0083 20.7817C8.52547 20.4432 7.1518 19.7378 6.01547 18.727C4.87913 17.7161 4.01717 16.4332 3.51 15" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <div v-if="codeError" class="field-error">{{ codeError }}</div>
              <div v-if="codeSuccess" class="field-success">{{ codeSuccess }}</div>
            </div>

            <div class="form-field">
              <label for="categoria" class="field-label">Categoria *</label>
              <select v-model="productForm.categoriaId" id="categoria" required @change="onCategoryChange" class="field-select">
                <option value="">Selecione uma categoria</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nome }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label for="subcategoria" class="field-label">Subcategoria</label>
              <select v-model="productForm.subcategoriaId" id="subcategoria" :disabled="!productForm.categoriaId" class="field-select">
                <option value="">Selecione uma subcategoria (opcional)</option>
                <option v-for="subcategoria in filteredSubcategorias" :key="subcategoria.id" :value="subcategoria.id">
                  {{ subcategoria.nome }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label for="preco" class="field-label">Preço (R$) *</label>
              <input
                v-model="productForm.preco"
                type="number"
                id="preco"
                step="0.01"
                min="0"
                placeholder="0,00"
                required
                @input="calculateDiscountPrice"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="estoque" class="field-label">Estoque *</label>
              <input
                v-model="productForm.estoque"
                type="number"
                id="estoque"
                min="0"
                placeholder="0"
                required
                class="field-input"
              />
            </div>
          </div>
        </div>

        <!-- Seção de Oferta -->
        <div class="form-section-group">
          <h4 class="group-title">Promoções</h4>
          <div class="checkbox-field">
            <label class="checkbox-label">
              <input
                v-model="productForm.emOferta"
                type="checkbox"
                @change="onOfertaChange"
                class="checkbox-input"
              />
              <div class="checkbox-custom">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="3"/>
                </svg>
              </div>
              <span class="checkbox-text">Este produto está em oferta</span>
            </label>
          </div>

          <div v-if="productForm.emOferta" class="offer-section">
            <div class="form-field">
              <label for="percentual-desconto" class="field-label">Percentual de Desconto (%) *</label>
              <input
                v-model="productForm.percentualDesconto"
                type="number"
                id="percentual-desconto"
                min="1"
                max="99"
                placeholder="15"
                required
                @input="calculateDiscountPrice"
                class="field-input"
              />
            </div>
            
            <div v-if="calculatedPrice" class="price-preview">
              <div class="price-preview-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Prévia de Preços
              </div>
              <div class="price-calculation">
                <div class="price-item original">
                  <span class="price-label">Preço Original:</span>
                  <span class="price-value">R$ {{ formatPrice(productForm.preco) }}</span>
                </div>
                <div class="price-item sale">
                  <span class="price-label">Preço com Desconto:</span>
                  <span class="price-value">R$ {{ formatPrice(calculatedPrice) }}</span>
                </div>
                <div class="price-item savings">
                  <span class="price-label">Economia:</span>
                  <span class="price-value">R$ {{ formatPrice(productForm.preco - calculatedPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Descrições -->
        <div class="form-section-group">
          <h4 class="group-title">Descrições</h4>
          <div class="form-field">
            <label for="descricao" class="field-label">Descrição Resumida</label>
            <textarea
              v-model="productForm.descricao"
              id="descricao"
              placeholder="Descreva as características e benefícios do produto"
              rows="4"
              class="field-textarea"
            ></textarea>
          </div>

          <div class="form-field">
            <label for="descricao-completa" class="field-label">Descrição Completa</label>
            <textarea
              v-model="productForm.descricaoCompleta"
              id="descricao-completa"
              placeholder="Descrição detalhada do produto para exibir no modal"
              rows="6"
              class="field-textarea"
            ></textarea>
          </div>
        </div>

        <!-- Botões -->
        <div class="form-actions">
          <button 
            v-if="editingProduct"
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
          
          <button type="submit" class="btn primary" :disabled="loading || !!codeError">
            <svg v-if="loading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
              <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
              <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loading ? 'Salvando...' : (editingProduct ? 'Atualizar Produto' : 'Adicionar Produto') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Produtos -->
    <div class="produtos-section">
      <div class="produtos-header">
        <div class="header-content">
          <h3 class="produtos-title">Produtos Cadastrados</h3>
          <p class="produtos-subtitle">{{ filteredProducts.length }} produto(s) encontrado(s)</p>
        </div>
        
        <!-- Filtros -->
        <div class="produtos-filters">
          <div class="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome ou código..."
              class="search-input"
            />
          </div>
          
          <select v-model="filterCategory" class="filter-select">
            <option value="">Todas as categorias</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nome }}
            </option>
          </select>
          
          <select v-model="filterSubcategory" class="filter-select" :disabled="!filterCategory">
            <option value="">Todas as subcategorias</option>
            <option v-for="subcategoria in getSubcategoriasByCategory(filterCategory)" :key="subcategoria.id" :value="subcategoria.id">
              {{ subcategoria.nome }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loadingProducts" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando produtos...</p>
      </div>

      <!-- Grid de Produtos -->
      <div v-else-if="filteredProducts.length > 0" class="produtos-grid">
        <div v-for="produto in filteredProducts" :key="produto.id" class="produto-card">
          <div class="produto-image">
            <img :src="produto.imagem || placeholderImage" :alt="produto.nome" />
            <div v-if="produto.emOferta" class="discount-badge">
              -{{ produto.percentualDesconto }}%
            </div>
            <div class="produto-actions">
              <button 
                @click="editProduct(produto)"
                class="action-btn edit"
                title="Editar produto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <button 
                @click="deleteProduct(produto.id)"
                class="action-btn delete"
                title="Excluir produto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                  <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="produto-content">
            <div class="produto-header">
              <div class="produto-categories">
                <span class="categoria-tag">{{ getCategoryName(produto.categoriaId) }}</span>
                <span v-if="produto.subcategoriaId" class="subcategoria-tag">
                  {{ getSubcategoryName(produto.subcategoriaId) }}
                </span>
              </div>
              <div class="produto-codigo">{{ produto.codigo }}</div>
            </div>
            
            <h4 class="produto-nome">{{ produto.nome }}</h4>
            <p v-if="produto.descricao" class="produto-descricao">{{ produto.descricao }}</p>
            
            <div class="produto-footer">
              <div class="produto-estoque">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ produto.estoque || 0 }} em estoque
              </div>
              
              <div class="produto-pricing">
                <div v-if="produto.emOferta" class="price-with-discount">
                  <span class="original-price">R$ {{ formatPrice(produto.precoOriginal) }}</span>
                  <span class="sale-price">R$ {{ formatPrice(produto.preco) }}</span>
                </div>
                <div v-else class="regular-price">
                  R$ {{ formatPrice(produto.preco) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ searchTerm || filterCategory || filterSubcategory ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado' }}
        </h3>
        <p class="empty-description">
          {{ searchTerm || filterCategory || filterSubcategory 
            ? 'Tente ajustar os filtros para encontrar produtos' 
            : 'Adicione o primeiro produto usando o formulário acima' }}
        </p>
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
import { ref, computed, onMounted, watch } from 'vue'
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
  name: 'CadastroProduto',
  setup() {
    const loading = ref(false)
    const loadingProducts = ref(true)
    const produtos = ref([])
    const categorias = ref([])
    const subcategorias = ref([])
    const editingProduct = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const placeholderImage = 'https://via.placeholder.com/300x200/9333ea/FFFFFF?text=Produto'
    const filterCategory = ref('')
    const filterSubcategory = ref('')
    const searchTerm = ref('')
    const fileInputs = ref([])
    const codeError = ref('')
    const codeSuccess = ref('')

    const productForm = ref({
      nome: '',
      codigo: '',
      descricao: '',
      descricaoCompleta: '',
      preco: '',
      estoque: '',
      categoriaId: '',
      subcategoriaId: '',
      imagens: ['', '', ''],
      emOferta: false,
      percentualDesconto: ''
    })

    const calculatedPrice = computed(() => {
      if (productForm.value.emOferta && productForm.value.preco && productForm.value.percentualDesconto) {
        const originalPrice = parseFloat(productForm.value.preco)
        const discount = parseFloat(productForm.value.percentualDesconto)
        return originalPrice - (originalPrice * discount / 100)
      }
      return null
    })

    const filteredSubcategorias = computed(() => {
      if (!productForm.value.categoriaId) return []
      return subcategorias.value.filter(sub => sub.categoriaId === productForm.value.categoriaId)
    })

    const filteredProducts = computed(() => {
      let filtered = produtos.value

      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase()
        filtered = filtered.filter(produto => 
          produto.nome.toLowerCase().includes(search) ||
          produto.codigo.toLowerCase().includes(search)
        )
      }

      if (filterCategory.value) {
        filtered = filtered.filter(produto => produto.categoriaId === filterCategory.value)
      }

      if (filterSubcategory.value) {
        filtered = filtered.filter(produto => produto.subcategoriaId === filterSubcategory.value)
      }

      return filtered
    })

    const generateCodeFromName = () => {
      if (productForm.value.nome && !editingProduct.value) {
        const nome = productForm.value.nome.trim()
        if (nome.length >= 3) {
          const prefix = nome.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '')
          const number = Math.floor(Math.random() * 999) + 1
          productForm.value.codigo = prefix + number.toString().padStart(3, '0')
        }
      }
    }

    const generateRandomCode = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const prefix = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')
      const number = Math.floor(Math.random() * 999) + 1
      productForm.value.codigo = prefix + number.toString().padStart(3, '0')
      validateCode()
    }

    const validateCode = async () => {
      codeError.value = ''
      codeSuccess.value = ''
      
      if (!productForm.value.codigo) return
      
      const codigo = productForm.value.codigo.trim().toUpperCase()
      productForm.value.codigo = codigo
      
      if (!/^[A-Z]{3}\d{3}$/.test(codigo)) {
        codeError.value = 'Código deve ter formato: 3 letras + 3 números (ex: ABC123)'
        return
      }
      
      const existingProduct = produtos.value.find(p => 
        p.codigo === codigo && (!editingProduct.value || p.id !== editingProduct.value.id)
      )
      
      if (existingProduct) {
        codeError.value = 'Este código já está sendo usado por outro produto'
      } else {
        codeSuccess.value = 'Código disponível'
        setTimeout(() => { codeSuccess.value = '' }, 2000)
      }
    }

    watch(() => productForm.value.codigo, () => {
      if (productForm.value.codigo) {
        validateCode()
      }
    })

    const calculateDiscountPrice = () => {
      if (productForm.value.emOferta && productForm.value.preco && productForm.value.percentualDesconto) {
        const originalPrice = parseFloat(productForm.value.preco)
        const discount = parseFloat(productForm.value.percentualDesconto)
        return originalPrice - (originalPrice * discount / 100)
      }
    }

    const onOfertaChange = () => {
      if (!productForm.value.emOferta) {
        productForm.value.percentualDesconto = ''
      }
    }

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const getCategoryName = (categoryId) => {
      const categoria = categorias.value.find(c => c.id === categoryId)
      return categoria ? categoria.nome : 'Categoria não encontrada'
    }

    const getSubcategoryName = (subcategoryId) => {
      const subcategoria = subcategorias.value.find(s => s.id === subcategoryId)
      return subcategoria ? subcategoria.nome : 'Subcategoria não encontrada'
    }

    const getSubcategoriasByCategory = (categoryId) => {
      if (!categoryId) return []
      return subcategorias.value.filter(sub => sub.categoriaId === categoryId)
    }

    const onCategoryChange = () => {
      productForm.value.subcategoriaId = ''
      filterSubcategory.value = ''
    }

    const triggerFileInput = (index) => {
      fileInputs.value[index]?.click()
    }

    const handleImageChange = async (event, index) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Por favor, selecione apenas arquivos de imagem'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = 'A imagem deve ter no máximo 5MB'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      try {
        const base64 = await convertToBase64(file)
        productForm.value.imagens[index] = base64
        errorMessage.value = ''
      } catch (err) {
        errorMessage.value = 'Erro ao processar imagem: ' + err.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          let { width, height } = img
          const maxWidth = 800
          const maxHeight = 600
          
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height
            
            if (aspectRatio > 1) {
              width = maxWidth
              height = width / aspectRatio
            } else {
              height = maxHeight
              width = height * aspectRatio
            }
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          const base64 = canvas.toDataURL('image/jpeg', 0.8)
          resolve(base64)
        }
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'))
        
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
    }

    const removeImage = (index) => {
      productForm.value.imagens[index] = ''
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
      }
    }

    const fetchProdutos = async () => {
      try {
        const produtosQuery = query(
          collection(db, 'produtos'),
          orderBy('nome', 'asc')
        )
        
        const querySnapshot = await getDocs(produtosQuery)
        const fetchedProdutos = []
        
        querySnapshot.forEach((doc) => {
          fetchedProdutos.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        produtos.value = fetchedProdutos
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
        errorMessage.value = 'Erro ao carregar produtos'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingProducts.value = false
      }
    }

    const submitProduct = async () => {
      if (!productForm.value.nome.trim() || !productForm.value.codigo.trim() || !productForm.value.categoriaId || !productForm.value.preco || !productForm.value.estoque) {
        errorMessage.value = 'Preencha todos os campos obrigatórios'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      if (codeError.value) {
        errorMessage.value = 'Corrija o erro no código do produto'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      if (productForm.value.emOferta && !productForm.value.percentualDesconto) {
        errorMessage.value = 'Informe o percentual de desconto para produtos em oferta'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      loading.value = true
      try {
        const categoria = categorias.value.find(c => c.id === productForm.value.categoriaId)
        const subcategoria = subcategorias.value.find(s => s.id === productForm.value.subcategoriaId)
        
        const originalPrice = parseFloat(productForm.value.preco)
        let finalPrice = originalPrice
        
        if (productForm.value.emOferta && productForm.value.percentualDesconto) {
          const discount = parseFloat(productForm.value.percentualDesconto)
          finalPrice = originalPrice - (originalPrice * discount / 100)
        }
        
        const productData = {
          nome: productForm.value.nome.trim(),
          codigo: productForm.value.codigo.trim().toUpperCase(),
          descricao: productForm.value.descricao.trim(),
          descricaoCompleta: productForm.value.descricaoCompleta.trim(),
          preco: finalPrice,
          precoOriginal: productForm.value.emOferta ? originalPrice : null,
          estoque: parseInt(productForm.value.estoque),
          categoriaId: productForm.value.categoriaId,
          categoria: categoria ? categoria.nome : '',
          subcategoriaId: productForm.value.subcategoriaId || null,
          subcategoria: subcategoria ? subcategoria.nome : '',
          imagem: productForm.value.imagens[0] || '',
          imagens: productForm.value.imagens.filter(img => img),
          emOferta: productForm.value.emOferta,
          percentualDesconto: productForm.value.emOferta ? parseInt(productForm.value.percentualDesconto) : null,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        }

        if (editingProduct.value) {
          await updateDoc(doc(db, 'produtos', editingProduct.value.id), {
            ...productData,
            criadoEm: editingProduct.value.criadoEm
          })

          const index = produtos.value.findIndex(p => p.id === editingProduct.value.id)
          if (index !== -1) {
            produtos.value[index] = {
              id: editingProduct.value.id,
              ...productData,
              criadoEm: editingProduct.value.criadoEm,
              atualizadoEm: new Date()
            }
          }

          successMessage.value = 'Produto atualizado com sucesso!'
          editingProduct.value = null
        } else {
          const docRef = await addDoc(collection(db, 'produtos'), productData)
          
          produtos.value.push({
            id: docRef.id,
            ...productData,
            criadoEm: new Date(),
            atualizadoEm: new Date()
          })

          successMessage.value = 'Produto adicionado com sucesso!'
        }

        produtos.value.sort((a, b) => a.nome.localeCompare(b.nome))

        productForm.value = {
          nome: '',
          codigo: '',
          descricao: '',
          descricaoCompleta: '',
          preco: '',
          estoque: '',
          categoriaId: '',
          subcategoriaId: '',
          imagens: ['', '', ''],
          emOferta: false,
          percentualDesconto: ''
        }
        
        codeError.value = ''
        codeSuccess.value = ''
        
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao salvar produto:', error)
        errorMessage.value = 'Erro ao salvar produto: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loading.value = false
      }
    }

    const editProduct = (produto) => {
      editingProduct.value = produto
      
      const imagens = ['', '', '']
      if (produto.imagens && Array.isArray(produto.imagens)) {
        produto.imagens.forEach((img, index) => {
          if (index < 3) imagens[index] = img
        })
      } else if (produto.imagem) {
        imagens[0] = produto.imagem
      }
      
      let precoOriginal = produto.preco
      if (produto.emOferta && produto.precoOriginal) {
        precoOriginal = produto.precoOriginal
      }
      
      productForm.value = {
        nome: produto.nome,
        codigo: produto.codigo || '',
        descricao: produto.descricao || '',
        descricaoCompleta: produto.descricaoCompleta || '',
        preco: precoOriginal.toString(),
        estoque: (produto.estoque || 0).toString(),
        categoriaId: produto.categoriaId,
        subcategoriaId: produto.subcategoriaId || '',
        imagens: imagens,
        emOferta: produto.emOferta || false,
        percentualDesconto: produto.percentualDesconto ? produto.percentualDesconto.toString() : ''
      }
      
      codeError.value = ''
      codeSuccess.value = ''
      
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const cancelEdit = () => {
      editingProduct.value = null
      productForm.value = {
        nome: '',
        codigo: '',
        descricao: '',
        descricaoCompleta: '',
        preco: '',
        estoque: '',
        categoriaId: '',
        subcategoriaId: '',
        imagens: ['', '', ''],
        emOferta: false,
        percentualDesconto: ''
      }
      codeError.value = ''
      codeSuccess.value = ''
    }

    const deleteProduct = async (productId) => {
      if (!confirm('Tem certeza que deseja excluir este produto?')) return

      try {
        await deleteDoc(doc(db, 'produtos', productId))
        produtos.value = produtos.value.filter(p => p.id !== productId)
        successMessage.value = 'Produto excluído com sucesso!'
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        errorMessage.value = 'Erro ao excluir produto: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    onMounted(async () => {
      await Promise.all([
        fetchCategorias(),
        fetchSubcategorias(),
        fetchProdutos()
      ])
    })

    return {
      loading,
      loadingProducts,
      produtos,
      categorias,
      subcategorias,
      editingProduct,
      productForm,
      successMessage,
      errorMessage,
      fileInputs,
      placeholderImage,
      filterCategory,
      filterSubcategory,
      searchTerm,
      filteredSubcategorias,
      filteredProducts,
      calculatedPrice,
      codeError,
      codeSuccess,
      formatPrice,
      getCategoryName,
      getSubcategoryName,
      getSubcategoriasByCategory,
      onCategoryChange,
      triggerFileInput,
      handleImageChange,
      removeImage,
      submitProduct,
      editProduct,
      cancelEdit,
      deleteProduct,
      onOfertaChange,
      calculateDiscountPrice,
      generateCodeFromName,
      generateRandomCode,
      validateCode
    }
  }
}
</script>

<style scoped>
.cadastro-produto {
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

.produto-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Form Section Groups */
.form-section-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.group-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Image Upload */
.images-upload-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.image-upload-slot {
  display: flex;
  flex-direction: column;
}

.image-upload-area {
  position: relative;
  width: 100%;
  height: 160px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.image-upload-area:hover {
  border-color: #9333ea;
  background: #faf5ff;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.upload-placeholder svg {
  color: #9333ea;
}

.upload-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.upload-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.75rem;
  font-weight: 500;
}

.upload-hint svg {
  color: #9333ea;
  flex-shrink: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Form Fields */
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
.field-select,
.field-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.field-input.error {
  border-color: #dc2626;
  background: #fef2f2;
}

.field-select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Input with Action */
.input-with-action {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-action .field-input {
  padding-right: 3rem;
}

.input-action-btn {
  position: absolute;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #9333ea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.input-action-btn:hover {
  background: #7c3aed;
  transform: scale(1.05);
}

/* Field Messages */
.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.field-success {
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Checkbox */
.checkbox-field {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-input:checked + .checkbox-custom {
  background: #9333ea;
  border-color: #9333ea;
  color: white;
}

.checkbox-input:not(:checked) + .checkbox-custom svg {
  display: none;
}

/* Offer Section */
.offer-section {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #f59e0b;
}

/* Price Preview */
.price-preview {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.price-preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.price-preview-header svg {
  color: #9333ea;
}

.price-calculation {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.price-item.original .price-value {
  color: #9ca3af;
  text-decoration: line-through;
}

.price-item.sale .price-value {
  color: #9333ea;
  font-weight: 700;
  font-size: 1.125rem;
}

.price-item.savings .price-value {
  color: #059669;
  font-weight: 700;
}

.price-label {
  font-weight: 500;
  color: #6b7280;
}

.price-value {
  font-weight: 600;
  color: #111827;
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

/* Produtos Section */
.produtos-section {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.produtos-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.produtos-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.produtos-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

/* Filters */
.produtos-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  min-width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  min-width: 160px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.filter-select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
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

/* Produtos Grid */
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.produto-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.produto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Produto Image */
.produto-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f9fafb;
}

.produto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.produto-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.produto-card:hover .produto-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.9);
  color: white;
}

.action-btn.edit:hover {
  background: #3b82f6;
  transform: scale(1.1);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.action-btn.delete:hover {
  background: #ef4444;
  transform: scale(1.1);
}

/* Produto Content */
.produto-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.produto-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.produto-categories {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.categoria-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.subcategoria-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.produto-codigo {
  background: #f9fafb;
  color: #6b7280;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid #e5e7eb;
}

.produto-nome {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.produto-descricao {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Produto Footer */
.produto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.produto-estoque {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.produto-estoque svg {
  color: #9333ea;
}

.produto-pricing {
  text-align: right;
}

.price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.original-price {
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
}

.sale-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #9333ea;
}

.regular-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #9333ea;
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

  .images-upload-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .produtos-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .filter-select {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .cadastro-produto {
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

  .images-upload-container {
    grid-template-columns: 1fr;
  }

  .image-upload-area {
    height: 140px;
  }

  .form-actions {
    flex-direction: column;
  }

  .produtos-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .produtos-grid {
    grid-template-columns: 1fr;
  }

  .produto-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .produto-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .produto-pricing {
    text-align: left;
  }

  .price-with-discount {
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }

  .group-title {
    font-size: 1rem;
  }

  .field-input,
  .field-select,
  .field-textarea {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .produto-content {
    padding: 1rem;
  }

  .produto-nome {
    font-size: 1rem;
  }

  .sale-price,
  .regular-price {
    font-size: 1.125rem;
  }

  .offer-section {
    padding: 1rem;
  }

  .price-preview {
    padding: 1rem;
  }
}
</style>