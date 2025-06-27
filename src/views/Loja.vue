<template>
  <div class="loja-page">
    <!-- Seção de Patrocinadores -->
    <div class="sponsors-section">
      <div class="sponsors-container">
        <h2 class="sponsors-title">Nossos Parceiros</h2>
        <div class="sponsors-grid">
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Dog Chow</div>
          </div>
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Casa das Rações</div>
          </div>
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Whiskas</div>
          </div>
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Royal Canin</div>
          </div>
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Pedigree</div>
          </div>
          <div class="sponsor-card">
            <div class="sponsor-placeholder">Purina</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Container Principal -->
    <div class="loja-container">
      <!-- Header da Loja -->
      <div class="loja-header">
        <div class="header-content">
          <p class="page-subtitle">Encontre os melhores produtos para seu pet</p>
        </div>
        
        <!-- Mobile Filter Button -->
        <button class="mobile-filter-btn" @click="toggleMobileFilters">
          Filtros
        </button>
      </div>

      <div class="loja-content">
        <!-- Desktop Sidebar -->
        <aside class="desktop-sidebar">
          <div class="sidebar-content">
            <!-- Categorias -->
            <div class="filter-section">
              <h3 class="filter-title">Categorias</h3>
              <div class="categories-list">
                <div 
                  v-for="categoria in categorias" 
                  :key="categoria.id"
                  class="category-item"
                >
                  <div 
                    class="category-header"
                    @click="toggleCategory(categoria.id)"
                  >
                    <label class="category-label" @click.prevent="handleCategoryClick(categoria.id)">
                      <input 
                        type="radio" 
                        :value="categoria.id" 
                        :checked="selectedCategory === categoria.id"
                        readonly
                      />
                      <span class="category-name">{{ categoria.nome }}</span>
                      <span class="product-count">({{ getCategoryProductCount(categoria.id) }})</span>
                    </label>
                    
                    <button 
                      v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                      class="expand-btn"
                      :class="{ expanded: expandedCategories.includes(categoria.id) }"
                      @click.stop
                    >
                      ▼
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
                      <label class="subcategory-label" 
                            :class="{ active: String(selectedSubcategory) === String(sub.id) }"
                            @click="handleSubcategoryClick(sub.id)"
                      >
                        <input 
                          type="radio" 
                          :value="sub.id" 
                          :checked="String(selectedSubcategory) === String(sub.id)"
                          readonly
                        />
                        <span class="subcategory-name">{{ sub.nome }}</span>
                        <span class="product-count">({{ getSubcategoryProductCount(sub.id) }})</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtro de Preço -->
            <div class="filter-section">
              <h3 class="filter-title">Faixa de Preço</h3>
              <div class="price-filter">
                <div class="price-inputs">
                  <div class="price-input-group">
                    <label>Mínimo</label>
                    <input 
                      type="number" 
                      v-model="priceMin" 
                      placeholder="0"
                      class="price-input"
                      min="0"
                    />
                  </div>
                  <div class="price-separator">até</div>
                  <div class="price-input-group">
                    <label>Máximo</label>
                    <input 
                      type="number" 
                      v-model="priceMax" 
                      placeholder="1000"
                      class="price-input"
                      min="0"
                    />
                  </div>
                </div>
                <button @click="applyPriceFilter" class="apply-price-btn">
                  Aplicar
                </button>
              </div>
            </div>
            
            <!-- Botão Limpar Filtros -->
            <button 
              v-if="selectedCategory || selectedSubcategory || priceMin || priceMax"
              @click="clearAllFilters" 
              class="clear-filters-btn"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <!-- Results Info e Sort -->
          <div class="content-header">
            <div class="results-info">
              <span class="results-count">{{ filteredProducts.length }} produtos encontrados</span>
            </div>
            <div class="sort-section">
              <select v-model="sortOrder" class="sort-select">
                <option value="relevance">Ordenar por: Relevância</option>
                <option value="name-asc">Nome A-Z</option>
                <option value="name-desc">Nome Z-A</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

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
            <div class="no-products-content">
              <div class="no-products-icon">🛍️</div>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros ou selecionar uma categoria diferente</p>
              <button @click="clearAllFilters" class="reset-filters-btn">
                Ver Todos os Produtos
              </button>
            </div>
          </div>
        </main>
      </div>

      <!-- Mobile Filters Modal -->
      <div v-if="showMobileFilters" class="mobile-filters-overlay" @click="closeMobileFilters">
        <div class="mobile-filters-content" @click.stop>
          <div class="mobile-filters-header">
            <h3>Filtros</h3>
            <button @click="closeMobileFilters" class="close-btn">✕</button>
          </div>
          
          <div class="mobile-filters-body">
            <!-- Categorias Mobile -->
            <div class="mobile-filter-section">
              <h4>Categorias</h4>
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
                    <label class="mobile-category-label" @click.stop="handleCategoryClick(categoria.id)">
                      <input 
                        type="radio" 
                        :value="categoria.id" 
                        :checked="selectedCategory === categoria.id"
                        readonly
                      />
                      <span class="mobile-category-name">{{ categoria.nome }}</span>
                      <span class="mobile-product-count">({{ getCategoryProductCount(categoria.id) }})</span>
                    </label>
                    
                    <button 
                      v-if="categoria.subcategorias && categoria.subcategorias.length > 0"
                      class="mobile-expand-btn"
                      :class="{ expanded: expandedMobileCategories.includes(categoria.id) }"
                    >
                      ▼
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
                      <label class="mobile-subcategory-label"
                            :class="{ active: String(selectedSubcategory) === String(sub.id) }"
                            @click="handleSubcategoryClick(sub.id)"
                      >
                        <input 
                          type="radio" 
                          :value="sub.id" 
                          :checked="String(selectedSubcategory) === String(sub.id)"
                          readonly
                        />
                        <span class="mobile-subcategory-name">{{ sub.nome }}</span>
                        <span class="mobile-product-count">({{ getSubcategoryProductCount(sub.id) }})</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtro de Preço Mobile -->
            <div class="mobile-filter-section">
              <h4>Faixa de Preço</h4>
              <div class="mobile-price-filter">
                <div class="mobile-price-inputs">
                  <input 
                    type="number" 
                    v-model="priceMin" 
                    placeholder="Preço mínimo"
                    class="mobile-price-input"
                  />
                  <input 
                    type="number" 
                    v-model="priceMax" 
                    placeholder="Preço máximo"
                    class="mobile-price-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="mobile-filters-actions">
            <button 
              v-if="selectedCategory || selectedSubcategory || priceMin || priceMax"
              @click="clearAllFilters" 
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

      <!-- Botão do Carrinho Fixo -->
      <router-link to="/carrinho" class="cart-button-fixed" v-if="cartItemsCount > 0">
        <span class="cart-icon">🛒</span>
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
      <div v-if="successMessage" class="success-alert">
        <span class="success-icon">✓</span>
        {{ successMessage }}
      </div>
    </div>
  </div>
  <RodapeSite />
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: 'LojaView',
  components: {
    ProductCard,
    ProductModal,
    RodapeSite
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
    const priceMin = ref('')
    const priceMax = ref('')

    const filteredProducts = computed(() => {
      let filtered = produtos.value

      // Filtro por categoria/subcategoria
      if (selectedSubcategory.value) {
        filtered = filtered.filter(produto =>
          String(produto.subcategoriaId) === String(selectedSubcategory.value)
        )
      } else if (selectedCategory.value) {
        filtered = filtered.filter(produto =>
          String(produto.categoriaId) === String(selectedCategory.value)
        )
      }

      // Filtro por preço
      if (priceMin.value !== '' && priceMin.value !== null) {
        filtered = filtered.filter(produto => produto.preco >= Number(priceMin.value))
      }
      
      if (priceMax.value !== '' && priceMax.value !== null) {
        filtered = filtered.filter(produto => produto.preco <= Number(priceMax.value))
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
      return produtos.value.filter(p =>
        String(p.subcategoriaId) === String(subcategoryId)
      ).length
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

    // Função para lidar com clique na categoria (sua lógica original)
    const handleCategoryClick = (categoryId) => {
      if (selectedCategory.value === categoryId && !selectedSubcategory.value) {
        selectedCategory.value = ''
        selectedSubcategory.value = ''
      } else {
        selectedCategory.value = categoryId
        selectedSubcategory.value = ''
      }
    }

    // Função para lidar com clique na subcategoria (sua lógica original)
    const handleSubcategoryClick = (subcategoryId) => {
      if (selectedSubcategory.value === subcategoryId) {
        selectedSubcategory.value = ''
        selectedCategory.value = ''
      } else {
        selectedSubcategory.value = subcategoryId
        const subcategoria = subcategorias.value.find(s => s.id === subcategoryId)
        if (subcategoria) {
          selectedCategory.value = subcategoria.categoriaId
        }
      }
    }

    const applyPriceFilter = () => {
      // O filtro é aplicado automaticamente via computed
    }

    const clearAllFilters = () => {
      selectedCategory.value = ''
      selectedSubcategory.value = ''
      priceMin.value = ''
      priceMax.value = ''
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

    const addToCart = (data) => {
      try {
        let produto, quantidade
        
        if (data.produto && data.quantidade) {
          produto = data.produto
          quantidade = data.quantidade
        } else {
          produto = data
          quantidade = 1
        }

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
      selectedProduct.value = produto
      showProductModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeProductModal = () => {
      showProductModal.value = false
      selectedProduct.value = null
      document.body.style.overflow = 'auto'
    }

    const handleModalAddToCart = (data) => {
      addToCart(data)
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
      priceMin,
      priceMax,
      getCategoryProductCount,
      getSubcategoryProductCount,
      toggleCategory,
      toggleMobileCategory,
      clearAllFilters,
      toggleMobileFilters,
      closeMobileFilters,
      addToCart,
      showProductModal,
      selectedProduct,
      openProductModal,
      closeProductModal,
      handleModalAddToCart,
      handleCategoryClick,
      handleSubcategoryClick,
      applyPriceFilter
    }
  }
}
</script>

<style scoped>
.loja-page {
  padding-top: 80px;
  min-height: 100vh;
  background: #ffffff;
}

/* Seção de Patrocinadores */
.sponsors-section {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  padding: 3rem 0;
  width: 100%;
}

.sponsors-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.sponsors-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
}

.sponsors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.sponsor-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-height: 80px;
}

.sponsor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.sponsor-placeholder {
  color: #9333ea;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
}

/* Container Principal */
.loja-container {
  max-width: 1400px;
  margin: 0 auto;
}

.loja-header {
  background: white;
  padding: 2rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.page-title {
  color: #111827;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
  text-align: center;
}

.mobile-filter-btn {
  display: none;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-filter-btn:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
}

.loja-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: calc(100vh - 200px);
}

/* Desktop Sidebar */
.desktop-sidebar {
  background: white;
  border-right: 1px solid rgba(229, 231, 235, 0.8);
  padding: 2rem;
}

.sidebar-content {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filter-section {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
}

.filter-title {
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #9333ea;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  padding-bottom: 0.5rem;
}

.category-item:last-child {
  border-bottom: none;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.category-label input[type="radio"] {
  accent-color: #9333ea;
}

.category-name {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

.product-count {
  color: #6b7280;
  font-size: 0.85rem;
  margin-left: auto;
}

.expand-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.3s ease;
  font-size: 0.75rem;
}

.expand-btn.expanded {
  transform: rotate(180deg);
}

.subcategories {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1.5rem;
}

.subcategories.expanded {
  max-height: 500px;
  padding-top: 0.5rem;
}

.subcategory-item {
  padding: 0.25rem 0;
}

.subcategory-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subcategory-label:hover {
  color: #9333ea;
}

.subcategory-label.active {
  color: #9333ea;
  font-weight: 600;
}

.subcategory-label input[type="radio"] {
  accent-color: #9333ea;
}

.subcategory-name {
  color: #555;
  font-size: 0.9rem;
}

.subcategory-label.active .subcategory-name {
  color: #9333ea;
}

/* Filtro de Preço - CORRIGIDO */
.price-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0; /* Permite que o flex item encolha */
}

.price-input-group label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.price-input {
  padding: 0.4rem 0.5rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  width: 100%;
  min-width: 0; /* Permite que o input encolha */
  box-sizing: border-box;
}

.price-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.price-separator {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 1rem;
  flex-shrink: 0;
}

.apply-price-btn {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-price-btn:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-1px);
}

.clear-filters-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

/* Main Content */
.main-content {
  padding: 2rem;
  background: #ffffff;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
}

.results-info {
  display: flex;
  align-items: center;
}

.results-count {
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
}

.sort-section {
  display: flex;
  align-items: center;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6b7280;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(147, 51, 234, 0.3);
  border-top: 4px solid #9333ea;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  align-items: start;
}

.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-products-content {
  text-align: center;
  max-width: 400px;
}

.no-products-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-products h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.no-products p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.reset-filters-btn {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filters-btn:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
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
  width: 100%;
  max-width: 400px;
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
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-filters-header h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #374151;
}

.mobile-filters-body {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mobile-filter-section {
  background: rgba(249, 250, 251, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
}

.mobile-filter-section h4 {
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.mobile-categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-category-item {
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding-bottom: 1rem;
}

.mobile-category-item:last-child {
  border-bottom: none;
}

.mobile-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
}

.mobile-category-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.mobile-category-label input[type="radio"] {
  accent-color: #9333ea;
}

.mobile-category-name {
  color: #374151;
  font-weight: 500;
  font-size: 1rem;
}

.mobile-product-count {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: auto;
}

.mobile-expand-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
  font-size: 0.875rem;
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
  padding-top: 1rem;
}

.mobile-subcategory-item {
  padding: 0.5rem 0;
}

.mobile-subcategory-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-subcategory-label:hover {
  color: #9333ea;
}

.mobile-subcategory-label.active {
  color: #9333ea;
  font-weight: 600;
}

.mobile-subcategory-label input[type="radio"] {
  accent-color: #9333ea;
}

.mobile-subcategory-name {
  color: #555;
  font-size: 0.95rem;
}

.mobile-subcategory-label.active .mobile-subcategory-name {
  color: #9333ea;
}

.mobile-price-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-price-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-price-input {
  padding: 0.75rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.mobile-price-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.mobile-filters-actions {
  padding: 1.5rem;
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  display: flex;
  gap: 1rem;
  background: white;
  position: sticky;
  bottom: 0;
}

.mobile-clear-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.mobile-clear-btn:hover {
  background: #b91c1c;
}

.mobile-apply-btn {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  flex: 2;
  transition: all 0.3s ease;
}

.mobile-apply-btn:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
}

/* Carrinho Fixo */
.cart-button-fixed {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 999;
}

.cart-button-fixed:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(147, 51, 234, 0.5);
}

.cart-icon {
  font-size: 1.25rem;
}

.cart-count {
  background: rgba(255, 255, 255, 0.2);
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

/* Mensagem de Sucesso */
.success-alert {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: rgba(34, 197, 94, 0.95);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  z-index: 10000;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

.success-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
}

/* Responsividade */
@media (max-width: 1024px) {
  .sponsors-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .loja-content {
    grid-template-columns: 280px 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .desktop-sidebar {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .sponsors-section {
    padding: 2rem 0;
  }
  
  .sponsors-container {
    padding: 0 1rem;
  }
  
  .sponsors-title {
    font-size: 1.5rem;
  }
  
  .sponsors-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
  }
  
  .sponsor-card {
    padding: 1rem;
  }
  
  .loja-header {
    padding: 1.5rem 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .mobile-filter-btn {
    display: flex;
    align-self: flex-end;
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
    padding: 1.5rem 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

@media (max-width: 480px) {
  .sponsors-section {
    padding: 1.5rem 0;
  }
  
  .sponsors-title {
    font-size: 1.25rem;
  }
  
  .sponsors-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .sponsor-card {
    padding: 0.75rem;
  }
  
  .loja-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .mobile-filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 1rem;
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
  
  .mobile-filters-body {
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

@media (max-width: 360px) {
  .sponsors-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>