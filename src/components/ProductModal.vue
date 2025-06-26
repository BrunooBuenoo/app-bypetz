<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">
        ✕
      </button>
      
      <div class="modal-body">
        <!-- Seção da Imagem -->
        <div class="image-section">
          <div class="main-image-container">
            <img 
              :src="currentImage" 
              :alt="produto.nome"
              class="main-image"
              @error="onImageError"
            />
            
            <div v-if="produto.imagens && produto.imagens.length > 1" class="image-navigation">
              <button 
                @click="previousImage" 
                class="nav-button"
                :disabled="currentImageIndex === 0"
              >
                ‹
              </button>
              <button 
                @click="nextImage" 
                class="nav-button"
                :disabled="currentImageIndex === produto.imagens.length - 1"
              >
                ›
              </button>
            </div>
          </div>
          
          <div v-if="produto.imagens && produto.imagens.length > 1" class="thumbnails">
            <div 
              v-for="(imagem, index) in produto.imagens" 
              :key="index"
              class="thumbnail"
              :class="{ active: index === currentImageIndex }"
              @click="setCurrentImage(index)"
            >
              <img :src="imagem" :alt="`${produto.nome} - ${index + 1}`" />
            </div>
          </div>
        </div>
        
        <!-- Seção de Informações -->
        <div class="info-section">
          <div class="product-header">
            <h2 class="product-title">{{ produto.nome }}</h2>
            <p class="product-code">COD: {{ produto.codigo || 'N/A' }}</p>
          </div>
          
          <!-- Preços -->
          <div class="pricing-section">
            <div v-if="produto.emOferta && produto.percentualDesconto" class="price-with-discount">
              <span class="original-price">R$ {{ formatPrice(produto.precoOriginal) }}</span>
              <span class="sale-price">R$ {{ formatPrice(produto.preco) }}</span>
              <div class="discount-info">
                <span class="discount-badge">-{{ produto.percentualDesconto }}%</span>
                <span class="savings">Economia: R$ {{ formatPrice(produto.precoOriginal - produto.preco) }}</span>
              </div>
            </div>
            <div v-else class="price-normal">
              <span class="regular-price">R$ {{ formatPrice(produto.preco) }}</span>
            </div>
          </div>
          
          <!-- Estoque -->
          <div class="stock-section">
            <div class="stock-info" :class="{ 'low-stock': produto.estoque <= 5, 'out-of-stock': produto.estoque === 0 }">
              <span class="stock-indicator"></span>
              <span v-if="produto.estoque > 0">{{ produto.estoque }} unidades em estoque</span>
              <span v-else>Produto esgotado</span>
            </div>
          </div>
          
          <!-- Controle de Quantidade -->
          <div class="quantity-section">
            <label class="quantity-label">QUANTIDADE</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" class="quantity-btn" :disabled="quantity <= 1">
                −
              </button>
              <span class="quantity-display">{{ quantity }}</span>
              <button @click="increaseQuantity" class="quantity-btn" :disabled="quantity >= produto.estoque">
                +
              </button>
            </div>
            <span class="quantity-limit" v-if="produto.estoque > 0">Máximo: {{ produto.estoque }} unidades</span>
          </div>
          
          <!-- Categoria -->
          <div class="category-section">
            <h3 class="section-title">CATEGORIA</h3>
            <div class="category-badges">
              <span class="category-badge">{{ produto.categoria }}</span>
              <span v-if="produto.subcategoria" class="subcategory-badge">{{ produto.subcategoria }}</span>
            </div>
          </div>
          
          <!-- Descrição -->
          <div class="description-section">
            <h3 class="section-title">DESCRIÇÃO</h3>
            <p class="product-description">
              {{ produto.descricaoCompleta || produto.descricao || 'Produto de alta qualidade para seu pet. Fabricado com materiais duráveis e seguros, ideal para o dia a dia do seu melhor amigo.' }}
            </p>
          </div>
          
          <!-- Botão Adicionar ao Carrinho -->
          <button 
            @click="handleAddToCart"
            class="add-to-cart-modal-btn"
            :disabled="loading || produto.estoque === 0 || quantity <= 0"
          >
            <span v-if="produto.estoque === 0">PRODUTO ESGOTADO</span>
            <span v-else-if="loading">ADICIONANDO...</span>
            <span v-else>ADICIONAR {{ quantity }} {{ quantity === 1 ? 'ITEM' : 'ITENS' }} AO CARRINHO</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ProductModal',
  props: {
    produto: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'adicionar'],
  setup(props, { emit }) {
    const loading = ref(false)
    const quantity = ref(1)
    const currentImageIndex = ref(0)
    const placeholderImage = 'https://via.placeholder.com/400x300/9333ea/FFFFFF?text=Produto'

    const currentImage = computed(() => {
      if (props.produto.imagens && props.produto.imagens.length > 0) {
        return props.produto.imagens[currentImageIndex.value] || placeholderImage
      }
      return props.produto.imagem || placeholderImage
    })

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const onImageError = (event) => {
      event.target.src = placeholderImage
    }

    const closeModal = () => {
      emit('close')
    }

    const increaseQuantity = () => {
      if (quantity.value < props.produto.estoque) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const nextImage = () => {
      if (props.produto.imagens && currentImageIndex.value < props.produto.imagens.length - 1) {
        currentImageIndex.value++
      }
    }

    const previousImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--
      }
    }

    const setCurrentImage = (index) => {
      currentImageIndex.value = index
    }

    const handleAddToCart = async () => {
      if (props.produto.estoque === 0 || loading.value || quantity.value <= 0) return
      
      if (quantity.value > props.produto.estoque) {
        alert(`Quantidade solicitada (${quantity.value}) excede o estoque disponível (${props.produto.estoque})`)
        quantity.value = props.produto.estoque
        return
      }
      
      loading.value = true
      try {
        emit('adicionar', {
          produto: props.produto,
          quantidade: quantity.value
        })
        
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        quantity.value = 1
        currentImageIndex.value = 0
      }
    })

    watch(() => props.produto.estoque, (newStock) => {
      if (quantity.value > newStock) {
        quantity.value = Math.max(1, newStock)
      }
    })

    return {
      loading,
      quantity,
      currentImageIndex,
      currentImage,
      formatPrice,
      onImageError,
      closeModal,
      increaseQuantity,
      decreaseQuantity,
      nextImage,
      previousImage,
      setCurrentImage,
      handleAddToCart
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1.25rem;
  max-width: 1000px;
  width: 100%;
  height: 80vh;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10001;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  color: #6b7280;
  backdrop-filter: blur(10px);
}

