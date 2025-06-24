<template>
  <div class="loja-page">
    <div class="loja-container">
      <!-- Header da Loja -->
      <div class="loja-header">
        <h1>
          <i class="fas fa-store"></i>
          Loja ByPetz
        </h1>
        
        <!-- Mobile Filter Button -->
        <button class="mobile-filter-btn" @click="toggleMobileFilters">
          <i class="fas fa-filter"></i>
          Filtros
        </button>
        
        <!-- Results Info -->
        <div class="results-info">
          <span>{{ filteredProducts.length }} produtos encontrados</span>
          <select v-model="sortOrder" class="sort-select">
            <option value="relevance">Ordenar por: Relevância</option>
            <option value="name-asc">Nome A-Z</option>
            <option value="name-desc">Nome Z-A</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
      </div>

      <div class="loja-content">
        <!-- Desktop Sidebar -->
        <aside class="desktop-sidebar">
          <div class="sidebar-content">
            <h3 class="sidebar-title">Categorias</h3>
            
            <div class="categories-list">
              <div 
                v-for="categoria in categorias" 
                :key="categoria.id"
                class="category-item"
              >
                <div 
                  class="category-header"
                  @click="toggleCategory(categoria.id)"
                  :class="{ active: selectedCategory === categoria.id }"
                >
                  <label class="category-checkbox">
                    <input 
                      type="radio" 
                      :value="categoria.id" 
                      v-model="selectedCategory"
                      @change="handleCategoryChange"
                    />
                    <span class="checkmark"></span>
                    <span class="category-name">{{ categoria.nome }}</span>
                    <span class="product-count">({{ getCategoryProductCount(categoria.id) }})</span>
                  </label>
                  
                  <button 
                    v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                    class="expand-btn"
                    :class="{ expanded: expandedCategories.includes(categoria.id) }"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
                
                <!-- Subcategorias -->
                <div 
                  v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                  class="subcategories"
                  :class="{ expanded: expandedCategories.includes(categoria.id) }"
                >
                  <div 
                    v-for="sub in categoria.subcategorias" 
                    :key="sub.id"
                    class="subcategory-item"
                  >
                    <label class="subcategory-checkbox">
                      <input 
                        type="radio" 
                        :value="sub.id" 
                        v-model="selectedSubcategory"
                        @change="handleSubcategoryChange"
                      />
                      <span class="checkmark"></span>
                      <span class="subcategory-name">{{ sub.nome }}</span>
                      <span class="product-count">({{ getSubcategoryProductCount(sub.id) }})</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Botão Limpar Filtros -->
            <button 
              v-if="selectedCategory || selectedSubcategory"
              @click="clearFilters" 
              class="clear-filters-btn"
            >
              <i class="fas fa-times"></i>
              Limpar Filtros
            </button>
          </div>
        </aside>

        <!-- Mobile Filters Modal -->
        <div v-if="showMobileFilters" class="mobile-filters-overlay" @click="closeMobileFilters">
          <div class="mobile-filters-content" @click.stop>
            <div class="mobile-filters-header">
              <h3>Filtros</h3>
              <button @click="closeMobileFilters" class="close-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="mobile-categories-list">
              <div 
                v-for="categoria in categorias" 
                :key="categoria.id"
                class="mobile-category-item"
              >
                <div 
                  class="mobile-category-header"
                  @click="toggleMobileCategory(categoria.id)"
                >
                  <label class="mobile-category-checkbox">
                    <input 
                      type="radio" 
                      :value="categoria.id" 
                      v-model="selectedCategory"
                      @change="handleCategoryChange"
                    />
                    <span class="mobile-checkmark"></span>
                    <span class="mobile-category-name">{{ categoria.nome }}</span>
                    <span class="mobile-product-count">({{ getCategoryProductCount(categoria.id) }})</span>
                  </label>
                  
                  <button 
                    v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                    class="mobile-expand-btn"
                    :class="{ expanded: expandedMobileCategories.includes(categoria.id) }"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
                
                <!-- Mobile Subcategorias -->
                <div 
                  v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                  class="mobile-subcategories"
                  :class="{ expanded: expandedMobileCategories.includes(categoria.id) }"
                >
                  <div 
                    v-for="sub in categoria.subcategorias" 
                    :key="sub.id"
                    class="mobile-subcategory-item"
                  >
                    <label class="mobile-subcategory-checkbox">
                      <input 
                        type="radio" 
                        :value="sub.id" 
                        v-model="selectedSubcategory"
                        @change="handleSubcategoryChange"
                      />
                      <span class="mobile-checkmark"></span>
                      <span class="mobile-subcategory-name">{{ sub.nome }}</span>
                      <span class="mobile-product-count">({{ getSubcategoryProductCount(sub.id) }})</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mobile-filters-actions">
              <button 
                v-if="selectedCategory || selectedSubcategory"
                @click="clearFilters" 
                class="mobile-clear-btn"
              >
                Limpar Filtros
              </button>
              <button @click="closeMobileFilters" class="mobile-apply-btn">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <main class="main-content">
          <!-- Loading -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Carregando produtos...</p>
          </div>

          <!-- Grid de Produtos -->
          <div v-else-if="sortedProducts.length > 0" class="products-grid">
            <ProductCard
              v-for="produto in sortedProducts"
              :key="produto.id"
              :produto="produto"
              @adicionar="addToCart"
              @abrir-produto="openProductModal"
            />
          </div>

          <!-- Sem produtos -->
          <div v-else class="no-products">
            <div class="no-products-icon">🛍️</div>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente selecionar uma categoria diferente</p>
          </div>
        </main>
      </div>

      <!-- Botão do Carrinho Fixo -->
      <router-link to="/carrinho" class="cart-button-fixed" v-if="cartItemsCount > 0">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">{{ cartItemsCount }}</span>
        <span class="cart-text">Carrinho</span>
      </router-link>

      <!-- Modal do Produto -->
      <ProductModal
        v-if="selectedProduct"
        :produto="selectedProduct"
        :isOpen="showProductModal"
        @close="closeProductModal"
        @adicionar="handleModalAddToCart"
      />

      <!-- Mensagem de sucesso -->
      <div v-if="successMessage" class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'

