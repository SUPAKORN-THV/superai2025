import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Lazy-loaded pages (V0 already generated these files)
const LandingPage        = () => import('@/pages/LandingPage.vue');
const Login              = () => import('@/pages/Login.vue');
const Register         = () => import('@/pages/Register.vue');
const StudentDashboard   = () => import('@/pages/StudentDashboard.vue');
const AdminDashboard     = () => import('@/pages/AdminDashboard.vue');
const QuizDesigner       = () => import('@/pages/QuizDesigner.vue');
const TakeQuiz           = () => import('@/pages/TakeQuiz.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',              component: LandingPage },
    { path: '/login',         component: Login, meta: { guestOnly: true } },
    { path: '/register',   component: Register,  meta: { guestOnly: true } },
    { path: '/dashboard',     component: StudentDashboard, meta: { auth: true } },
    { path: '/admin',         component: AdminDashboard,  meta: { auth: true, admin: true } },
    { path: '/designer',      component: QuizDesigner,    meta: { auth: true, admin: true } },
    { path: '/quiz/:id',      component: TakeQuiz,        meta: { auth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
});

// ── Global guard ────────────────────────────────────────────────────────────────
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();

  // Wait for Pinia hydration in SPA reload
  if (!auth.ready) await auth.init();

  // Guest-only pages
  if (to.meta.guestOnly && auth.loggedIn) return next('/dashboard');

  // Auth-only pages
  if (to.meta.auth && !auth.loggedIn) return next('/login');

  // Admin-only
  if (to.meta.admin && auth.user?.role !== 'admin') return next('/dashboard');

  next();
});

export default router;
