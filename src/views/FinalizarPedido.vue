<template>
  <div class="finalizar-page">
    <div class="finalizar-container">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Processando seu pedido...</p>
      </div>

      <!-- Pedido finalizado -->
      <div v-else-if="orderNumber" class="order-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        
        <h1>Pedido Criado com Sucesso!</h1>
        
        <div class="order-info">
          <div class="order-number">
            <span class="label">Número do Pedido:</span>
            <span class="number">{{ orderNumber }}</span>
            <button @click="copyOrderNumber" class="copy-btn" :title="copyText">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          
          <div class="order-total">
            <span class="label">Total:</span>
            <span class="value">R$ {{ formatPrice(orderTotal) }}</span>
          </div>
        </div>

        <div class="whatsapp-section">
          <h3>
            <i class="fab fa-whatsapp"></i>
            Finalize sua compra via WhatsApp
          </h3>
          
          <p>Envie o número do seu pedido via WhatsApp para concluir a compra:</p>
          
          <button @click="sendWhatsApp" class="whatsapp-btn">
            <i class="fab fa-whatsapp"></i>
            Enviar via WhatsApp
          </button>
          
          <div class="whatsapp-message">
            <strong>Mensagem que será enviada:</strong>
            <div class="message-preview">
              {{ whatsappMessage }}
            </div>
          </div>
        </div>

        <div class="order-items">
          <h3>Itens do Pedido</h3>
          <div class="items-list">
            <div v-for="item in orderItems" :key="item.id" class="order-item">
              <img :src="item.imagem || placeholderImage" :alt="item.nome" />
              <div class="item-details">
                <span class="item-name">{{ item.nome }}</span>
                <span class="item-quantity">Qtd: {{ item.quantidade }}</span>
                <span class="item-price">R$ {{ formatPrice(item.preco * item.quantidade) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <router-link to="/loja" class="btn-secondary">
            <i class="fas fa-store"></i>
            Continuar Comprando
          </router-link>
          
          <router-link to="/" class="btn-primary">
            <i class="fas fa-home"></i>
            Voltar ao Início
          </router-link>
        </div>
      </div>

      <!-- Erro -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Erro ao processar pedido</h2>
        <p>{{ error }}</p>
        <router-link to="/carrinho" class="btn-primary">
          <i class="fas fa-arrow-left"></i>
          Voltar ao Carrinho
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../composables/useAuth'
import { useCartStore } from '../stores/cartStore'
import { db } from '../firebase/config'

export default {
  name: 'FinalizarPedidoView',
  setup() {
    const router = useRouter()
    const { user } = useAuth()
    const cartStore = useCartStore()
    
    const loading = ref(true)
    const orderNumber = ref('')
    const orderTotal = ref(0)
    const orderItems = ref([])
    const error = ref('')
    const copyText = ref('Copiar')
    const placeholderImage = 'https://via.placeholder.com/60x60/8C52FF/FFFFFF?text=Item'

    const whatsappMessage = computed(() => {
      return `Olá! Gostaria de finalizar minha compra.\n\nNúmero do Pedido: ${orderNumber.value}\nTotal: R$ ${formatPrice(orderTotal.value)}\n\nObrigado!`
    })

    const formatPrice = (price) => {
      return Number(price).toFixed(2).replace('.', ',')
    }

    const generateOrderNumber = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `BP${timestamp}${random}`
    }

    const createOrder = async () => {
      if (!user.value) {
        error.value = 'Você precisa estar logado para finalizar o pedido'
        loading.value = false
        return
      }

      if (cartStore.items.length === 0) {
        error.value = 'Seu carrinho está vazio'
        loading.value = false
        return
      }

      try {
        const orderNum = generateOrderNumber()
        const total = cartStore.items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
        
        const orderData = {
          numeropedido: orderNum,
          produtos: cartStore.items.map(item => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
            imagem: item.imagem,
            categoria: item.categoria
          })),
          total: total,
          userId: user.value.uid,
          userEmail: user.value.email,
          userName: user.value.displayName || 'Cliente',
          status: 'pendente',
          criadoEm: serverTimestamp()
        }

        await addDoc(collection(db, 'pedidos'), orderData)

        orderNumber.value = orderNum
        orderTotal.value = total
        orderItems.value = [...cartStore.items]

        // Limpar carrinho
        cartStore.clearCart()

      } catch (err) {
        console.error('Erro ao criar pedido:', err)
        error.value = 'Erro ao processar pedido: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const copyOrderNumber = async () => {
      try {
        await navigator.clipboard.writeText(orderNumber.value)
        copyText.value = 'Copiado!'
        setTimeout(() => {
          copyText.value = 'Copiar'
        }, 2000)
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }
    }

    const sendWhatsApp = () => {
      const phone = '5514998886799' // Substitua pelo número da loja
      const message = encodeURIComponent(whatsappMessage.value)
      const whatsappUrl = `https://wa.me/${phone}?text=${message}`
      window.open(whatsappUrl, '_blank')
    }

    onMounted(() => {
      createOrder()
    })

    return {
      loading,
      orderNumber,
      orderTotal,
      orderItems,
      error,
      copyText,
      placeholderImage,
      whatsappMessage,
      formatPrice,
      copyOrderNumber,
      sendWhatsApp
    }
  }
}
</script>

<style scoped>
.finalizar-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem 0;
}

.finalizar-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
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

.order-success {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(140, 82, 255, 0.1);
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #22C55E;
  margin-bottom: 1.5rem;
}

.order-success h1 {
  color: #333;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.order-info {
  background: rgba(140, 82, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.order-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.order-number .label {
  color: #666;
  font-weight: 600;
}

.order-number .number {
  background: #8C52FF;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.copy-btn {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  border: 1px solid rgba(140, 82, 255, 0.3);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: rgba(140, 82, 255, 0.2);
}

.order-total {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.3rem;
}

.order-total .label {
  color: #666;
  font-weight: 600;
}

.order-total .value {
  color: #8C52FF;
  font-weight: 800;
}

.whatsapp-section {
  background: rgba(37, 211, 102, 0.05);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(37, 211, 102, 0.2);
}

.whatsapp-section h3 {
  color: #25D366;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.whatsapp-section p {
  color: #666;
  margin-bottom: 1.5rem;
}

.whatsapp-btn {
  background: #25D366;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.whatsapp-btn:hover {
  background: #128C7E;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
}

.whatsapp-message {
  text-align: left;
}

.whatsapp-message strong {
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
}

.message-preview {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(37, 211, 102, 0.3);
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  white-space: pre-line;
}

.order-items {
  margin-bottom: 2rem;
  text-align: left;
}

.order-items h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(140, 82, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.order-item img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: #333;
}

.item-quantity {
  color: #666;
  font-size: 0.9rem;
}

.item-price {
  color: #8C52FF;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(140, 82, 255, 0.4);
}

.btn-secondary {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  border: 1px solid rgba(140, 82, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(140, 82, 255, 0.15);
  transform: translateY(-2px);
}

.error-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.1);
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-icon {
  font-size: 4rem;
  color: #EF4444;
  margin-bottom: 1.5rem;
}

.error-container h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.error-container p {
  color: #666;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .finalizar-container {
    padding: 0 1rem;
  }
  
  .order-success {
    padding: 2rem;
  }
  
  .order-success h1 {
    font-size: 1.8rem;
  }
  
  .order-number {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
