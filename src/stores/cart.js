import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI } from '../api'

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
