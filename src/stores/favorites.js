import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favAPI } from '../api'

export const useFavStore = defineStore('favorites', () => {
  const items = ref<any[]>([])
  const ids = ref<number[]>([])
  const count = computed(() => ids.value.length)

  function init() {
    if (localStorage.getItem('token')) {
      favAPI.list().then(res => { items.value = res.data; ids.value = res.data.map((p: any) => p.id) }).catch(() => {})
    }
  }

  function toggle(productId: number) {
    return favAPI.toggle(productId).then(res => {
      ids.value = res.data
      return favAPI.list().then(res2 => { items.value = res2.data })
    })
  }

  function isFav(productId: number) { return ids.value.includes(productId) }

  return { items, ids, count, init, toggle, isFav }
})
