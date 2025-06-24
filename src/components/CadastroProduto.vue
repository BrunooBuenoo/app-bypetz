<template>
  <div class="cadastro-produto">
    <div class="section-header">
      <h2>
        <i class="fas fa-box"></i>
        Gerenciar Produtos
      </h2>
    </div>

    <!-- Formulário para novo produto -->
    <div class="form-section">
      <h3>{{ editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto' }}</h3>
      
      <form @submit.prevent="submitProduct" class="produto-form">
        <!-- Upload de Múltiplas Imagens -->
        <div class="form-group images-upload-group">
          <label>Imagens do Produto (até 3 fotos)</label>
          <div class="images-upload-container">
            <div 
              v-for="(image, index) in productForm.imagens" 
              :key="index"
              class="image-upload-slot"
            >
              <div class="image-upload-area" @click="triggerFileInput(index)">
                <img v-if="image" :src="image" alt="Preview" class="image-preview" />
                <div v-else class="upload-placeholder">
                  <i class="fas fa-camera"></i>
                  <span>Foto {{ index + 1 }}</span>
                </div>
                <button 
                  v-if="image" 
                  type="button" 
                  class="remove-image-btn"
                  @click.stop="removeImage(index)"
                >
                  <i class="fas fa-times"></i>
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
          <p class="upload-hint">Adicione até 3 fotos do produto. A primeira será a foto principal.</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="nome">Nome do Produto *</label>
            <input
              v-model="productForm.nome"
              type="text"
              id="nome"
              placeholder="Ex: Ração Premium, Brinquedo Interativo"
              required
              @input="generateCodeFromName"
            />
          </div>

          <div class="form-group">
            <label for="codigo">Código do Produto *</label>
            <div class="codigo-input-container">
              <input
                v-model="productForm.codigo"
                type="text"
                id="codigo"
                placeholder="Ex: RAC001, BRI002"
                required
                @input="validateCode"
                :class="{ 'error': codeError }"
              />
              <button 
                type="button" 
                class="generate-code-btn"
                @click="generateRandomCode"
                title="Gerar código automaticamente"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
            <div v-if="codeError" class="error-message">{{ codeError }}</div>
            <div v-if="codeSuccess" class="success-message">{{ codeSuccess }}</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categoria">Categoria *</label>
            <select v-model="productForm.categoriaId" id="categoria" required @change="onCategoryChange">
              <option value="">Selecione uma categoria</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nome }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="subcategoria">Subcategoria</label>
            <select v-model="productForm.subcategoriaId" id="subcategoria" :disabled="!productForm.categoriaId">
              <option value="">Selecione uma subcategoria (opcional)</option>
              <option v-for="subcategoria in filteredSubcategorias" :key="subcategoria.id" :value="subcategoria.id">
                {{ subcategoria.nome }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="preco">Preço (R$) *</label>
            <input
              v-model="productForm.preco"
              type="number"
              id="preco"
              step="0.01"
              min="0"
              placeholder="0,00"
              required
              @input="calculateDiscountPrice"
            />
          </div>

          <div class="form-group">
            <label for="estoque">Estoque *</label>
            <input
              v-model="productForm.estoque"
              type="number"
              id="estoque"
              min="0"
              placeholder="0"
              required
            />
          </div>
        </div>

        <!-- Seção de Oferta -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="productForm.emOferta"
              type="checkbox"
              @change="onOfertaChange"
            />
            <span class="checkbox-custom"></span>
            Este produto está em oferta
          </label>
        </div>

        <div v-if="productForm.emOferta" class="offer-section">
          <div class="form-group">
            <label for="percentual-desconto">Percentual de Desconto (%) *</label>
            <input
              v-model="productForm.percentualDesconto"
              type="number"
              id="percentual-desconto"
              min="1"
              max="99"
              placeholder="15"
              required
              @input="calculateDiscountPrice"
            />
          </div>
          
          <div v-if="calculatedPrice" class="price-preview">
            <div class="price-calculation">
              <span class="original-price-preview">De: R$ {{ formatPrice(productForm.preco) }}</span>
              <span class="sale-price-preview">Por: R$ {{ formatPrice(calculatedPrice) }}</span>
              <span class="savings">Economia: R$ {{ formatPrice(productForm.preco - calculatedPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea
            v-model="productForm.descricao"
            id="descricao"
            placeholder="Descreva as características e benefícios do produto"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="descricao-completa">Descrição Completa</label>
          <textarea
            v-model="productForm.descricaoCompleta"
            id="descricao-completa"
            placeholder="Descrição detalhada do produto para exibir no modal"
            rows="6"
          ></textarea>
        </div>

        <div class="form-buttons">
          <button 
            v-if="editingProduct"
            type="button" 
            @click="cancelEdit" 
            class="btn-cancel"
          >
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          
          <button type="submit" class="btn-submit" :disabled="loading || !!codeError">
            <i class="fas fa-save"></i>
            {{ loading ? 'Salvando...' : (editingProduct ? 'Atualizar Produto' : 'Adicionar Produto') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de produtos -->
    <div class="produtos-section">
      <div class="produtos-header">
        <h3>Produtos Cadastrados</h3>
        
        <!-- Filtros -->
        <div class="produtos-filters">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nome ou código..."
            class="search-input"
          />
          
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
      <div v-if="loadingProducts" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>

      <!-- Grid de produtos -->
      <div v-else-if="filteredProducts.length > 0" class="produtos-grid">
        <div v-for="produto in filteredProducts" :key="produto.id" class="produto-card">
          <div class="produto-image">
            <img :src="produto.imagem || placeholderImage" :alt="produto.nome" />
            <div v-if="produto.emOferta" class="produto-discount-badge">
              -{{ produto.percentualDesconto }}%
            </div>
          </div>
          
          <div class="produto-info">
            <div class="produto-header">
              <div class="produto-categories">
                <span class="produto-categoria">{{ getCategoryName(produto.categoriaId) }}</span>
                <span v-if="produto.subcategoriaId" class="produto-subcategoria">
                  > {{ getSubcategoryName(produto.subcategoriaId) }}
                </span>
              </div>
              <div class="produto-codigo">{{ produto.codigo }}</div>
            </div>
            
            <h4 class="produto-nome">{{ produto.nome }}</h4>
            <p v-if="produto.descricao" class="produto-descricao">{{ produto.descricao }}</p>
            
            <div class="produto-details">
              <div class="produto-estoque">
                <i class="fas fa-box"></i>
                Estoque: {{ produto.estoque || 0 }}
              </div>
              
              <div class="produto-pricing">
                <div v-if="produto.emOferta" class="produto-price-with-discount">
                  <span class="produto-original-price">R$ {{ formatPrice(produto.precoOriginal) }}</span>
                  <span class="produto-sale-price">R$ {{ formatPrice(produto.preco) }}</span>
                </div>
                <div v-else>
                  <span class="produto-regular-price">R$ {{ formatPrice(produto.preco) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="produto-actions">
            <button 
              @click="editProduct(produto)"
              class="btn-edit"
              title="Editar produto"
            >
              <i class="fas fa-edit"></i>
            </button>
            
            <button 
              @click="deleteProduct(produto.id)"
              class="btn-delete"
              title="Excluir produto"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sem produtos -->
      <div v-else class="no-produtos">
        <div class="no-produtos-icon">📦</div>
        <h4>Nenhum produto encontrado</h4>
        <p>{{ searchTerm || filterCategory || filterSubcategory ? 'Nenhum produto encontrado com os filtros selecionados' : 'Adicione o primeiro produto usando o formulário acima' }}</p>
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
  serverTimestamp,
  where 
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
    const fileInput = ref(null)
    const placeholderImage = 'https://via.placeholder.com/200x150/8C52FF/FFFFFF?text=Produto'
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
      imagens: ['', '', ''], // Array para 3 imagens
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

      // Filtro por busca (nome ou código)
      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase()
        filtered = filtered.filter(produto => 
          produto.nome.toLowerCase().includes(search) ||
          produto.codigo.toLowerCase().includes(search)
        )
      }

      // Filtro por categoria
      if (filterCategory.value) {
        filtered = filtered.filter(produto => produto.categoriaId === filterCategory.value)
      }

      // Filtro por subcategoria
      if (filterSubcategory.value) {
        filtered = filtered.filter(produto => produto.subcategoriaId === filterSubcategory.value)
      }

      return filtered
    })

    // Gerar código baseado no nome
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

    // Gerar código aleatório
    const generateRandomCode = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const prefix = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')
      const number = Math.floor(Math.random() * 999) + 1
      productForm.value.codigo = prefix + number.toString().padStart(3, '0')
      validateCode()
    }

    // Validar código único
    const validateCode = async () => {
      codeError.value = ''
      codeSuccess.value = ''
      
      if (!productForm.value.codigo) return
      
      const codigo = productForm.value.codigo.trim().toUpperCase()
      productForm.value.codigo = codigo
      
      // Validar formato
      if (!/^[A-Z]{3}\d{3}$/.test(codigo)) {
        codeError.value = 'Código deve ter formato: 3 letras + 3 números (ex: ABC123)'
        return
      }
      
      // Verificar se já existe (exceto se estiver editando o mesmo produto)
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

    // Watch para validar código quando mudar
    watch(() => productForm.value.codigo, () => {
      if (productForm.value.codigo) {
        validateCode()
      }
    })

    const calculateDiscountPrice = () => {
      // Força a reatividade do computed
      if (productForm.value.emOferta && productForm.value.preco && productForm.value.percentualDesconto) {
        const originalPrice = parseFloat(productForm.value.preco)
        const discount = parseFloat(productForm.value.percentualDesconto)
        const discountedPrice = originalPrice - (originalPrice * discount / 100)
        return discountedPrice
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
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Por favor, selecione apenas arquivos de imagem'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      // Validar tamanho (máximo 5MB)
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
          // Redimensionar para máximo 800x600 mantendo proporção
          let { width, height } = img
          const maxWidth = 800
          const maxHeight = 600
          
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height
            
            if (aspectRatio > 1) {
              // Paisagem
              width = maxWidth
              height = width / aspectRatio
            } else {
              // Retrato
              height = maxHeight
              width = height * aspectRatio
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height)
          
          // Converter para base64 com qualidade 0.8
          const base64 = canvas.toDataURL('image/jpeg', 0.8)
          resolve(base64)
        }
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'))
        
        // Carregar arquivo como URL
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
        
        // Calcular preço com desconto se em oferta
        if (productForm.value.emOferta && productForm.value.percentualDesconto) {
          const discount = parseFloat(productForm.value.percentualDesconto)
          finalPrice = originalPrice - (originalPrice * discount / 100)
        }
        
        const productData = {
          nome: productForm.value.nome.trim(),
          codigo: productForm.value.codigo.trim().toUpperCase(),
          descricao: productForm.value.descricao.trim(),
          descricaoCompleta: productForm.value.descricaoCompleta.trim(),
          preco: finalPrice, // Preço final (com desconto se aplicável)
          precoOriginal: productForm.value.emOferta ? originalPrice : null, // Preço original apenas se em oferta
          estoque: parseInt(productForm.value.estoque),
          categoriaId: productForm.value.categoriaId,
          categoria: categoria ? categoria.nome : '',
          subcategoriaId: productForm.value.subcategoriaId || null,
          subcategoria: subcategoria ? subcategoria.nome : '',
          imagem: productForm.value.imagens[0] || '', // Primeira imagem como principal
          imagens: productForm.value.imagens.filter(img => img), // Todas as imagens não vazias
          emOferta: productForm.value.emOferta,
          percentualDesconto: productForm.value.emOferta ? parseInt(productForm.value.percentualDesconto) : null,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        }

        if (editingProduct.value) {
          // Atualizar produto existente
          await updateDoc(doc(db, 'produtos', editingProduct.value.id), {
            ...productData,
            criadoEm: editingProduct.value.criadoEm // Manter data de criação original
          })

          // Atualizar na lista local
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
          // Adicionar novo produto
          const docRef = await addDoc(collection(db, 'produtos'), productData)
          
          // Adicionar à lista local
          produtos.value.push({
            id: docRef.id,
            ...productData,
            criadoEm: new Date(),
            atualizadoEm: new Date()
          })

          successMessage.value = 'Produto adicionado com sucesso!'
        }

        // Ordenar lista
        produtos.value.sort((a, b) => a.nome.localeCompare(b.nome))

        // Limpar formulário
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
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

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
      
      // Preparar array de imagens
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
        
        // Remover da lista local
        produtos.value = produtos.value.filter(p => p.id !== productId)
        
        successMessage.value = 'Produto excluído com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)

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
      fileInput,
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

.produto-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.images-upload-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.images-upload-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.images-upload-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.image-upload-slot {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-upload-area {
  position: relative;
  width: 100%;
  height: 150px;
  border: 2px dashed rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.image-upload-area:hover {
  border-color: #8C52FF;
  background: rgba(140, 82, 255, 0.05);
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}

.codigo-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.codigo-input-container input {
  flex: 1;
  padding-right: 3rem;
}

.codigo-input-container input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.generate-code-btn {
  position: absolute;
  right: 0.5rem;
  background: #8C52FF;
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-code-btn:hover {
  background: #6B3DD6;
  transform: scale(1.05);
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.success-message {
  color: #28a745;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 0.9rem;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: #8C52FF;
  box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
}

.produtos-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.produto-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.produto-codigo {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: monospace;
}

.produto-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.produto-estoque {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.8rem;
}

.produto-estoque i {
  color: #8C52FF;
}

@media (max-width: 768px) {
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
  
  .produto-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .produto-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .images-upload-container {
    grid-template-columns: 1fr;
  }
  
  .image-upload-area {
    height: 120px;
  }
  
  .codigo-input-container input {
    padding-right: 2.5rem;
  }
  
  .generate-code-btn {
    width: 28px;
    height: 28px;
  }
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
  gap: 0.5rem;
  color: #666;
  text-align: center;
}

.upload-placeholder i {
  font-size: 2rem;
  color: #8C52FF;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: #DC2626;
  transform: scale(1.1);
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
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8C52FF;
  box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
}

.form-group select:disabled {
  background: #f8f9fa;
  color: #999;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(140, 82, 255, 0.3);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #8C52FF;
  border-color: #8C52FF;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 3px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.offer-section {
  background: rgba(255, 215, 0, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.price-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(140, 82, 255, 0.2);
}

.price-calculation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original-price-preview {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.sale-price-preview {
  color: #8C52FF;
  font-size: 1.2rem;
  font-weight: 700;
}

.savings {
  color: #22C55E;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
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

.btn-submit {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.produtos-section {
  margin-top: 2rem;
}

.produtos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.produtos-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 0.9rem;
  min-width: 150px;
}

.filter-select:disabled {
  background: #f8f9fa;
  color: #999;
  cursor: not-allowed;
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

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.produto-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(140, 82, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.produto-card:hover {
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
  transform: translateY(-2px);
}

.produto-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
}

.produto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.produto-discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #FF4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.produto-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.produto-categories {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #8C52FF;
  font-weight: 600;
}

.produto-categoria {
  text-transform: uppercase;
}

.produto-subcategoria {
  color: #666;
}

.produto-nome {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.produto-descricao {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.produto-pricing {
  margin-bottom: 0.5rem;
}

.produto-price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.produto-original-price {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}

.produto-sale-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #8C52FF;
}

.produto-regular-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #8C52FF;
}

.produto-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.btn-edit {
  background: rgba(33, 150, 243, 0.9);
  color: white;
}

.btn-edit:hover {
  background: #2196F3;
}

.btn-delete {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.btn-delete:hover {
  background: #F44336;
}

.no-produtos {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.no-produtos-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-produtos h4 {
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
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .produtos-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .produtos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .image-upload-area {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }
  
  .form-section h3 {
    font-size: 1.1rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .btn-submit,
  .btn-cancel {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .produtos-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-select {
    min-width: auto;
    font-size: 0.8rem;
  }
  
  .produto-nome {
    font-size: 1rem;
  }
  
  .produto-sale-price,
  .produto-regular-price {
    font-size: 1.1rem;
  }
  
  .offer-section {
    padding: 1rem;
  }
  
  .price-calculation {
    align-items: center;
    text-align: center;
  }
}
</style>
