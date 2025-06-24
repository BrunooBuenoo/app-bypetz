<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Botão Fechar -->
      <button class="close-button" @click="closeModal">
        <i class="fas fa-times"></i>
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
            
            <!-- Botão Favorito -->
            <button class="favorite-button" @click="toggleFavorite">
              <i class="fas fa-heart" :class="{ active: isFavorite }"></i>
            </button>
            
            <!-- Navegação de Imagens -->
            <div v-if="produto.imagens && produto.imagens.length > 1" class="image-navigation">
              <button 
                @click="previousImage" 
                class="nav-button prev"
                :disabled="currentImageIndex === 0"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="nextImage" 
                class="nav-button next"
                :disabled="currentImageIndex === produto.imagens.length - 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <!-- Miniaturas -->
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
              <i class="fas fa-box"></i>
              <span v-if="produto.estoque > 0">{{ produto.estoque }} unidades em estoque</span>
              <span v-else>Produto esgotado</span>
            </div>
          </div>
          
          <!-- Controle de Quantidade -->
          <div class="quantity-section">
            <label class="quantity-label">QUANTIDADE</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" class="quantity-btn" :disabled="quantity <= 1">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">{{ quantity }}</span>
              <button @click="increaseQuantity" class="quantity-btn" :disabled="quantity >= produto.estoque">
                <i class="fas fa-plus"></i>
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
          
          <!-- Descrição Completa -->
          <div class="description-section">
            <h3 class="section-title">DESCRIÇÃO</h3>
            <p class="product-description">
              {{ produto.descricaoCompleta || produto.descricao || 'Produto de alta qualidade para seu pet. Fabricado com materiais duráveis e seguros, ideal para o dia a dia do seu melhor amigo. Proporciona conforto e diversão, garantindo momentos especiais entre você e seu animal de estimação.' }}
            </p>
          </div>
          
          <!-- Botão Adicionar ao Carrinho -->
          <button 
            @click="handleAddToCart"
            class="add-to-cart-modal-btn"
            :disabled="loading || produto.estoque === 0 || quantity <= 0"
          >
            <i class="fas fa-shopping-cart"></i>
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
  emits: ['close', 'adicionar'], // Corrigido: mudou de 'add-to-cart' para 'adicionar'
  setup(props, { emit }) {
    const loading = ref(false)
    const quantity = ref(1)
    const currentImageIndex = ref(0)
    const isFavorite = ref(false)
    const placeholderImage = 'https://via.placeholder.com/400x300/8C52FF/FFFFFF?text=Produto'

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

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
    }

    // Função corrigida do botão adicionar ao carrinho
    const handleAddToCart = async () => {
      // Validações
      if (props.produto.estoque === 0 || loading.value || quantity.value <= 0) return
      
      if (quantity.value > props.produto.estoque) {
        alert(`Quantidade solicitada (${quantity.value}) excede o estoque disponível (${props.produto.estoque})`)
        quantity.value = props.produto.estoque
        return
      }
      
      loading.value = true
      try {
        console.log('Emitindo evento adicionar com:', { produto: props.produto, quantidade: quantity.value }) // Debug
        
        // Emite o evento com o produto e a quantidade selecionada
        emit('adicionar', {
          produto: props.produto,
          quantidade: quantity.value
        })
        
        // Feedback visual
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Opcional: fechar modal após adicionar
        // emit('close')
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error)
      } finally {
        loading.value = false
      }
    }

    // Reset quando o modal abre
    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        quantity.value = 1
        currentImageIndex.value = 0
        isFavorite.value = false
      }
    })

    // Validar quantidade quando o estoque muda
    watch(() => props.produto.estoque, (newStock) => {
      if (quantity.value > newStock) {
        quantity.value = Math.max(1, newStock)
      }
    })

    return {
      loading,
      quantity,
      currentImageIndex,
      isFavorite,
      currentImage,
      formatPrice,
      onImageError,
      closeModal,
      increaseQuantity,
      decreaseQuantity,
      nextImage,
      previousImage,
      setCurrentImage,
      toggleFavorite,
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10001;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: white;
  transform: scale(1.1);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

/* Seção da Imagem */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

.main-image-container {
  position: relative;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgb(204, 204, 204);
  font-size: 30px;
}

.favorite-button:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-button i.active {
  color: #FF4444;
  font-size: 40px;
  transition: all 0.2s ease;
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  transform: translateY(-50%);
}

.nav-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  background: white;
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
  padding: 0.5rem 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail.active {
  border-color: #8C52FF;
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
  gap: 0.2rem;
}

.product-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.product-code {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.pricing-section {
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

.sale-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #414141;
}

.discount-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.discount-badge {
  background: #FF4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.savings {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.price-normal {
  display: flex;
}

.regular-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #414141;
}

.stock-section {
  padding: 0.5rem 0;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-weight: 500;
}

.stock-info.low-stock {
  color: #ffc107;
}

.stock-info.out-of-stock {
  color: #dc3545;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.quantity-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #8C52FF;
  color: white;
  border-color: #8C52FF;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  min-width: 30px;
  text-align: center;
}

.quantity-limit {
  font-size: 0.8rem;
  color: #666;
}

.category-section,
.description-section {
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.description-section p{
    font-size: 12px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.category-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-badge {
  background: #8C52FF;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.subcategory-badge {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.product-description {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.add-to-cart-modal-btn {
  background: #0077ff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: auto;
}

.add-to-cart-modal-btn:hover:not(:disabled) {
  background: #01037ce5;
  transform: translateY(-2px);
}

.add-to-cart-modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #6c757d;
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 2rem;
  }
  
  .thumbnails {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-body {
    padding: 1rem;
    gap: 1rem;
  }
  
  .product-title {
    font-size: 1.3rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 1.8rem;
  }
  
  .close-button {
    width: 35px;
    height: 35px;
  }
  
  .add-to-cart-modal-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }

  .favorite-button{
    top: 1rem;
    right: 22rem;
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 360px) {
  .modal-body {
    padding: 0.75rem;
  }
  
  .product-title {
    font-size: 1.2rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 1.6rem;
  }
  
  .quantity-controls {
    gap: 0.75rem;
  }
  
  .quantity-btn {
    width: 35px;
    height: 35px;
  }
}
</style>
