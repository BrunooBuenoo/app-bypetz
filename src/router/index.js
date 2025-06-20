"use client"

import { createRouter, createWebHistory } from "vue-router"
import { useAuth } from "../composables/useAuth"

// Importar componentes
import PaginaInicial from "../views/PaginaInicial.vue"
import PaginaFeed from "../views/PaginaFeed.vue"
import PaginaCadastrarPet from "../views/PaginaCadastrarPet.vue"
import PaginaLogin from "../views/PaginaLogin.vue"
import PaginaRegistro from "../views/PaginaRegistro.vue"
import PaginaPerfil from "../views/PaginaPerfil.vue"
import PaginaSobre from "../views/PaginaSobre.vue"
import PaginaContato from "../views/PaginaContato.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: PaginaInicial,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegacao simplificado
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, loading } = useAuth()

  // Aguardar carregamento inicial
  let attempts = 0
  while (loading.value && attempts < 50) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    attempts++
  }

  // Verificar se a rota requer autenticacao
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    })
    return
  }

  // Verificar se a rota e apenas para visitantes
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: "Home" })
    return
  }

  next()
})

export default router