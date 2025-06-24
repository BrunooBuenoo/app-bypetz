<template>
  <div class="loja-page">
    <div class="loja-container">
      <!-- Header da Loja -->
      <div class="loja-header">
        <h1>
          <i class="fas fa-store"></i>
          Loja ByPetz
        </h1>
        <p>Produtos de qualidade para seu melhor amigo</p>
      </div>

      <!-- Filtros de Categoria -->
      <CategoryFilter 
        :categorias="categorias"
        @filtrar="handleCategoryFilter"
      />

      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>

      <!-- Grid de Produtos -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard
          v-for="produto in filteredProducts"
          :key="produto.id"
          :produto="produto"
          @adicionar="addToCart"
        />
      </div>

      <!-- Sem produtos -->
      <div v-else class="no-products">
        <div class="no-products-icon">🛍️</div>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente selecionar uma categoria diferente</p>
      </div>

      <!-- Botão do Carrinho Fixo -->
      <router-link to="/carrinho" class="cart-button-fixed" v-if="cartItemsCount > 0">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">{{ cartItemsCount }}</span>
        <span class="cart-text">Carrinho</span>
      </router-link>

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
import CategoryFilter from '../components/CategoryFilter.vue'

export default {
  name: 'LojaView',
  components: {
    ProductCard,
    CategoryFilter
  },
  setup() {
    const cartStore = useCartStore()
    const loading = ref(true)
    const produtos = ref([])
    const categorias = ref([])
    const selectedCategory = ref(null)
    const successMessage = ref('')

    const filteredProducts = computed(() => {
      if (!selectedCategory.value) {
        return produtos.value
      }
      return produtos.value.filter(produto => produto.categoriaId === selectedCategory.value)
    })

    const cartItemsCount = computed(() => {
      return cartStore.items.reduce((total, item) => total + item.quantidade, 0)
    })

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
      }
    }

    const handleCategoryFilter = (categoryId) => {
      selectedCategory.value = categoryId
    }

    const addToCart = (produto) => {
      cartStore.addItem(produto)
      successMessage.value = `${produto.nome} adicionado ao carrinho!`
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }

    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          fetchCategorias(),
          fetchProdutos()
        ])
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      produtos,
      categorias,
      filteredProducts,
      cartItemsCount,
      successMessage,
      handleCategoryFilter,
      addToCart
    }
  }
}
</script>

<style scoped>
.loja-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 0;
}

.loja-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.loja-header {
  text-align: center;
  margin-bottom: 3rem;
}

.loja-header h1 {
  color: #8C52FF;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loja-header p {
  color: #666;
  font-size: 1.2rem;
  font-weight: 500;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 6rem;
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
  z-index: 1000;
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

@media (max-width: 768px) {
  .loja-container {
    padding: 0 1rem;
  }
  
  .loja-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
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
</style>
