<template>
  <div id="lumiere-app">
    <!-- 页面加载动画 -->
    <div class="page-loader" v-if="loading">
      <div class="loader-spinner"></div>
      <div class="loader-text">LUMIÈRE</div>
    </div>

    <template v-else>
      <!-- 顶部通知栏 -->
      <div class="top-bar">
        <span>✦ 新用户首单享9折优惠 | 全场满 ¥299 免运费 ✦</span>
      </div>

      <!-- 导航栏 -->
      <nav class="navbar" :class="{ scrolled: isScrolled }">
        <div class="container nav-inner">
          <router-link to="/" class="logo">LUMI<em>È</em>RE</router-link>

          <ul class="nav-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/category/家具">家具</router-link></li>
            <li><router-link to="/category/饰品">饰品</router-link></li>
            <li><router-link to="/category/香氛">香氛</router-link></li>
            <li><router-link to="/category/餐厨">餐厨</router-link></li>
          </ul>

          <div class="nav-actions">
            <div class="search-box" @click="$router.push('/search')">
              <input type="text" placeholder="搜索商品..." v-model="searchQuery" @keyup.enter="goSearch" readonly>
              <button @click="goSearch"><i class="fas fa-search"></i></button>
            </div>
            <router-link to="/favorites" class="icon-btn" title="收藏">
              <i class="far fa-heart"></i>
              <span class="badge" v-if="favCount">{{ favCount }}</span>
            </router-link>
            <router-link to="/cart" class="icon-btn" title="购物车">
              <i class="fas fa-shopping-bag"></i>
              <span class="badge" v-if="cartCount">{{ cartCount }}</span>
            </router-link>
            <router-link to="/user" class="icon-btn" title="我的">
              <i :class="isLoggedIn ? 'fas fa-user' : 'far fa-user'"></i>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- 路由内容 -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- 页脚 -->
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <h4>LUMIÈRE</h4>
              <p>致力于为现代家庭带来全球精选的设计好物。我们相信，美好生活源于对细节的用心。</p>
              <div class="social-links">
                <a href="https://weibo.com" target="_blank" title="微博"><i class="fab fa-weibo"></i></a>
                <a href="https://www.xiaohongshu.com" target="_blank" title="小红书"><i class="fas fa-book-open"></i></a>
                <a href="https://www.instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="footer-col">
              <h4>快速链接</h4>
              <ul>
                <li><router-link to="/">首页</router-link></li>
                <li><router-link to="/category/家具">新品上市</router-link></li>
                <li><router-link to="/orders">订单查询</router-link></li>
                <li><router-link to="/user">个人中心</router-link></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>客户服务</h4>
              <ul>
                <li><a href="javascript:void(0)" @click="showService('配送说明')">配送说明</a></li>
                <li><a href="javascript:void(0)" @click="showService('退换政策')">退换政策</a></li>
                <li><a href="javascript:void(0)" @click="showService('常见问题')">常见问题</a></li>
                <li><a href="javascript:void(0)" @click="showService('联系客服')">联系客服</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>联系方式</h4>
              <ul>
                <li><i class="fas fa-phone"></i> 400-888-6666</li>
                <li><i class="fas fa-envelope"></i> hello@lumiere.com</li>
                <li><a href="https://map.baidu.com/search/%E4%B8%8A%E6%B5%B7%E5%B8%82%E9%9D%99%E5%AE%81%E5%8C%BA%E5%8D%97%E4%BA%AC%E8%A5%BF%E8%B7%AF1788%E5%8F%B7/@12955000,4838000,13z" target="_blank"><i class="fas fa-map-marker-alt"></i> 上海市静安区南京西路1788号</a></li>
                <li><i class="fas fa-clock"></i> 周一至周日 9:00-21:00</li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2024 LUMIÈRE. All rights reserved. | 沪ICP备12345678号</span>
            <div class="payment-methods">
              <i class="fab fa-cc-visa" title="Visa"></i>
              <i class="fab fa-cc-mastercard" title="Mastercard"></i>
              <i class="fab fa-alipay" title="支付宝"></i>
              <i class="fab fa-weixin" title="微信支付"></i>
            </div>
          </div>
        </div>
      </footer>

      <!-- 回到顶部 -->
      <button class="back-to-top" :class="{ visible: showBackTop }" @click="scrollToTop">
        <i class="fas fa-chevron-up"></i>
      </button>

      <!-- 服务信息弹窗 -->
      <div class="modal-overlay" v-if="serviceModal" @click.self="serviceModal = false">
        <div class="modal-container service-modal">
          <button class="modal-close" @click="serviceModal = false"><i class="fas fa-times"></i></button>
          <h3>{{ serviceTitle }}</h3>
          <div class="service-content" v-html="serviceContent"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import { useFavStore } from './stores/favorites'

const userStore = useUserStore()
const cartStore = useCartStore()
const favStore = useFavStore()

const loading = ref(true)
const isScrolled = ref(false)
const showBackTop = ref(false)
const searchQuery = ref('')
const serviceModal = ref(false)
const serviceTitle = ref('')
const serviceContent = ref('')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const cartCount = computed(() => cartStore.totalQty)
const favCount = computed(() => favStore.count)

