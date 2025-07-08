import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"

// Static imports instead of dynamic imports
import Home from "../views/Home.vue"
import Login from "../views/auth/Login.vue"
import Register from "../views/auth/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import Quizzes from "../views/Quizzes.vue"
import TakeQuiz from "../views/TakeQuiz.vue"
import CreateQuiz from "../views/CreateQuiz.vue"
import Profile from "../views/Profile.vue"
import AdminDashboard from "../views/admin/AdminDashboard.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/quizzes",
    name: "Quizzes",
    component: Quizzes,
    meta: { requiresAuth: true },
  },
  {
    path: "/quiz/:id",
    name: "TakeQuiz",
    component: TakeQuiz,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-quiz",
    name: "CreateQuiz",
    component: CreateQuiz,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Catch-all route for 404s
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard")
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/dashboard")
  } else {
    next()
  }
})

export default router
