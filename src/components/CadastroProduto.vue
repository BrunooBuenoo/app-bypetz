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
        <!-- Upload de Imagem -->
        <div class="form-group image-upload-group">
          <label>Imagem do Produto</label>
          <div class="image-upload-area" @click="triggerFileInput">
            <img v-if="productForm.imagem" :src="productForm.imagem" alt="Preview" class="image-preview" />
            <div v-else class="upload-placeholder">
              <i class="fas fa-camera"></i>
              <span>Clique para adicionar imagem</span>
            </div>
            <button 
              v-if="productForm.imagem" 
              type="button" 
              class="remove-image-btn"
              @click.stop="removeImage"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleImageChange" 
            style="display: none"
          />
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
            />
          </div>

          <div class="form-group">
            <label for="categoria">Categoria *</label>
            <select v-model="productForm.categoriaId" id="categoria" required>
              <option value="">Selecione uma categoria</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nome }}
              </option>
            </select>
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
          <label for="preco">Preço (R$) *</label>
          <input
            v-model="productForm.preco"
            type="number"
            id="preco"
            step="0.01"
            min="0"
            placeholder="0,00"
            required
          />
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
          
          <button type="submit" class="btn-submit" :disabled="loading">
            <i class="fas fa-save"></i>
            {{ loading ? 'Salvando...' : (editingProduct ? 'Atualizar Produto' : 'Adicionar Produto') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de produtos -->
    <div class="produtos-section">
      <h3>Produtos Cadastrados</h3>
      
      <!-- Loading -->
      <div v-if="loadingProducts" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>

      <!-- Grid de produtos -->
      <div v-else-if="produtos.length > 0" class="produtos-grid">
        <div v-for="produto in produtos" :key="produto.id" class="produto-card">
          <div class="produto-image">
            <img :src="produto.imagem || placeholderImage" :alt="produto.nome" />
          </div>
          
          <div class="produto-info">
            <h4 class="produto-nome">{{ produto.nome }}</h4>
            <p class="produto-categoria">{{ getCategoryName(produto.categoriaId) }}</p>
            <p v-if="produto.descricao" class="produto-descricao">{{ produto.descricao }}</p>
            <div class="produto-preco">R$ {{ formatPrice(produto.preco) }}</div>
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
        <p>Adicione o primeiro produto usando o formulário acima</p>
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
  name: 'CadastroProduto',
  setup() {
    const loading = ref(false)
    const loadingProducts = ref(true)
    const produtos = ref([])
    const categorias = ref([])
    const editingProduct = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const fileInput = ref(null)
    const placeholderImage = 'https://via.placeholder.com/200x150/8C52FF/FFFFFF?text=Produto'

    const productForm = ref({
      nome: '',
      descricao: '',
      preco: '',
      categoriaId: '',
      imagem: ''
    })

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const getCategoryName = (categoryId) => {
      const categoria = categorias.value.find(c => c.id === categoryId)
      return categoria ? categoria.nome : 'Categoria não encontrada'
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleImageChange = async (event) => {
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
        // Converter para base64
        const base64 = await convertToBase64(file)
        productForm.value.imagem = base64
        
        // Limpar erro se houver
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

    const removeImage = () => {
      productForm.value.imagem = ''
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
      if (!productForm.value.nome.trim() || !productForm.value.categoriaId || !productForm.value.preco) {
        errorMessage.value = 'Preencha todos os campos obrigatórios'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      loading.value = true
      try {
        const categoria = categorias.value.find(c => c.id === productForm.value.categoriaId)
        
        const productData = {
          nome: productForm.value.nome.trim(),
          descricao: productForm.value.descricao.trim(),
          preco: parseFloat(productForm.value.preco),
          categoriaId: productForm.value.categoriaId,
          categoria: categoria ? categoria.nome : '',
          imagem: productForm.value.imagem || '',
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
          descricao: '',
          preco: '',
          categoriaId: '',
          imagem: ''
        }
        
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
      productForm.value = {
        nome: produto.nome,
        descricao: produto.descricao || '',
        preco: produto.preco.toString(),
        categoriaId: produto.categoriaId,
        imagem: produto.imagem || ''
      }
      
      // Scroll para o formulário
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const cancelEdit = () => {
      editingProduct.value = null
      productForm.value = {
        nome: '',
        descricao: '',
        preco: '',
        categoriaId: '',
        imagem: ''
      }
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
      await fetchCategorias()
      await fetchProdutos()
    })

    return {
      loading,
      loadingProducts,
      produtos,
      categorias,
      editingProduct,
      productForm,
      successMessage,
      errorMessage,
      fileInput,
      placeholderImage,
      formatPrice,
      getCategoryName,
      triggerFileInput,
      handleImageChange,
      removeImage,
      submitProduct,
      editProduct,
      cancelEdit,
      deleteProduct
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

.image-upload-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-upload-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.image-upload-area {
  position: relative;
  width: 200px;
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

.form-group textarea {
  resize: vertical;
  min-height: 100px;
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

.produtos-section h3 {
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

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.produto-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(140, 82, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.produto-card:hover {
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
  transform: translateY(-2px);
}

.produto-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.produto-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.produto-info {
  padding: 1rem;
}

.produto-nome {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.produto-categoria {
  color: #8C52FF;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
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
}

.produto-preco {
  font-size: 1.3rem;
  font-weight: 800;
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
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .produtos-grid {
    grid-template-columns: 1fr;
  }
  
  .image-upload-area {
    width: 100%;
    max-width: 300px;
  }
}
</style>
