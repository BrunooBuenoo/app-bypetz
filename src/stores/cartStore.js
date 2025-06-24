import { reactive, watch } from "vue"

const state = reactive({
  items: [],
})

// Função para carregar dados do localStorage
const loadFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart-items")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      // Validar se é um array válido
      if (Array.isArray(parsedCart)) {
        state.items.splice(0, state.items.length, ...parsedCart)
        console.log("Carrinho carregado do localStorage:", parsedCart.length, "itens")
      }
    }
  } catch (error) {
    console.error("Erro ao carregar carrinho do localStorage:", error)
    state.items.splice(0, state.items.length)
  }
}

// Função para salvar no localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem("cart-items", JSON.stringify(state.items))
    console.log("Carrinho salvo no localStorage:", state.items.length, "itens")
  } catch (error) {
    console.error("Erro ao salvar carrinho no localStorage:", error)
  }
}

// Watch para salvar automaticamente quando items mudar
watch(() => state.items, saveToStorage, { deep: true })

// Carregar dados na inicialização
loadFromStorage()

export const useCartStore = () => {
  const addItem = (produto) => {
    console.log("Adicionando produto ao carrinho:", produto.nome)

    const existingItem = state.items.find((item) => item.id === produto.id)

    if (existingItem) {
      existingItem.quantidade += 1
      console.log("Quantidade atualizada para:", existingItem.quantidade)
    } else {
      state.items.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        categoria: produto.categoria,
        subcategoria: produto.subcategoria,
        estoque: produto.estoque,
        quantidade: 1,
      })
      console.log("Novo item adicionado ao carrinho")
    }
  }

  const removeItem = (itemId) => {
    console.log("Removendo item do carrinho:", itemId)
    const index = state.items.findIndex((item) => item.id === itemId)
    if (index > -1) {
      state.items.splice(index, 1)
      console.log("Item removido com sucesso")
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    console.log("Atualizando quantidade:", itemId, "para", newQuantity)

    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const item = state.items.find((item) => item.id === itemId)
    if (item) {
      // Verificar se a nova quantidade não excede o estoque (se disponível)
      if (item.estoque && newQuantity > item.estoque) {
        console.warn("Quantidade solicitada excede o estoque disponível")
        item.quantidade = item.estoque
      } else {
        item.quantidade = newQuantity
        console.log("Quantidade atualizada com sucesso")
      }
    }
  }

  const clearCart = () => {
    console.log("Limpando carrinho")
    state.items.splice(0, state.items.length)
  }

  const getTotal = () => {
    return state.items.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  const getItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantidade, 0)
  }

  const getItemQuantity = (productId) => {
    const item = state.items.find((item) => item.id === productId)
    return item ? item.quantidade : 0
  }

  const isInCart = (productId) => {
    return state.items.some((item) => item.id === productId)
  }

  return {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemsCount,
    getItemQuantity,
    isInCart,
  }
}
