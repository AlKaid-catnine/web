<template>
  <div class="product-detail" v-if="product.id">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <i class="fas fa-chevron-right"></i>
        <router-link :to="'/category/' + product.category">{{ product.category }}</router-link>
        <i class="fas fa-chevron-right"></i>
        <span>{{ product.name }}</span>
      </div>

      <div class="detail-top">
        <!-- Image Gallery -->
        <div class="gallery">
          <div class="main-img" @click="showLightbox = true">
            <img :src="currentImage" :alt="product.name">
          </div>
          <div class="thumbs">
            <img v-for="(img, i) in product.images" :key="i" :src="img"
                 :class="{ active: currentImage === img }" @click="currentImage = img">
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-info">
          <h1>{{ product.name }}</h1>
          <div class="p-rating">
            <span class="stars">
              <i v-for="n in 5" :key="n" :class="n <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
            <span>{{ product.rating }} 分</span>
            <span class="review-count">{{ product.reviewCount || 0 }} 条评价</span>
          </div>
          <div class="p-price">
            <span class="current-price">&yen;{{ product.price.toFixed(2) }}</span>
            <span class="original-price" v-if="product.originalPrice">&yen;{{ product.originalPrice.toFixed(2) }}</span>
            <span class="discount-badge" v-if="product.discount">-{{ product.discount }}%</span>
          </div>
          <p class="p-desc">{{ product.description }}</p>

          <!-- Options -->
          <div class="option-group" v-for="opt in product.options" :key="opt.name">
            <label>{{ opt.name }}</label>
            <div class="option-list">
              <button v-for="v in opt.values" :key="v"
                      :class="{ active: selectedOptions[opt.name] === v }"
                      @click="selectedOptions[opt.name] = v">{{ v }}</button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="option-group">
            <label>数量</label>
            <div class="qty-selector">
              <button @click="qty > 1 && qty--"><i class="fas fa-minus"></i></button>
              <input type="number" v-model.number="qty" min="1" max="99">
              <button @click="qty < 99 && qty++"><i class="fas fa-plus"></i></button>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-actions">
            <button class="btn-primary" @click="handleAddCart">
              <i class="fas fa-shopping-bag"></i> 加入购物车
            </button>
            <button class="btn-outline" @click="handleBuy">立即购买</button>
            <button class="icon-fav" :class="{ active: isFav(product.id) }" @click="toggleFav(product.id)">
              <i :class="isFav(product.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="detail-tabs">
        <div class="tab-headers">
          <button v-for="tab in tabs" :key="tab.key"
                  :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
        </div>
        <div class="tab-content">
          <!-- Specs -->
          <div v-if="activeTab === 'specs'" class="specs-table">
            <div class="spec-row" v-for="(val, key) in product.specs" :key="key">
              <span class="spec-key">{{ key }}</span>
              <span class="spec-val">{{ val }}</span>
            </div>
          </div>
          <!-- Reviews -->
          <div v-if="activeTab === 'reviews'" class="reviews-section">
            <div class="review-item" v-for="r in reviews" :key="r.id">
              <div class="review-header">
                <div class="avatar">{{ r.user[0] }}</div>
                <div>
                  <strong>{{ r.user }}</strong>
                  <span class="stars">
                    <i v-for="n in 5" :key="n" :class="n <= r.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </span>
                </div>
                <span class="review-date">{{ r.date }}</span>
              </div>
              <p>{{ r.content }}</p>
            </div>
            <div class="no-reviews" v-if="!reviews.length">暂无评价，来做第一个评价者吧！</div>
          </div>
          <!-- Recommendations -->
          <div v-if="activeTab === 'recommend'" class="recommend-grid">
            <div class="product-card" v-for="p in recommendations" :key="p.id" @click="$router.push('/product/' + p.id)">
              <div class="product-img"><img :src="p.image" :alt="p.name"></div>
              <div class="product-info">
                <h4>{{ p.name }}</h4>
                <span class="price">&yen;{{ p.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div class="lightbox" v-if="showLightbox" @click.self="showLightbox = false">
      <img :src="currentImage" :alt="product.name">
      <button class="lightbox-close" @click="showLightbox = false"><i class="fas fa-times"></i></button>
    </div>
  </div>
  <div class="container loading-page" v-else>
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '../api'
import { useFavStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const favStore = useFavStore()
const cartStore = useCartStore()

const isFav = (id) => favStore.isFav(id)
const toggleFav = (id) => favStore.toggle(id)

const product = ref({})
const currentImage = ref('')
const qty = ref(1)
const selectedOptions = reactive({})
const activeTab = ref('specs')
const reviews = ref([])
const recommendations = ref([])
const showLightbox = ref(false)

const tabs = [
  { key: 'specs', label: '商品参数' },
  { key: 'reviews', label: '用户评价' },
  { key: 'recommend', label: '相关推荐' }
]

async function loadProduct() {
  const id = route.params.id
  if (!id) return
  try {
    const res = await productAPI.detail(id)
    product.value = res.data || res
    currentImage.value = product.value.images?.[0] || product.value.image || ''
    // Init options
    if (product.value.options) {
      product.value.options.forEach(o => {
        if (!selectedOptions[o.name]) selectedOptions[o.name] = o.values[0]
      })
    }
  } catch (e) { product.value = {} }
}

async function loadReviews() {
  try {
    const res = await productAPI.reviews(route.params.id)
    reviews.value = res.data || []
  } catch (e) { reviews.value = [] }
}

async function loadRecommend() {
  try {
    const res = await productAPI.recommend(route.params.id)
    recommendations.value = res.data || []
  } catch (e) { recommendations.value = [] }
}

function handleAddCart() {
  cartStore.add(product.value.id, qty.value, selectedOptions)
  alert('已加入购物车')
}

function handleBuy() {
  cartStore.add(product.value.id, qty.value, selectedOptions).then(() => {
    router.push('/cart')
  })
}

watch(() => route.params.id, () => { loadProduct(); loadReviews(); loadRecommend() })
onMounted(() => { loadProduct(); loadReviews(); loadRecommend() })
</script>

<style scoped>
.product-detail { padding: 30px 0 60px; }
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 25px; font-size: 0.9rem; color: var(--text-light); }
.breadcrumb a { color: var(--text-light); }
.breadcrumb a:hover { color: var(--gold); }
.breadcrumb i { font-size: 0.7rem; }

.detail-top { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-bottom: 50px; }

.gallery .main-img { border-radius: var(--radius); overflow: hidden; cursor: zoom-in; margin-bottom: 15px; }
.main-img img { width: 100%; aspect-ratio: 1; object-fit: cover; }
.thumbs { display: flex; gap: 10px; }
.thumbs img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: var(--transition); }
.thumbs img.active, .thumbs img:hover { border-color: var(--gold); }

.p-info h1 { font-family: var(--font-display); font-size: 1.8rem; color: var(--dark); margin-bottom: 10px; }
.p-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.stars { color: var(--gold); font-size: 0.9rem; }
.review-count { color: var(--text-light); font-size: 0.85rem; }
.p-price { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
.current-price { font-size: 2rem; font-weight: 700; color: var(--red); }
.original-price { text-decoration: line-through; color: var(--text-light); }
.discount-badge { background: var(--red); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
.p-desc { color: var(--text-light); line-height: 1.8; margin-bottom: 25px; }

.option-group { margin-bottom: 20px; }
.option-group label { display: block; font-weight: 600; margin-bottom: 10px; font-size: 0.95rem; }
.option-list { display: flex; flex-wrap: wrap; gap: 10px; }
.option-list button { padding: 8px 20px; border: 1px solid #ddd; background: #fff; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: var(--transition); }
.option-list button:hover, .option-list button.active { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.05); }

.qty-selector { display: flex; align-items: center; gap: 0; }
.qty-selector button { width: 40px; height: 40px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 0.9rem; transition: var(--transition); }
.qty-selector button:first-child { border-radius: 8px 0 0 8px; }
.qty-selector button:last-child { border-radius: 0 8px 8px 0; }
.qty-selector button:hover { background: var(--gold); color: #fff; border-color: var(--gold); }
.qty-selector input { width: 60px; height: 40px; border: 1px solid #ddd; border-left: none; border-right: none; text-align: center; font-size: 1rem; outline: none; }

.p-actions { display: flex; gap: 15px; margin-top: 30px; align-items: center; }
.icon-fav { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #ddd; background: #fff; cursor: pointer; font-size: 1.2rem; color: var(--text-light); transition: var(--transition); }
.icon-fav:hover, .icon-fav.active { border-color: var(--red); color: var(--red); }

.detail-tabs { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
.tab-headers { display: flex; border-bottom: 1px solid #eee; }
.tab-headers button { padding: 18px 30px; border: none; background: none; font-size: 1rem; font-weight: 500; color: var(--text-light); cursor: pointer; position: relative; transition: var(--transition); }
.tab-headers button.active { color: var(--gold); }
.tab-headers button.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--gold); }
.tab-content { padding: 30px; }

.specs-table .spec-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.spec-key { width: 150px; color: var(--text-light); flex-shrink: 0; }
.spec-val { color: var(--text); }

.review-item { padding: 20px 0; border-bottom: 1px solid #f0f0f0; }
.review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.review-header .stars { font-size: 0.8rem; }
.review-date { margin-left: auto; color: var(--text-light); font-size: 0.85rem; }
.review-item p { color: var(--text); line-height: 1.7; }
.no-reviews { text-align: center; padding: 40px; color: var(--text-light); }

.recommend-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.recommend-grid .product-card { cursor: pointer; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); }
.recommend-grid .product-card:hover { transform: translateY(-3px); }
.recommend-grid .product-img { aspect-ratio: 1; }
.recommend-grid .product-img img { width: 100%; height: 100%; object-fit: cover; }
.recommend-grid .product-info { padding: 12px; }
.recommend-grid .product-info h4 { font-size: 0.9rem; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recommend-grid .price { font-weight: 700; color: var(--dark); }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.lightbox img { max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; }
.lightbox-close { position: absolute; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: #fff; font-size: 1.2rem; cursor: pointer; }

.loading-page { text-align: center; padding: 100px 0; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(201,168,76,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 15px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .detail-top { grid-template-columns: 1fr; }
  .recommend-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
