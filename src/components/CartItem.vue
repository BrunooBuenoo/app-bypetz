<template>
  <div class="cart-item">
    <div class="item-image">
      <img 
        :src="item.imagem || placeholderImage" 
        :alt="item.nome"
        @error="onImageError"
      />
    </div>
    
    <div class="item-details">
      <h4 class="item-name">{{ item.nome }}</h4>
      <div class="item-price">R$ {{ formatPrice(item.preco) }}</div>
      
      <div class="quantity-controls">
        <button 
          @click="decreaseQuantity"
          class="quantity-btn"
          :disabled="item.quantidade <= 1"
        >
          <i class="fas fa-minus"></i>
        </button>
        
        <span class="quantity">{{ item.quantidade }}</span>
        
        <button 
          @click="increaseQuantity"
          class="quantity-btn"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <div class="item-actions">
      <div class="subtotal">
        <span class="subtotal-label">Subtotal:</span>
        <span class="subtotal-value">R$ {{ formatPrice(subtotal) }}</span>
      </div>
      
      <button 
        @click="handleRemove"
        class="remove-btn"
        title="Remover item"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['remover', 'atualizar-quantidade'],
  setup(props, { emit }) {
    const placeholderImage = 'https://via.placeholder.com/80x80/8C52FF/FFFFFF?text=Item'

    const subtotal = computed(() => {
      return props.item.preco * props.item.quantidade
    })

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const onImageError = (event) => {
      event.target.src = placeholderImage
    }

    const handleRemove = () => {
      emit('remover', props.item.id)
    }

    const increaseQuantity = () => {
      emit('atualizar-quantidade', props.item.id, props.item.quantidade + 1)
    }

    const decreaseQuantity = () => {
      if (props.item.quantidade > 1) {
        emit('atualizar-quantidade', props.item.id, props.item.quantidade - 1)
      }
    }

    return {
      placeholderImage,
      subtotal,
      formatPrice,
      onImageError,
      handleRemove,
      increaseQuantity,
      decreaseQuantity
    }
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.item-price {
  font-size: 0.9rem;
  color: #8C52FF;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(140, 82, 255, 0.3);
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(140, 82, 255, 0.2);
  border-color: rgba(140, 82, 255, 0.5);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.subtotal-label {
  font-size: 0.8rem;
  color: #666;
}

.subtotal-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #8C52FF;
}

.remove-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .item-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .subtotal {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
