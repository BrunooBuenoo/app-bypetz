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
        -{{ produto.percentualDesconto }}%
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
        class="add-to-cart-btn"
        :disabled="loading || produto.estoque === 0"
      >
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
    const placeholderImage = 'https://via.placeholder.com/300x200/9333ea/FFFFFF?text=Produto'

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const onImageError = (event) => {
      event.target.src = placeholderImage
    }

    const openModal = () => {
      emit('abrir-produto', props.produto)
    }

    const handleAddToCart = async (event) => {
      if (props.produto.estoque === 0 || loading.value) return
      
      loading.value = true
      try {
        emit('adicionar', {
          produto: props.produto,
          quantidade: 1
        })
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
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.6);
  height: 550px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: rgba(147, 51, 234, 0.2);
}

.product-image {
  display: flex; /* Adicionado */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Já estava, centraliza verticalmente */
  width: 100%;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
}

.product-image img {
  width: 70%;
  height: auto; /* Use auto para manter a proporção */
  object-fit: contain; /* Alterado de cover para evitar corte da imagem */
  transition: transform 0.3s ease;
}


.product-card:hover .product-image img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
  background:rgba(229, 231, 235, 0.4);
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  height: 2.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-pricing {
  margin-top: auto;
  margin-bottom: 0.75rem;
}

.price-with-discount {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.original-price {
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 400;
}

.sale-price {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
}

.price-normal {
  display: flex;
}

.regular-price {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #9ca3af;
}

@media (max-width: 768px) {
  .product-card {
    height: 380px;
  }

  .product-info {
    padding: 1rem;
    gap: 0.5rem;
  }

  .product-name {
    font-size: 0.95rem;
    height: 2.4rem;
  }

  .product-description {
    font-size: 0.8rem;
    height: 2.4rem;
  }

  .sale-price,
  .regular-price {
    font-size: 1.25rem;
  }

  .add-to-cart-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .product-card {
    height: 400px;
  }

  .product-image {
    height: 160px;
  }

  .product-info {
    padding: 1rem;
  }

  .product-name {
    font-size: 0.9rem;
    height: 2.2rem;
  }

  .product-description {
    font-size: 0.75rem;
    height: 2.2rem;
  }

  .sale-price,
  .regular-price {
    font-size: 1.2rem;
  }

  .add-to-cart-btn {
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
  }
}
</style>