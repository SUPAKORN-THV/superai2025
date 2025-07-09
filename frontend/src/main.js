import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"
import { useAuthStore } from "./stores/auth"
import "./style.css"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state
const authStore = useAuthStore()
if (authStore.token) {
  authStore.checkAuth()
}

app.mount("#app")
