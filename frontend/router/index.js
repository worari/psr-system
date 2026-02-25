import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Auth Pages
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'

// Main Pages
import Dashboard from '../pages/Dashboard.vue'
import CreateRequest from '../pages/requests/CreateRequest.vue'
import RequestList from '../pages/requests/RequestList.vue'
import RequestDetail from '../pages/requests/RequestDetail.vue'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import UserApproval from '../pages/admin/UserApproval.vue'
import RequestReview from '../pages/admin/RequestReview.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/register',
    component: Register,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/reset-password/:token',
    component: ResetPassword,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/requests',
    component: RequestList,
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/requests/create',
    component: CreateRequest,
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/requests/:id',
    component: RequestDetail,
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'main' }
  },
  {
    path: '/admin/users',
    component: UserApproval,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'main' }
  },
  {
    path: '/admin/requests/:id',
    component: RequestReview,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'main' }
  },
  {
    path: '/',
    redirect: () => {
      return store.getters.isAuthenticated ? '/dashboard' : '/login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const isAdmin = store.getters.isAdmin

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (requiresAdmin && !isAdmin) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