const services = {
  '配送说明': 'LUMIÈRE 与顺丰速运、京东物流合作，全国大部分地区48小时内送达。订单满¥299免运费，未满收取¥15运费。偏远地区（新疆、西藏等）需额外3-5个工作日。',
  '退换政策': '自签收之日起30天内，商品未使用、未拆封、配件齐全的情况下可申请退换。退换运费由LUMIÈRE承担。定制商品、食品类商品不支持退换。',
  '常见问题': 'Q: 商品质量有问题怎么办？<br>A: 请在签收后48小时内联系客服，我们将为您免费退换。<br><br>Q: 可以开发票吗？<br>A: 可以，下单时选择"需要发票"即可。<br><br>Q: 支持货到付款吗？<br>A: 暂不支持，支持支付宝、微信、银行卡支付。',
  '联系客服': '客服热线：400-888-6666<br>客服邮箱：hello@lumiere.com<br>在线客服：周一至周日 9:00-21:00<br>微信客服：LUMIERE_Official'
}

function showService(title) {
  serviceTitle.value = title
  serviceContent.value = services[title] || '暂无相关信息'
  serviceModal.value = true
}

function goSearch() {
  if (searchQuery.value.trim()) {
    localStorage.setItem('lastSearch', searchQuery.value.trim())
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 50
  showBackTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  // 初始化
  userStore.init()
  cartStore.init()
  favStore.init()
  setTimeout(() => { loading.value = false }, 800)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.page-loader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--dark); z-index: 9999; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; }
.loader-spinner { width: 50px; height: 50px; border: 3px solid rgba(201,168,76,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
.loader-text { color: var(--gold); font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 5px; }
@keyframes spin { to { transform: rotate(360deg); } }

.top-bar { background: var(--dark); color: var(--gold-light); text-align: center; padding: 8px 20px; font-size: 0.85rem; letter-spacing: 1px; z-index: 1001; }

.navbar { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: 0 1px 0 rgba(0,0,0,0.05); transition: var(--transition); }
.navbar.scrolled { box-shadow: 0 2px 30px rgba(0,0,0,0.1); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 70px; }
.logo { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--dark); letter-spacing: 3px; }
.logo em { color: var(--gold); font-style: normal; }
.nav-links { display: flex; gap: 35px; }
.nav-links a { font-size: 0.95rem; font-weight: 500; color: var(--text); position: relative; padding: 5px 0; transition: var(--transition); }
.nav-links a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--gold); transition: width 0.3s; }
.nav-links a:hover, .nav-links a.router-link-active { color: var(--gold); }
.nav-links a:hover::after, .nav-links a.router-link-active::after { width: 100%; }

.nav-actions { display: flex; align-items: center; gap: 20px; }
.search-box { display: flex; align-items: center; background: var(--off-white); border: 1px solid #e0ddd8; border-radius: 25px; padding: 6px 15px; transition: var(--transition); cursor: pointer; }
.search-box:focus-within { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
.search-box input { border: none; background: none; outline: none; font-size: 0.85rem; width: 150px; color: var(--text); cursor: pointer; }
.search-box button { background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text); }

.icon-btn { position: relative; background: none; border: none; cursor: pointer; font-size: 1.15rem; color: var(--text); transition: var(--transition); }
.icon-btn:hover { color: var(--gold); }
.badge { position: absolute; top: -6px; right: -8px; background: var(--gold); color: var(--white); font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }

.main-content { min-height: 60vh; }

.footer { background: var(--dark); color: rgba(255,255,255,0.7); padding: 60px 0 0; margin-top: 80px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.footer-col h4 { color: var(--white); font-size: 1rem; margin-bottom: 20px; letter-spacing: 2px; text-transform: uppercase; }
.footer-col p { font-size: 0.9rem; line-height: 1.8; margin-bottom: 15px; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a { font-size: 0.9rem; color: rgba(255,255,255,0.6); transition: var(--transition); }
.footer-col ul li a:hover { color: var(--gold); padding-left: 5px; }
.social-links { display: flex; gap: 12px; margin-top: 15px; }
.social-links a { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.6); transition: var(--transition); }
.social-links a:hover { background: var(--gold); border-color: var(--gold); color: var(--white); transform: translateY(-3px); }
.footer-bottom { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
.payment-methods { display: flex; gap: 15px; font-size: 1.5rem; opacity: 0.6; }

.back-to-top { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--gold); color: var(--white); border: none; font-size: 1.2rem; cursor: pointer; opacity: 0; visibility: hidden; transition: var(--transition); box-shadow: 0 4px 15px rgba(201,168,76,0.4); z-index: 999; display: flex; align-items: center; justify-content: center; }
.back-to-top.visible { opacity: 1; visibility: visible; }
.back-to-top:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(201,168,76,0.5); }

/* 服务弹窗 */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 3000; display: flex; align-items: center; justify-content: center; }
.modal-container { background: var(--white); border-radius: var(--radius); max-width: 500px; width: 95%; max-height: 90vh; overflow-y: auto; position: relative; padding: 30px; box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
.modal-close { position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--off-white); color: var(--text); font-size: 1.1rem; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
.modal-close:hover { background: var(--gold); color: var(--white); }
.service-modal h3 { font-family: var(--font-display); font-size: 1.3rem; color: var(--dark); margin-bottom: 15px; }
.service-content { color: var(--text-light); line-height: 1.8; font-size: 0.95rem; }

/* 路由过渡动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
  .search-box input { width: 100px; }
}
</style>
