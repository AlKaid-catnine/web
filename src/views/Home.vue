<template>
  <div class="home">
    <!-- Hero Carousel -->
    <section class="hero">
      <div class="hero-slides">
        <div class="hero-slide" v-for="(slide, i) in heroSlides" :key="i"
             :class="{ active: currentSlide === i }"
             :style="{ backgroundImage: 'url(' + slide.image + ')' }">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.subtitle }}</p>
            <router-link :to="slide.link" class="btn-primary">探索更多</router-link>
          </div>
        </div>
      </div>
      <div class="hero-dots">
        <span v-for="(_, i) in heroSlides" :key="i"
              :class="{ active: currentSlide === i }" @click="currentSlide = i"></span>
      </div>
      <button class="hero-prev" @click="prevSlide"><i class="fas fa-chevron-left"></i></button>
      <button class="hero-next" @click="nextSlide"><i class="fas fa-chevron-right"></i></button>
    </section>

    <!-- Category Grid -->
    <section class="section container">
      <div class="section-title">
        <h2>精选分类</h2>
        <p>发现属于你的生活美学</p>
      </div>
      <div class="category-grid">
        <router-link v-for="cat in categories" :key="cat.name"
                     :to="'/category/' + cat.name" class="category-card">
          <div class="cat-icon"><i :class="cat.icon"></i></div>
          <span>{{ cat.name }}</span>
          <small>{{ cat.count }} 件商品</small>
        </router-link>
      </div>
    </section>

    <!-- Flash Sale -->
    <section class="section flash-sale">
      <div class="container">
        <div class="flash-header">
          <div class="section-title" style="margin-bottom:0;text-align:left">
            <h2><i class="fas fa-bolt"></i> 限时闪购</h2>
          </div>
          <div class="countdown">
            <span class="cd-block">{{ countdown.h }}</span>:
            <span class="cd-block">{{ countdown.m }}</span>:
            <span class="cd-block">{{ countdown.s }}</span>
          </div>
        </div>
        <div class="product-grid">
          <div class="product-card" v-for="p in flashProducts" :key="p.id">
            <div class="product-img" @click="$router.push('/product/' + p.id)">
              <img :src="p.image" :alt="p.name">
              <span class="discount-tag">-{{ p.discount }}%</span>
            </div>
            <div class="product-info">
              <h4 @click="$router.push('/product/' + p.id)">{{ p.name }}</h4>
              <div class="price-row">
                <span class="price flash-price">{{ (p.price * (1 - p.discount / 100)).toFixed(2) }}</span>
                <span class="price original">{{ p.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section container">
      <div class="section-title">
        <h2>人气推荐</h2>
        <p>为你精心挑选的热门好物</p>
      </div>
      <div class="product-grid">
        <div class="product-card" v-for="p in featuredProducts" :key="p.id">
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
    </section>

    <!-- Brand Story -->
    <section class="section brand-story">
      <div class="container">
        <div class="brand-inner">
          <div class="brand-text">
            <h2>关于 LUMIERE</h2>
            <p>我们相信，每一件家居好物都承载着对美好生活的向往。LUMIERE 甄选全球优质设计品牌，将艺术融入日常，让家成为灵感的归宿。</p>
            <p>从北欧极简到东方禅意，从现代工业到复古浪漫，我们为你呈现多元而精致的生活选择。</p>
            <router-link to="/category/家具" class="btn-outline">了解更多</router-link>
          </div>
          <div class="brand-stats">
            <div class="stat-item" v-for="s in stats" :key="s.label">
              <span class="stat-num">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section container">
      <div class="section-title">
        <h2>用户评价</h2>
        <p>听听他们怎么说</p>
      </div>
      <div class="testimonial-grid">
        <div class="testimonial-card" v-for="t in testimonials" :key="t.name">
          <div class="stars">
            <i v-for="n in 5" :key="n" :class="n <= t.rating ? 'fas fa-star' : 'far fa-star'"></i>
          </div>
          <p>"{{ t.text }}"</p>
          <div class="reviewer">
            <div class="avatar">{{ t.name[0] }}</div>
            <div>
              <strong>{{ t.name }}</strong>
              <span>{{ t.product }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { productAPI } from '../api'
import { useFavStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'

const favStore = useFavStore()
const cartStore = useCartStore()

const isFav = (id) => favStore.isFav(id)
const toggleFav = (id) => favStore.toggle(id)
const addToCart = (id) => cartStore.add(id, 1)

// Hero carousel
const heroSlides = ref([
  { title: '轻奢生活，从此开始', subtitle: '探索全球精选设计好物', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400', link: '/category/家具' },
  { title: '北欧极简系列', subtitle: '简约而不简单的生活美学', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400', link: '/category/饰品' },
  { title: '香氛艺术', subtitle: '用气味定义你的空间', image: 'https://images.unsplash.com/photo-1602607616907-faf0e4e0e5e5?w=1400', link: '/category/香氛' }
])
const currentSlide = ref(0)
let slideTimer = null
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length }
function prevSlide() { currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length }

// Categories
const categories = ref([
  { name: '家具', icon: 'fas fa-couch', count: 128 },
  { name: '饰品', icon: 'fas fa-gem', count: 256 },
  { name: '香氛', icon: 'fas fa-wind', count: 89 },
  { name: '餐厨', icon: 'fas fa-utensils', count: 167 },
  { name: '灯具', icon: 'fas fa-lightbulb', count: 94 },
  { name: '收纳', icon: 'fas fa-box', count: 73 }
])

// Flash sale countdown
const countdown = ref({ h: '02', m: '30', s: '45' })
let cdTimer = null
function tickCountdown() {
  let [h, m, s] = countdown.value.h.split(':').map(Number)
  let total = parseInt(countdown.value.h) * 3600 + parseInt(countdown.value.m) * 60 + parseInt(countdown.value.s)
  if (total <= 0) return
  total--
  countdown.value = {
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0')
  }
}

// Products
const flashProducts = ref([])
const featuredProducts = ref([])

// Brand stats
const stats = ref([
  { value: '500+', label: '精选商品' },
  { value: '50K+', label: '满意客户' },
  { value: '99%', label: '好评率' },
  { value: '30天', label: '无忧退换' }
])

// Testimonials
const testimonials = ref([
  { name: '林小雅', rating: 5, text: '质感非常好，和图片一致，物流也很快。已经回购好几次了！', product: '北欧极简床头柜' },
  { name: '张明轩', rating: 5, text: '包装精美，送朋友特别有面子。LUMIERE的选品真的很有品味。', product: '手工陶瓷花瓶' },
  { name: '王思琪', rating: 4, text: '香氛味道很高级，持久度也不错。客服态度也很好，会再来。', product: '白茶香氛蜡烛' }
])

onMounted(async () => {
  slideTimer = setInterval(nextSlide, 5000)
  cdTimer = setInterval(tickCountdown, 1000)
  try {
    const res = await productAPI.list({ flash: true, limit: 4 })
    flashProducts.value = res.data?.list || []
  } catch (e) { flashProducts.value = [] }
  try {
    const res = await productAPI.list({ featured: true, limit: 8 })
    featuredProducts.value = res.data?.list || []
  } catch (e) { featuredProducts.value = [] }
})

onUnmounted(() => {
  clearInterval(slideTimer)
  clearInterval(cdTimer)
})
</script>

<style scoped>
.hero { position: relative; height: 80vh; min-height: 500px; overflow: hidden; }
.hero-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease; display: flex; align-items: center; }
.hero-slide.active { opacity: 1; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(26,26,46,0.7), rgba(26,26,46,0.3)); }
.hero-content { position: relative; z-index: 2; padding-left: 10%; color: #fff; max-width: 500px; }
.hero-content h1 { font-family: var(--font-display); font-size: 3rem; margin-bottom: 15px; line-height: 1.2; }
.hero-content p { font-size: 1.1rem; margin-bottom: 30px; opacity: 0.9; }
.hero-dots { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 3; }
.hero-dots span { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: var(--transition); }
.hero-dots span.active { background: var(--gold); transform: scale(1.2); }
.hero-prev, .hero-next { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: var(--transition); backdrop-filter: blur(4px); }
.hero-prev:hover, .hero-next:hover { background: var(--gold); }
.hero-prev { left: 30px; } .hero-next { right: 30px; }

.section { padding: 80px 0; }
.section-title { text-align: center; margin-bottom: 50px; }
.section-title h2 { font-family: var(--font-display); font-size: 2.2rem; color: var(--dark); position: relative; display: inline-block; padding-bottom: 15px; }
.section-title h2::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); border-radius: 2px; }
.section-title p { margin-top: 12px; color: var(--text-light); }

.category-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
.category-card { text-align: center; padding: 30px 15px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); transition: var(--transition); cursor: pointer; }
.category-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.cat-icon { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05)); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.4rem; color: var(--gold); }
.category-card span { display: block; font-weight: 600; color: var(--dark); margin-bottom: 4px; }
.category-card small { color: var(--text-light); font-size: 0.8rem; }

