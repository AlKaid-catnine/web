<template>
  <div class="category-page">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>{{ currentCat }}</span>
      </div>

      <div class="category-layout">
        <!-- Left Sidebar -->
        <aside class="sidebar">
          <h3>商品分类</h3>
          <ul class="cat-nav">
            <li v-for="cat in allCategories" :key="cat.name">
              <router-link :to="'/category/' + cat.name"
                           :class="{ active: currentCat === cat.name }">
                <i :class="cat.icon"></i> {{ cat.name }}
                <span>({{ cat.count }})</span>
              </router-link>
            </li>
          </ul>
          <div class="filter-group">
            <h4>价格区间</h4>
            <div class="price-inputs">
              <input type="number" v-model="filterMin" placeholder="最低价" @change="applyFilter">
              <span>-</span>
              <input type="number" v-model="filterMax" placeholder="最高价" @change="applyFilter">
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="cat-main">
          <!-- Sort Bar -->
          <div class="sort-bar">
            <span class="result-count">共 {{ total }} 件商品</span>
            <div class="sort-options">
              <button :class="{ active: sortBy === 'default' }" @click="setSort('default')">综合</button>
              <button :class="{ active: sortBy === 'sales' }" @click="setSort('sales')">销量 <i class="fas fa-sort"></i></button>
              <button :class="{ active: sortBy === 'price_asc' }" @click="setSort('price_asc')">价格 <i class="fas fa-sort-up"></i></button>
              <button :class="{ active: sortBy === 'price_desc' }" @click="setSort('price_desc')">价格 <i class="fas fa-sort-down"></i></button>
              <button :class="{ active: sortBy === 'rating' }" @click="setSort('rating')">评分 <i class="fas fa-sort"></i></button>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="product-grid" v-if="products.length">
            <div class="product-card" v-for="p in products" :key="p.id">
              <div class="product-img" @click="$router.push('/product/' + p.id)">
                <img :src="p.image" :alt="p.name">
                <div class="product-actions">
                  <button @click.stop="toggleFav(p.id)" :class="{ active: isFav(p.id) }">
                    <i :class="isFav(p.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                  <button @click.stop="addToCart(p.id)"><i class="fas fa-shopping-bag"></i></button>
                </div>
              </div>
              <div class="product-info">
                <h4 @click="$router.push('/product/' + p.id)">{{ p.name }}</h4>
                <div class="price-row">
                  <span class="price">&yen;{{ p.price.toFixed(2) }}</span>
                  <span class="rating"><i class="fas fa-star"></i> {{ p.rating }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-state" v-else>
            <i class="fas fa-box-open"></i>
            <p>暂无商品</p>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button :disabled="page === 1" @click="goPage(page - 1)"><i class="fas fa-chevron-left"></i></button>
            <button v-for="p in totalPages" :key="p" :class="{ active: p === page }" @click="goPage(p)">{{ p }}</button>
            <button :disabled="page === totalPages" @click="goPage(page + 1)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productAPI } from '../api'
import { useFavStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const favStore = useFavStore()
const cartStore = useCartStore()

const isFav = (id) => favStore.isFav(id)
const toggleFav = (id) => favStore.toggle(id)
const addToCart = (id) => cartStore.add(id, 1)

const currentCat = computed(() => route.params.cat || '')
const allCategories = ref([
  { name: '家具', icon: 'fas fa-couch', count: 128 },
  { name: '饰品', icon: 'fas fa-gem', count: 256 },
  { name: '香氛', icon: 'fas fa-wind', count: 89 },
  { name: '餐厨', icon: 'fas fa-utensils', count: 167 },
  { name: '灯具', icon: 'fas fa-lightbulb', count: 94 },
  { name: '收纳', icon: 'fas fa-box', count: 73 }
])

const products = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 12
const totalPages = computed(() => Math.ceil(total.value / pageSize))
const sortBy = ref('default')
const filterMin = ref('')
const filterMax = ref('')

function setSort(s) {
  sortBy.value = s
  page.value = 1
  loadProducts()
}

function applyFilter() {
  page.value = 1
  loadProducts()
}

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  loadProducts()
}

async function loadProducts() {
  const params = {
    category: currentCat.value,
    page: page.value,
    limit: pageSize,
    sort: sortBy.value,
    minPrice: filterMin.value || undefined,
    maxPrice: filterMax.value || undefined
  }
  try {
    const res = await productAPI.list(params)
    products.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (e) {
    products.value = []
    total.value = 0
  }
}

watch(() => route.params.cat, () => { page.value = 1; loadProducts() }, { immediate: true })
onMounted(() => { if (!products.value.length) loadProducts() })
</script>

<style scoped>
.category-page { padding: 30px 0 60px; }
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 25px; font-size: 0.9rem; color: var(--text-light); }
.breadcrumb a { color: var(--text-light); transition: var(--transition); }
.breadcrumb a:hover { color: var(--gold); }
.breadcrumb i { font-size: 0.7rem; }

.category-layout { display: grid; grid-template-columns: 220px 1fr; gap: 30px; }

.sidebar { position: sticky; top: 90px; align-self: start; }
.sidebar h3 { font-size: 1.1rem; color: var(--dark); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid var(--gold); }
.cat-nav li { margin-bottom: 4px; }
.cat-nav a { display: flex; align-items: center; gap: 10px; padding: 10px 15px; border-radius: 8px; color: var(--text); font-size: 0.95rem; transition: var(--transition); }
.cat-nav a:hover, .cat-nav a.active { background: rgba(201,168,76,0.1); color: var(--gold); }
.cat-nav a span { margin-left: auto; font-size: 0.8rem; color: var(--text-light); }
.cat-nav a i { width: 20px; text-align: center; }

.filter-group { margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }
.filter-group h4 { font-size: 0.95rem; margin-bottom: 12px; color: var(--dark); }
.price-inputs { display: flex; align-items: center; gap: 8px; }
.price-inputs input { width: 80px; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.85rem; outline: none; transition: var(--transition); }
.price-inputs input:focus { border-color: var(--gold); }

.sort-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; padding: 15px 20px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); }
.result-count { font-size: 0.9rem; color: var(--text-light); }
.sort-options { display: flex; gap: 5px; }
.sort-options button { padding: 6px 14px; border: 1px solid #e0ddd8; background: none; border-radius: 20px; font-size: 0.85rem; color: var(--text); cursor: pointer; transition: var(--transition); }
.sort-options button:hover, .sort-options button.active { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.05); }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.product-card { background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); }
.product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.product-img { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 1; }
.product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-img img { transform: scale(1.08); }
.product-actions { position: absolute; bottom: 15px; right: 15px; display: flex; flex-direction: column; gap: 8px; opacity: 0; transform: translateY(10px); transition: var(--transition); }
.product-card:hover .product-actions { opacity: 1; transform: translateY(0); }
.product-actions button { width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.9); color: var(--dark); cursor: pointer; transition: var(--transition); }
.product-actions button:hover, .product-actions button.active { background: var(--gold); color: #fff; }
.product-info { padding: 15px; }
.product-info h4 { font-size: 0.95rem; color: var(--dark); cursor: pointer; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-info h4:hover { color: var(--gold); }
.price-row { display: flex; align-items: center; justify-content: space-between; }
.price { font-weight: 700; color: var(--dark); }
.rating { font-size: 0.85rem; color: var(--gold); }

.empty-state { text-align: center; padding: 80px 0; color: var(--text-light); }
.empty-state i { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }

.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 40px; }
.pagination button { width: 40px; height: 40px; border: 1px solid #e0ddd8; background: #fff; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: var(--transition); }
.pagination button:hover:not(:disabled), .pagination button.active { border-color: var(--gold); background: var(--gold); color: #fff; }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 768px) {
  .category-layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .sort-bar { flex-direction: column; gap: 10px; }
}
</style>
