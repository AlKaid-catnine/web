import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const routes = [
  { path: '/', name: 'home', component: () => import('./views/Home.vue') },
  { path: '/category/:cat', name: 'category', component: () => import('./views/Category.vue') },
  { path: '/product/:id', name: 'product', component: () => import('./views/ProductDetail.vue') },
  { path: '/cart', name: 'cart', component: () => import('./views/Cart.vue') },
  { path: '/favorites', name: 'favorites', component: () => import('./views/Favorites.vue') },
  { path: '/user', name: 'user', component: () => import('./views/User.vue') },
  { path: '/search', name: 'search', component: () => import('./views/Search.vue') },
  { path: '/orders', name: 'orders', component: () => import('./views/Orders.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
