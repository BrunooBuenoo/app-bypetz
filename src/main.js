
import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import { useAuth } from "./composables/useAuth"


const { initAuth } = useAuth()

const app = createApp(App)

// Inicializar autenticacao
initAuth()

app.use(router)
app.mount("#app")
