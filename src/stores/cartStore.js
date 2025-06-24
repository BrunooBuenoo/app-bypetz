import { reactive } from "vue"

const state = reactive({
  items: [],
})

export const useCartStore = () => {
  const addItem = (produto) => {
    const existingItem = state.items.find((item) => item.id === produto.id)

    if (existingItem) {
      existingItem.quantidade += 1
    } else {
      state.items.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        categoria: produto.categoria,
        quantidade: 1,
      })
    }
  }

  const removeItem = (itemId) => {
    const index = state.items.findIndex((item) => item.id === itemId)
    if (index > -1) {
      state.items.splice(index, 1)
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    const item = state.items.find((item) => item.id === itemId)
    if (item && newQuantity > 0) {
      item.quantidade = newQuantity
    }
  }

  const clearCart = () => {
    state.items.splice(0, state.items.length)
  }

  const getTotal = () => {
    return state.items.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  const getItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantidade, 0)
  }

  return {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemsCount,
  }
}
