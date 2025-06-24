<template>
  <div class="product-card" @click="openModal">
    <div class="product-image">
      <img 
        :src="produto.imagem || placeholderImage" 
        :alt="produto.nome"
        @error="onImageError"
      />
      <div v-if="produto.categoria" class="category-badge">
        {{ produto.categoria }}
      </div>
      <div v-if="produto.emOferta && produto.percentualDesconto" class="discount-badge">
        {{ produto.percentualDesconto }}%
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ produto.nome }}</h3>
      <p class="product-description">
        {{ produto.descricao || 'Produto de qualidade para seu pet. Fabricado com materiais duráveis e seguros, ideal para o dia a dia do seu melhor amigo.' }}
      </p>
      
      <div class="product-pricing">
        <div v-if="produto.emOferta && produto.percentualDesconto" class="price-with-discount">
          <span class="original-price">R$ {{ formatPrice(produto.precoOriginal) }}</span>
          <span class="sale-price">R$ {{ formatPrice(produto.preco) }}</span>
        </div>
        <div v-else class="price-normal">
          <span class="regular-price">R$ {{ formatPrice(produto.preco) }}</span>
        </div>
      </div>
  
      <button 
        @click.stop="handleAddToCart"
        class="add-to-cart-modal-btn"
        :disabled="loading || produto.estoque === 0"
      >
        <i class="fas fa-shopping-cart"></i>
        <span v-if="produto.estoque === 0">PRODUTO ESGOTADO</span>
        <span v-else-if="loading">ADICIONANDO...</span>
        <span v-else>ADICIONAR AO CARRINHO</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ProductCard',
  props: {
    produto: {
      type: Object,
      required: true
    }
  },
  emits: ['adicionar', 'abrir-produto'],
  setup(props, { emit }) {
    const loading = ref(false)
    const placeholderImage = 'https://via.placeholder.com/300x200/8C52FF/FFFFFF?text=Produto'

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const onImageError = (event) => {
      event.target.src = placeholderImage
    }

    const openModal = () => {
      console.log('Abrindo modal para produto:', props.produto.nome) // Debug
      emit('abrir-produto', props.produto)
    }

    const handleAddToCart = async (event) => {
      console.log('Adicionando ao carrinho:', props.produto.nome) // Debug
      
      if (props.produto.estoque === 0 || loading.value) return
      
      loading.value = true
      try {
        // Emite o evento com o produto e quantidade padrão de 1
        emit('adicionar', {
          produto: props.produto,
          quantidade: 1
        })
        // Pequeno delay para feedback visual
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      placeholderImage,
      formatPrice,
      onImageError,
      openModal,
      handleAddToCart
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  height: 450px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.02);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #8C52FF;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FF4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 250px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  height: 2.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 3);
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.product-pricing {
  margin-bottom: 1rem;
  height: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.original-price {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
  line-height: 1.2;
}

.sale-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #414141;
  line-height: 1.2;
}

.price-normal {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.regular-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #414141;
  line-height: 1.2;
}

.add-to-cart-modal-btn {
  background: #0077ff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.7rem;
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

@media (max-width: 768px) {
  .product-card {
    height: 420px;
  }
  
  .product-info {
    padding: 1rem;
    height: 220px;
  }
  
  .product-name {
    font-size: 1rem;
    height: 4rem;
  }
  
  .product-description {
    font-size: 0.8rem;
    height: 3.6rem;
    -webkit-line-clamp: 3;
  }
  
  .product-pricing {
    height: 3.2rem;
  }
  
  .sale-price,
  .regular-price {
    font-size: 1.2rem;
  }

  .add-to-cart-modal-btn{
    font-size: 0.5rem;
  }
}

@media (max-width: 480px) {
  .product-card {
    height: 380px;
  }
  
  .product-image {
    height: 160px;
  }
  
  .product-info {
    height: 220px;
  }
  
  .product-description {
    height: 3rem;
    -webkit-line-clamp: 2;
  }
  
  .product-pricing {
    height: 3rem;
  }
}

@media (max-width: 390px){

    .product-description {
    font-size: 0.7rem;
    height: 3.5rem;
  }

  .add-to-cart-modal-btn[data-v-a4cce9c2] {
    font-size: 0.49rem;
  }
}
</style>