.flash-sale { background: var(--dark); }
.flash-sale .section-title h2 { color: #fff; }
.flash-sale .section-title h2::after { background: var(--gold); }
.flash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
.countdown { display: flex; align-items: center; gap: 8px; color: var(--gold); font-weight: 700; font-size: 1.4rem; }
.cd-block { background: rgba(201,168,76,0.15); padding: 8px 14px; border-radius: 8px; min-width: 50px; text-align: center; }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
.product-card { background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); }
.product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.product-img { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 1; }
.product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-img img { transform: scale(1.08); }
.product-actions { position: absolute; bottom: 15px; right: 15px; display: flex; flex-direction: column; gap: 8px; opacity: 0; transform: translateY(10px); transition: var(--transition); }
.product-card:hover .product-actions { opacity: 1; transform: translateY(0); }
.product-actions button { width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.9); color: var(--dark); cursor: pointer; transition: var(--transition); backdrop-filter: blur(4px); }
.product-actions button:hover, .product-actions button.active { background: var(--gold); color: #fff; }
.discount-tag { position: absolute; top: 12px; left: 12px; background: var(--red); color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.product-info { padding: 18px; }
.product-info h4 { font-size: 0.95rem; color: var(--dark); cursor: pointer; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s; }
.product-info h4:hover { color: var(--gold); }
.price-row { display: flex; align-items: center; justify-content: space-between; }
.price { font-weight: 700; color: var(--dark); }
.flash-price { color: var(--red); }
.price.original { text-decoration: line-through; color: var(--text-light); font-weight: 400; font-size: 0.85rem; }
.rating { font-size: 0.85rem; color: var(--gold); }

.brand-story { background: var(--dark); color: #fff; }
.brand-inner { display: grid; grid-template-columns: 1.5fr 1fr; gap: 60px; align-items: center; }
.brand-text h2 { font-family: var(--font-display); font-size: 2.2rem; margin-bottom: 20px; }
.brand-text p { line-height: 1.9; opacity: 0.8; margin-bottom: 15px; }
.brand-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.stat-item { text-align: center; padding: 25px; background: rgba(255,255,255,0.05); border-radius: var(--radius); }
.stat-num { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--gold); margin-bottom: 5px; }
.stat-label { font-size: 0.9rem; opacity: 0.7; }

.testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.testimonial-card { background: #fff; padding: 30px; border-radius: var(--radius); box-shadow: var(--shadow); }
.stars { color: var(--gold); margin-bottom: 15px; }
.testimonial-card p { color: var(--text-light); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.reviewer { display: flex; align-items: center; gap: 12px; }
.avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.reviewer strong { display: block; font-size: 0.95rem; }
.reviewer span { font-size: 0.8rem; color: var(--text-light); }

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2rem; }
  .category-grid { grid-template-columns: repeat(3, 1fr); }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .brand-inner { grid-template-columns: 1fr; }
  .testimonial-grid { grid-template-columns: 1fr; }
  .flash-header { flex-direction: column; gap: 15px; align-items: flex-start; }
}
</style>