export default {
  name: 'LojaView',
  components: {
    ProductCard,
    ProductModal
  },
  setup() {
    const cartStore = useCartStore()
    const loading = ref(true)
    const produtos = ref([])
    const categorias = ref([])
    const subcategorias = ref([])
    const selectedCategory = ref('')
    const selectedSubcategory = ref('')
    const sortOrder = ref('relevance')
    const successMessage = ref('')
    const showMobileFilters = ref(false)
    const expandedCategories = ref([])
    const expandedMobileCategories = ref([])
    const showProductModal = ref(false)
    const selectedProduct = ref(null)

    const filteredProducts = computed(() => {
      let filtered = produtos.value

      if (selectedSubcategory.value) {
        filtered = filtered.filter(produto => produto.subcategoriaId === selectedSubcategory.value)
      } else if (selectedCategory.value) {
        filtered = filtered.filter(produto => produto.categoriaId === selectedCategory.value)
      }

      return filtered
    })

    const sortedProducts = computed(() => {
      const filtered = [...filteredProducts.value]
      
      switch (sortOrder.value) {
        case 'name-asc':
          return filtered.sort((a, b) => a.nome.localeCompare(b.nome))
        case 'name-desc':
          return filtered.sort((a, b) => b.nome.localeCompare(a.nome))
        case 'price-asc':
          return filtered.sort((a, b) => a.preco - b.preco)
        case 'price-desc':
          return filtered.sort((a, b) => b.preco - a.preco)
        default:
          return filtered
      }
    })

    const cartItemsCount = computed(() => {
      return cartStore.items.reduce((total, item) => total + item.quantidade, 0)
    })

    const getCategoryProductCount = (categoryId) => {
      return produtos.value.filter(p => p.categoriaId === categoryId).length
    }

    const getSubcategoryProductCount = (subcategoryId) => {
      return produtos.value.filter(p => p.subcategoriaId === subcategoryId).length
    }

    const toggleCategory = (categoryId) => {
      const index = expandedCategories.value.indexOf(categoryId)
      if (index > -1) {
        expandedCategories.value.splice(index, 1)
      } else {
        expandedCategories.value.push(categoryId)
      }
    }

    const toggleMobileCategory = (categoryId) => {
      const index = expandedMobileCategories.value.indexOf(categoryId)
      if (index > -1) {
        expandedMobileCategories.value.splice(index, 1)
      } else {
        expandedMobileCategories.value.push(categoryId)
      }
    }

    const handleCategoryChange = () => {
      selectedSubcategory.value = ''
    }

    const handleSubcategoryChange = () => {
      // Encontrar a categoria pai da subcategoria selecionada
      const subcategoria = subcategorias.value.find(s => s.id === selectedSubcategory.value)
      if (subcategoria) {
        selectedCategory.value = subcategoria.categoriaId
      }
    }

    const clearFilters = () => {
      selectedCategory.value = ''
      selectedSubcategory.value = ''
    }

    const toggleMobileFilters = () => {
      showMobileFilters.value = true
    }

    const closeMobileFilters = () => {
      showMobileFilters.value = false
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
        
        // Associar subcategorias às categorias
        categorias.value.forEach(categoria => {
          categoria.subcategorias = fetchedSubcategorias.filter(sub => sub.categoriaId === categoria.id)
        })
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
      }
    }

    // Função atualizada para lidar com o novo formato do evento
    const addToCart = (data) => {
      try {
        // Verifica se é o formato antigo (só produto) ou novo (objeto com produto e quantidade)
        let produto, quantidade
        
        if (data.produto && data.quantidade) {
          // Novo formato: { produto, quantidade }
          produto = data.produto
          quantidade = data.quantidade
        } else {
          // Formato antigo: só o produto
          produto = data
          quantidade = 1
        }

        // Adiciona ao carrinho usando o store
        for (let i = 0; i < quantidade; i++) {
          cartStore.addItem(produto)
        }

        successMessage.value = `${produto.nome} ${quantidade > 1 ? `(${quantidade} unidades)` : ''} adicionado ao carrinho!`
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error)
        successMessage.value = 'Erro ao adicionar produto ao carrinho'
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    }

    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          fetchCategorias(),
          fetchSubcategorias(),
          fetchProdutos()
        ])
      } finally {
        loading.value = false
      }
    }

    const openProductModal = (produto) => {
      console.log('Função openProductModal chamada com produto:', produto.nome) // Debug
      selectedProduct.value = produto
      showProductModal.value = true
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden'
    }

    const closeProductModal = () => {
      console.log('Fechando modal') // Debug
      showProductModal.value = false
      selectedProduct.value = null
      // Restaura scroll do body
      document.body.style.overflow = 'auto'
    }

    // Função atualizada para lidar com o evento do modal
    const handleModalAddToCart = (data) => {
      addToCart(data)
      // Opcional: fechar modal após adicionar
      // closeProductModal()
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      produtos,
      categorias,
      subcategorias,
      selectedCategory,
      selectedSubcategory,
      sortOrder,
      filteredProducts,
      sortedProducts,
      cartItemsCount,
      successMessage,
      showMobileFilters,
      expandedCategories,
      expandedMobileCategories,
      getCategoryProductCount,
      getSubcategoryProductCount,
      toggleCategory,
      toggleMobileCategory,
      handleCategoryChange,
      handleSubcategoryChange,
      clearFilters,
      toggleMobileFilters,
      closeMobileFilters,
      addToCart,
      showProductModal,
      selectedProduct,
      openProductModal,
      closeProductModal,
      handleModalAddToCart
    }
  }
}
</script>

