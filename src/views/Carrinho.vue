<template>
  <div class="carrinho-page">
    <div class="carrinho-container">
      <!-- Header do Carrinho -->
      <div class="carrinho-header">
        <h1>
          <i class="fas fa-shopping-cart"></i>
          Meu Carrinho
        </h1>
        <router-link to="/loja" class="continue-shopping-btn">
          <i class="fas fa-arrow-left"></i>
          Continuar Comprando
        </router-link>
      </div>

      <!-- Carrinho com itens -->
      <div v-if="cartItems.length > 0" class="carrinho-content">
        <div class="cart-items">
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
            :item="item"
            @remover="removeFromCart"
            @atualizar-quantidade="updateQuantity"
          />
        </div>

        <!-- Resumo do Pedido -->
        <div class="order-summary">
          <h3>Resumo do Pedido</h3>
          
          <div class="summary-line">
            <span>Subtotal ({{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }}):</span>
            <span>R$ {{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="summary-line">
            <span>Frete:</span>
            <span class="free-shipping">Grátis</span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-total">
            <span>Total:</span>
            <span>R$ {{ formatPrice(total) }}</span>
          </div>
          
          <router-link to="/finalizar" class="checkout-btn">
            <i class="fas fa-credit-card"></i>
            Finalizar Pedido
          </router-link>
          
          <div class="whatsapp-info">
            <i class="fab fa-whatsapp"></i>
            <span>Finalize via WhatsApp após gerar o número do pedido</span>
          </div>
        </div>
      </div>

      <!-- Carrinho vazio -->
      <div v-else class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos incríveis para seu pet!</p>
        <router-link to="/loja" class="shop-now-btn">
          <i class="fas fa-store"></i>
          Ir às Compras
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import CartItem from '../components/CartItem.vue'

export default {
  name: 'CarrinhoView',
  components: {
    CartItem
  },
  setup() {
    const cartStore = useCartStore()

    const cartItems = computed(() => cartStore.items)
    
    const totalItems = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantidade, 0)
    })
    
    const subtotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.preco * item.quantidade), 0)
    })
    
    const total = computed(() => subtotal.value) // Frete grátis

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const removeFromCart = (itemId) => {
      cartStore.removeItem(itemId)
    }

    const updateQuantity = (itemId, newQuantity) => {
      cartStore.updateQuantity(itemId, newQuantity)
    }

    return {
      cartItems,
      totalItems,
      subtotal,
      total,
      formatPrice,
      removeFromCart,
      updateQuantity
    }
  }
}
</script>

<style scoped>
.carrinho-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 0;
}

.carrinho-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.carrinho-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.carrinho-header h1 {
  color: #8C52FF;
  font-size: 2.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.continue-shopping-btn {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(140, 82, 255, 0.2);
}

.continue-shopping-btn:hover {
  background: rgba(140, 82, 255, 0.15);
  transform: translateY(-2px);
}

.carrinho-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-summary {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.1);
  border: 1px solid rgba(140, 82, 255, 0.1);
  position: sticky;
  top: 2rem;
}

.order-summary h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
}

.free-shipping {
  color: #22C55E;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(140, 82, 255, 0.3), transparent);
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  text-decoration: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
}

.whatsapp-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #25D366;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  background: rgba(37, 211, 102, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-cart-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.empty-cart h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-cart p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.shop-now-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8C52FF;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.shop-now-btn:hover {
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
}

@media (max-width: 768px) {
  .carrinho-container {
    padding: 0 1rem;
  }
  
  .carrinho-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .carrinho-header h1 {
    font-size: 1.8rem;
    justify-content: center;
  }
  
  .continue-shopping-btn {
    justify-content: center;
  }
  
  .carrinho-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .order-summary {
    position: static;
    order: -1;
  }
}
</style>
