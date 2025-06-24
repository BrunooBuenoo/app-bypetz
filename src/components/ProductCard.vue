<template>
  <div class="product-card">
    <div class="product-image">
      <img 
        :src="produto.imagem || placeholderImage" 
        :alt="produto.nome"
        @error="onImageError"
      />
      <div v-if="produto.categoria" class="category-badge">
        {{ produto.categoria }}
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ produto.nome }}</h3>
      <p v-if="produto.descricao" class="product-description">
        {{ produto.descricao }}
      </p>
      <div class="product-price">
        R$ {{ formatPrice(produto.preco) }}
      </div>
      
      <button 
        @click="handleAddToCart"
        class="add-to-cart-btn"
        :disabled="loading"
      >
        <i class="fas fa-shopping-cart"></i>
        {{ loading ? 'Adicionando...' : 'Adicionar ao Carrinho' }}
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
  emits: ['adicionar'],
  setup(props, { emit }) {
    const loading = ref(false)
    const placeholderImage = 'https://via.placeholder.com/300x200/8C52FF/FFFFFF?text=Produto'

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const onImageError = (event) => {
      event.target.src = placeholderImage
    }

    const handleAddToCart = async () => {
      loading.value = true
      try {
        emit('adicionar', props.produto)
        // Pequeno delay para feedback visual
        await new Promise(resolve => setTimeout(resolve, 300))
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      placeholderImage,
      formatPrice,
      onImageError,
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
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(140, 82, 255, 0.2);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(140, 82, 255, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #8C52FF;
  margin-bottom: 1rem;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8C52FF;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-price {
    font-size: 1.3rem;
  }
}
</style>