<style scoped>
/* Mantendo todos os estilos originais */
.loja-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.loja-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.loja-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.loja-header h1 {
  color: #8C52FF;
  font-size: 1.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.mobile-filter-btn {
  display: none;
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  gap: 0.5rem;
  align-items: center;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 0.9rem;
}

.loja-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 120px);
}

/* Desktop Sidebar */
.desktop-sidebar {
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 2rem 1.5rem;
  overflow-y: auto;
}

.sidebar-content {
  position: sticky;
  top: 2rem;
}

.sidebar-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #8C52FF;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  border-bottom: 1px solid #f1f3f4;
  padding-bottom: 0.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.category-checkbox input[type="radio"] {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.category-checkbox input[type="radio"]:checked + .checkmark {
  background: #8C52FF;
  border-color: #8C52FF;
}

.category-checkbox input[type="radio"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.category-name {
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.product-count {
  color: #666;
  font-size: 0.85rem;
  margin-left: auto;
}

.expand-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.3s ease;
}

.expand-btn.expanded {
  transform: rotate(180deg);
}

.subcategories {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
}

.subcategories.expanded {
  max-height: 500px;
  padding-top: 0.5rem;
}

.subcategory-item {
  padding: 0.25rem 0;
}

.subcategory-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.subcategory-checkbox input[type="radio"] {
  display: none;
}

.subcategory-name {
  color: #555;
  font-size: 0.9rem;
}

.clear-filters-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.clear-filters-btn:hover {
  background: #c82333;
}

/* Mobile Filters */
.mobile-filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
}

.mobile-filters-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.mobile-filters-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-categories-list {
  flex: 1;
  padding: 1rem;
}

.mobile-category-item {
  border-bottom: 1px solid #f1f3f4;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.mobile-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
}

.mobile-category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.mobile-category-checkbox input[type="radio"] {
  display: none;
}

.mobile-checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.mobile-category-checkbox input[type="radio"]:checked + .mobile-checkmark {
  background: #8C52FF;
  border-color: #8C52FF;
}

.mobile-category-checkbox input[type="radio"]:checked + .mobile-checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 3px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.mobile-category-name {
  color: #333;
  font-weight: 500;
  font-size: 1rem;
}

.mobile-product-count {
  color: #666;
  font-size: 0.9rem;
  margin-left: auto;
}

.mobile-expand-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.mobile-expand-btn.expanded {
  transform: rotate(180deg);
}

.mobile-subcategories {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1.5rem;
}

.mobile-subcategories.expanded {
  max-height: 500px;
  padding-top: 0.75rem;
}

.mobile-subcategory-item {
  padding: 0.5rem 0;
}

.mobile-subcategory-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.mobile-subcategory-checkbox input[type="radio"] {
  display: none;
}

.mobile-subcategory-name {
  color: #555;
  font-size: 0.95rem;
}

.mobile-filters-actions {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
}

.mobile-clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}

