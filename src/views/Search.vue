<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索框 -->
      <div class="search-header">
        <div class="search-input-wrap">
          <input type="text" v-model="query" placeholder="搜索商品..." @keyup.enter="doSearch" ref="searchInput">
          <button @click="doSearch"><i class="fas fa-search"></i></button>
        </div>
      </div>

      <!-- 搜索历史 -->
      <div class="search-section" v-if="!searched && history.length">
        <div class="section-header">
          <h3>搜索历史</h3>
          <button class="clear-btn" @click="clearHistory">清空</button>
        </div>
        <div class="tag-list">
          <span class="tag" v-for="(h, i) in history" :key="i" @click="query = h; doSearch()">{{ h }}</span>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="search-section" v-if="!searched">
        <h3>热门搜索</h3>
        <div class="tag-list">
          <span class="tag hot" v-for="tag in hotTags" :key="tag" @click="query = tag; doSearch()">{{ tag }}</span>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="searched">
        <div class="results-header">
          <h3>"{{ lastQuery }}" 的搜索结果</h3>
          <span class="results-count">共 {{ total }} 件商品</span>
        </div>

        <!-- 排序栏 -->
        <div class="sort-bar">
          <span class="sort-item" :class="{ active: sort === 'default' }" @click="sort = 'default'; doSearch()">综合</span>
          <span class="sort-item" :class="{ active: sort === 'sales' }" @click="sort = 'sales'; doSearch()">销量</span>
          <span class="sort-item" :class="{ active: sort === 'price_asc' }" @click="sort = 'price_asc'; doSearch()">价格↑</span>
          <span class="sort-item" :class="{ active: sort === 'price_desc' }" @click="sort = 'price_desc'; doSearch()">价格↓</span>
          <span class="sort-item" :class="{ active: sort === 'rating' }" @click="sort = 'rating'; doSearch()">好评</span>
        </div>

        <!-- 结果网格 -->
        <div class="results-grid" v-if="results.length">
          <div class="product-card" v-for="item in results" :key="item.id" @click="$router.push('/product/' + item.id)">
            <div class="product-img">
              <img :src="item.image" :alt="item.name" loading="lazy">
              <span class="product-tag" :class="'tag-' + item.tag">{{ item.tagText }}</span>
            </div>
            <div class="product-info">
              <div class="category">{{ item.category }}</div>
              <h4>{{ item.name }}</h4>
              <div class="price">¥{{ item.price }}<span class="original" v-if="item.original">¥{{ item.original }}</span></div>
              <div class="rating">{{ '★'.repeat(Math.floor(item.rating)) }}{{ '☆'.repeat(5 - Math.floor(item.rating)) }} ({{ item.reviews }})</div>
            </div>
          </div>
        </div>

        <!-- 无结果 -->
        <div class="empty-state" v-else>
          <i class="fas fa-search"></i>
          <h3>未找到相关商品</h3>
          <p>试试其他关键词吧~</p>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
          <button :disabled="page === 1" @click="page--; doSearch()">上一页</button>
          <span class="page-info">{{ page }} / {{ totalPages }}</span>
          <button :disabled="page === totalPages" @click="page++; doSearch()">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { productAPI } from '../api'

const query = ref('')
const lastQuery = ref('')
const results = ref([])
const total = ref(0)
const totalPages = ref(0)
const page = ref(1)
const sort = ref('default')
const searched = ref(false)
const searchInput = ref(null)
const history = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
const hotTags = ['北欧', '香薰', '灯具', '花瓶', '抱枕', '地毯']

onMounted(() => {
  nextTick(() => searchInput.value?.focus())
})

function doSearch() {
  if (!query.value.trim()) return
  lastQuery.value = query.value.trim()
  page.value = 1
  searched.value = true
  fetchResults()
  // 保存历史
  if (!history.value.includes(lastQuery.value)) {
    history.value.unshift(lastQuery.value)
    if (history.value.length > 10) history.value.pop()
    localStorage.setItem('searchHistory', JSON.stringify(history.value))
  }
}

