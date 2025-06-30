"use client"

import { createRouter, createWebHistory } from "vue-router"
import { useAuth } from "../composables/useAuth"

// Importar componentes existentes
import PaginaInicial from "../views/PaginaInicial.vue"
import PaginaFeed from "../views/PaginaFeed.vue"
import PaginaCadastrarPet from "../views/PaginaCadastrarPet.vue"
import PaginaLogin from "../views/PaginaLogin.vue"
import PaginaRegistro from "../views/PaginaRegistro.vue"
import PaginaPerfil from "../views/PaginaPerfil.vue"
import PaginaSobre from "../views/PaginaSobre.vue"
import PaginaContato from "../views/PaginaContato.vue"

// Importar novos componentes da loja
import Loja from "../views/Loja.vue"
import Carrinho from "../views/Carrinho.vue"
import FinalizarPedido from "../views/FinalizarPedido.vue"
import Dashboard from "../views/Dashboard.vue"
import Exemplo from "../components/Exemplo.vue" 
import Patrocinadores from "../views/Patrocinadores.vue"


const routes = [
  {
    path: "/",
    name: "Home",
    component: PaginaInicial,
  },
  {
    path: "/patrocinadores",
    name: "Patrocinadores",
    component: Patrocinadores,
  },
  {
    path: "/feed",
    name: "Feed",
    component: PaginaFeed,
  },
  {
    path: "/cadastrar-pet",
    name: "CadastrarPet",
    component: PaginaCadastrarPet,
    meta: { requiresAuth: true },
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: PaginaPerfil,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: PaginaLogin,
    meta: { requiresGuest: true },
  },
  {
    path: "/registro",
    name: "Registro",
    component: PaginaRegistro,
    meta: { requiresGuest: true },
  },
  {
    path: "/sobre",
    name: "Sobre",
    component: PaginaSobre,
  },
  {
    path: "/contato",
    name: "Contato",
    component: PaginaContato,
  },
  // 🛍️ ROTAS DA LOJA
  {
    path: "/loja",
    name: "Loja",
    component: Loja,
  },
  {
    path: "/carrinho",
    name: "Carrinho",
    component: Carrinho,
  },
  {
    path: "/finalizar",
    name: "FinalizarPedido",
    component: FinalizarPedido,
    meta: { requiresAuth: true },
  },
  // 🔐 ROTA ADMIN (Restrita)
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true 
    },
  },
  {
    path: "/exemplo",
    name: "ExemploComponente",
    component: Exemplo,
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegação com verificação de admin
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, loading, user } = useAuth()

  // Aguardar carregamento inicial
  let attempts = 0
  while (loading.value && attempts < 50) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    })
    return
  }

  // Verificar se a rota é apenas para visitantes
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: "Home" })
    return
  }

  // Verificar se a rota requer privilégios de admin
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated.value) {
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      })
      return
    }
    
    // Verificar se o usuário é admin (bruno.buens@gmail.com)
    if (user.value?.email !== 'bruno.buens@gmail.com') {
      next({ name: "Home" })
      return
    }
  }

  next()
})

export default router