.mobile-apply-btn {
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 2;
}

/* Main Content */
.main-content {
  padding: 2rem;
  background: #f8f9fa;
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
  width: 50px;
  height: 50px;
  border: 4px solid rgba(140, 82, 255, 0.3);
  border-top: 4px solid #8C52FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-products-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-products h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.cart-button-fixed {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(140, 82, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 999;
}

.cart-button-fixed:hover {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(140, 82, 255, 0.5);
}

.cart-count {
  background: #FFD700;
  color: #8C52FF;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
}

.cart-text {
  font-size: 1rem;
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

/* Tablet */
@media (max-width: 1024px) {
  .loja-content {
    grid-template-columns: 250px 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .desktop-sidebar {
    padding: 1.5rem 1rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .loja-header {
    padding: 1rem;
  }
  
  .loja-header h1 {
    font-size: 1.5rem;
  }
  
  .mobile-filter-btn {
    display: flex;
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
  }
  
  .loja-content {
    grid-template-columns: 1fr;
  }
  
  .desktop-sidebar {
    display: none;
  }
  
  .mobile-filters-overlay {
    display: flex;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .cart-button-fixed {
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem 1rem;
  }
  
  .cart-text {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .loja-header {
    padding: 0.75rem;
  }
  
  .loja-header h1 {
    font-size: 1.3rem;
  }
  
  .mobile-filter-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .results-info {
    font-size: 0.8rem;
  }
  
  .sort-select {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .mobile-filters-content {
    width: 100%;
  }
  
  .mobile-filters-header {
    padding: 1rem;
  }
  
  .mobile-categories-list {
    padding: 0.75rem;
  }
  
  .mobile-filters-actions {
    padding: 1rem;
    flex-direction: column;
  }
  
  .cart-button-fixed {
    bottom: 0.75rem;
    right: 0.75rem;
    padding: 0.6rem 0.8rem;
  }
  
  .cart-count {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }
}

/* Extra Small */
@media (max-width: 360px) {
  .loja-header h1 {
    font-size: 1.1rem;
  }
  
  .mobile-filter-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .main-content {
    padding: 0.5rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
