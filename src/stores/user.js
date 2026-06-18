import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { authAPI, cartAPI, favAPI } from '../api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isLoggedIn = computed(() => !!token.value)

  function init() {
    if (token.value) {
      authAPI.me().then(res => { user.value = res.data }).catch(() => { logout() })
    }
  }

  function login(credentials) {
    return authAPI.login(credentials).then(res => {
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', token.value)
      return res
    })
  }

  function register(data) {
    return authAPI.register(data).then(res => {
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', token.value)
      return res
    })
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, init, login, register, logout }
})

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const totalQty = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  function init() {
    if (localStorage.getItem('token')) {
      cartAPI.list().then(res => { items.value = res.data }).catch(() => {})
    }
  }

  function add(productId, quantity, option) {
    return cartAPI.add({ productId, quantity, option }).then(res => { items.value = res.data })
  }

  function update(productId, qty) {
    return cartAPI.update(productId, { qty }).then(res => { items.value = res.data })
  }

  function remove(productId) {
    return cartAPI.remove(productId).then(res => { items.value = res.data })
  }

  return { items, totalQty, totalPrice, init, add, update, remove }
})

export const useFavStore = defineStore('favorites', () => {
  const items = ref([])
  const ids = ref([])
  const count = computed(() => ids.value.length)

  function init() {
    if (localStorage.getItem('token')) {
      favAPI.list().then(res => { items.value = res.data; ids.value = res.data.map(p => p.id) }).catch(() => {})
    }
  }

  function toggle(productId) {
    return favAPI.toggle(productId).then(res => {
      ids.value = res.data
      return favAPI.list().then(res2 => { items.value = res2.data })
    })
  }

  function isFav(productId) { return ids.value.includes(productId) }

  return { items, ids, count, init, toggle, isFav }
})