function fetchResults() {
  productAPI.list({
    keyword: lastQuery.value,
    sort: sort.value,
    page: page.value,
    pageSize: 8
  }).then(res => {
    results.value = res.data.list
    total.value = res.data.total
    totalPages.value = res.data.totalPages
  }).catch(() => {
    results.value = []
    total.value = 0
  })
}

function clearHistory() {
  history.value = []
  localStorage.removeItem('searchHistory')
}
</script>

<style scoped>
.search-page { padding: 40px 0; }
.search-header { margin-bottom: 30px; }
.search-input-wrap { display: flex; max-width: 600px; margin: 0 auto; background: var(--white); border: 2px solid var(--gold); border-radius: 30px; overflow: hidden; box-shadow: var(--shadow); }
.search-input-wrap input { flex: 1; padding: 15px 25px; border: none; outline: none; font-size: 1rem; font-family: inherit; background: none; }
.search-input-wrap button { padding: 15px 25px; border: none; background: var(--gold); color: var(--white); cursor: pointer; font-size: 1.1rem; transition: var(--transition); }
.search-input-wrap button:hover { background: var(--gold-dark); }

.search-section { margin-bottom: 25px; }
.search-section h3 { font-size: 1rem; color: var(--dark); margin-bottom: 12px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.clear-btn { background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 0.85rem; font-family: inherit; }
.clear-btn:hover { color: var(--gold); }
.tag-list { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { padding: 6px 16px; border-radius: 20px; background: var(--white); border: 1px solid #eee; font-size: 0.85rem; cursor: pointer; transition: var(--transition); }
.tag:hover { border-color: var(--gold); color: var(--gold); }
.tag.hot { border-color: var(--gold); color: var(--gold); }

.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.results-header h3 { font-size: 1.1rem; color: var(--dark); }
.results-count { font-size: 0.85rem; color: var(--text-light); }

.sort-bar { display: flex; gap: 20px; padding: 15px 0; border-bottom: 1px solid #eee; margin-bottom: 25px; }
.sort-item { cursor: pointer; font-size: 0.9rem; color: var(--text-light); transition: var(--transition); padding: 5px 0; }
.sort-item:hover { color: var(--gold); }
.sort-item.active { color: var(--gold); font-weight: 600; }

.results-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
.product-card { background: var(--white); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); cursor: pointer; }
.product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.product-img { position: relative; height: 220px; overflow: hidden; }
.product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-img img { transform: scale(1.05); }
.product-tag { position: absolute; top: 12px; left: 12px; padding: 3px 10px; border-radius: 15px; font-size: 0.7rem; font-weight: 600; }
.tag-hot { background: var(--gold); color: var(--white); }
.tag-new { background: var(--dark); color: var(--gold-light); }
.tag-sale { background: var(--red); color: var(--white); }
.product-info { padding: 18px; }
.category { font-size: 0.75rem; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }
.product-info h4 { font-size: 1rem; color: var(--dark); margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.price { font-size: 1.15rem; font-weight: 700; color: var(--red); margin-bottom: 6px; }
.original { font-size: 0.85rem; color: #999; text-decoration: line-through; margin-left: 8px; }
.rating { color: var(--gold); font-size: 0.8rem; }
.rating span { color: var(--text-light); margin-left: 5px; }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state i { font-size: 3rem; color: #ddd; margin-bottom: 15px; }
.empty-state h3 { color: var(--dark); margin-bottom: 10px; }
.empty-state p { color: var(--text-light); }

.pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 40px; }
.pagination button { padding: 10px 25px; border: 1px solid #ddd; border-radius: 20px; background: var(--white); cursor: pointer; font-family: inherit; transition: var(--transition); }
.pagination button:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 0.9rem; color: var(--text-light); }

@media (max-width: 1024px) { .results-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .results-grid { grid-template-columns: 1fr; } }
</style>