.close-button:hover {
  background: white;
  color: #374151;
  transform: scale(1.1);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  overflow: hidden;
}

/* Seção da Imagem */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 5rem;
  background: white;
}

.main-image-container {
  position: relative;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 1;
  flex: 1;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 0.75rem;
  transform: translateY(-50%);
}

.nav-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  color: #6b7280;
  backdrop-filter: blur(10px);
}

.nav-button:hover:not(:disabled) {
  background: white;
  color: #374151;
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail.active {
  border-color: #9333ea;
}

.thumbnail:hover {
  border-color: #c4b5fd;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Seção de Informações */
.info-section {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
  gap: 1rem;
  background: rgba(229, 231, 235, 0.4);
}

.product-header {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.product-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.product-code {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0;
  background: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: inline-block;
}

.pricing-section {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original-price {
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 400;
}

.sale-price,
.regular-price {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
}

.discount-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.discount-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.savings {
  color: #059669;
  font-weight: 600;
  font-size: 0.8rem;
}

.stock-section {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.stock-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.stock-info.low-stock {
  color: #f59e0b;
}

.stock-info.low-stock .stock-indicator {
  background: #f59e0b;
}

.stock-info.out-of-stock {
  color: #ef4444;
}

.stock-info.out-of-stock .stock-indicator {
  background: #ef4444;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.quantity-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quantity-btn {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
}

.quantity-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  min-width: 24px;
  text-align: center;
}

.quantity-limit {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-section,
.description-section {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem 0;
}

.category-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-badge {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.subcategory-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-description {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  font-size: 0.875rem;
}

.add-to-cart-modal-btn {
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.75rem;
}

.add-to-cart-modal-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3);
}

.add-to-cart-modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #9ca3af;
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-content {
    height: 90vh;
    max-width: 95vw;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
  
  .image-section {
    padding: 1.25rem;
  }
  
  .info-section {
    padding: 1.25rem;
    overflow-y: visible;
  }
  
  .product-title {
    font-size: 1.25rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    height: 95vh;
    border-radius: 1rem;
  }
  
  .image-section,
  .info-section {
    padding: 1rem;
  }
  
  .product-title {
    font-size: 1.125rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 1.375rem;
  }
  
  .add-to-cart-modal-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.8rem;
  }
}
</style>