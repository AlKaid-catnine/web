<template>
  <div class="user-page">
    <div class="container">
      <!-- 未登录 -->
      <div class="auth-section" v-if="!user.isLoggedIn">
        <div class="auth-tabs">
          <button :class="{ active: authTab === 'login' }" @click="authTab = 'login'">登录</button>
          <button :class="{ active: authTab === 'register' }" @click="authTab = 'register'">注册</button>
        </div>

        <!-- 登录 -->
        <form class="auth-form" @submit.prevent="handleLogin" v-if="authTab === 'login'">
          <div class="form-group">
            <label><i class="fas fa-envelope"></i> 邮箱</label>
            <input type="email" v-model="loginForm.email" placeholder="请输入邮箱" required>
            <span class="form-error" v-if="loginErrors.email">{{ loginErrors.email }}</span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 密码</label>
            <input type="password" v-model="loginForm.password" placeholder="请输入密码" required>
            <span class="form-error" v-if="loginErrors.password">{{ loginErrors.password }}</span>
          </div>
          <button type="submit" class="btn-primary auth-submit">登 录</button>
          <p class="auth-tip">还没有账号？<a href="#" @click.prevent="authTab = 'register'">立即注册</a></p>
        </form>

        <!-- 注册 -->
        <form class="auth-form" @submit.prevent="handleRegister" v-else>
          <div class="form-group">
            <label><i class="fas fa-user"></i> 用户名</label>
            <input type="text" v-model="regForm.username" placeholder="请输入用户名" required>
            <span class="form-error" v-if="regErrors.username">{{ regErrors.username }}</span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-envelope"></i> 邮箱</label>
            <input type="email" v-model="regForm.email" placeholder="请输入邮箱" required>
            <span class="form-error" v-if="regErrors.email">{{ regErrors.email }}</span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 密码</label>
            <input type="password" v-model="regForm.password" placeholder="至少6位密码" required>
            <span class="form-error" v-if="regErrors.password">{{ regErrors.password }}</span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 确认密码</label>
            <input type="password" v-model="regForm.password2" placeholder="再次输入密码" required>
            <span class="form-error" v-if="regErrors.password2">{{ regErrors.password2 }}</span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-phone"></i> 手机号</label>
            <input type="tel" v-model="regForm.phone" placeholder="请输入手机号" required>
            <span class="form-error" v-if="regErrors.phone">{{ regErrors.phone }}</span>
          </div>
          <button type="submit" class="btn-primary auth-submit">注 册</button>
          <p class="auth-tip">已有账号？<a href="#" @click.prevent="authTab = 'login'">立即登录</a></p>
        </form>
      </div>

      <!-- 已登录 -->
      <div class="user-dashboard" v-else>
        <div class="user-sidebar">
          <div class="user-avatar">{{ user.user?.avatar || 'U' }}</div>
          <h3>{{ user.user?.username }}</h3>
          <p class="member-level">{{ user.user?.memberLevel }}</p>
          <nav class="user-nav">
            <router-link to="/orders"><i class="fas fa-box"></i> 我的订单</router-link>
            <router-link to="/favorites"><i class="fas fa-heart"></i> 我的收藏</router-link>
            <a href="#" @click.prevent="handleLogout"><i class="fas fa-sign-out-alt"></i> 退出登录</a>
          </nav>
        </div>
        <div class="user-main">
          <h2>欢迎回来，{{ user.user?.username }}</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-box"></i>
              <span class="stat-num">{{ orderCount }}</span>
              <span class="stat-label">订单</span>
            </div>
            <div class="stat-card">
              <i class="fas fa-heart"></i>
              <span class="stat-num">{{ favCount }}</span>
              <span class="stat-label">收藏</span>
            </div>
            <div class="stat-card">
              <i class="fas fa-shopping-bag"></i>
              <span class="stat-num">{{ cartCount }}</span>
              <span class="stat-label">购物车</span>
            </div>
          </div>
          <div class="quick-links">
            <router-link to="/orders" class="btn-outline">查看订单</router-link>
            <router-link to="/favorites" class="btn-outline">我的收藏</router-link>
            <router-link to="/" class="btn-primary">去购物</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useFavStore } from '../stores/favorites'
import { useRouter } from 'vue-router'

const user = useUserStore()
const cart = useCartStore()
const fav = useFavStore()
const router = useRouter()

const authTab = ref('login')
const loginForm = reactive({ email: '', password: '' })
const regForm = reactive({ username: '', email: '', password: '', password2: '', phone: '' })
const loginErrors = reactive({})
const regErrors = reactive({})

const orderCount = ref(0)
const favCount = ref(0)
const cartCount = ref(0)

onMounted(() => {
  user.init()
  cart.init()
  fav.init()
  favCount.value = fav.count
  cartCount.value = cart.totalQty
})

function handleLogin() {
  Object.keys(loginErrors).forEach(k => loginErrors[k] = '')
  let valid = true
  if (!loginForm.email?.includes('@')) { loginErrors.email = '请输入有效邮箱'; valid = false }
  if (!loginForm.password || loginForm.password.length < 6) { loginErrors.password = '密码至少6位'; valid = false }
  if (!valid) return

  user.login({ email: loginForm.email, password: loginForm.password })
    .then(() => { router.push('/') })
    .catch(err => { loginErrors.email = err.message || '登录失败' })
}

function handleRegister() {
  Object.keys(regErrors).forEach(k => regErrors[k] = '')
  let valid = true
  if (!regForm.username || regForm.username.length < 2) { regErrors.username = '用户名至少2字符'; valid = false }
  if (!regForm.email?.includes('@')) { regErrors.email = '请输入有效邮箱'; valid = false }
  if (!regForm.password || regForm.password.length < 6) { regErrors.password = '密码至少6位'; valid = false }
  if (regForm.password !== regForm.password2) { regErrors.password2 = '两次密码不一致'; valid = false }
  if (!/^1[3-9]\d{9}$/.test(regForm.phone)) { regErrors.phone = '请输入有效手机号'; valid = false }
  if (!valid) return

  user.register({ username: regForm.username, email: regForm.email, password: regForm.password, phone: regForm.phone })
    .then(() => { router.push('/') })
    .catch(err => { regErrors.email = err.message || '注册失败' })
}

function handleLogout() {
  user.logout()
}
</script>

<style scoped>
.user-page { padding: 40px 0; }
.auth-section { max-width: 420px; margin: 0 auto; }
.auth-tabs { display: flex; gap: 0; margin-bottom: 25px; border-bottom: 2px solid #eee; }
.auth-tab { flex: 1; padding: 12px; border: none; background: none; font-size: 1rem; font-weight: 600; color: var(--text-light); cursor: pointer; transition: var(--transition); position: relative; font-family: inherit; }
.auth-tab.active { color: var(--gold); }
.auth-tab.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: var(--gold); }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: var(--dark); display: flex; align-items: center; gap: 6px; }
.form-group label i { color: var(--gold); width: 16px; }
.form-group input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem; outline: none; transition: var(--transition); font-family: inherit; }
.form-group input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
.form-error { font-size: 0.75rem; color: var(--red); min-height: 14px; }
.auth-submit { width: 100%; padding: 14px; font-size: 1rem; margin-top: 5px; }
.auth-tip { text-align: center; font-size: 0.9rem; color: var(--text-light); }
.auth-tip a { color: var(--gold); }

.user-dashboard { display: grid; grid-template-columns: 250px 1fr; gap: 30px; }
.user-sidebar { background: var(--white); border-radius: var(--radius); padding: 30px; box-shadow: var(--shadow); text-align: center; height: fit-content; }
.user-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: var(--white); font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
.user-sidebar h3 { color: var(--dark); margin-bottom: 5px; }
.member-level { font-size: 0.85rem; color: var(--gold); margin-bottom: 20px; }
.user-nav { display: flex; flex-direction: column; gap: 5px; text-align: left; }
.user-nav a { padding: 10px 15px; border-radius: 8px; color: var(--text); transition: var(--transition); display: flex; align-items: center; gap: 10px; }
.user-nav a:hover, .user-nav a.router-link-active { background: var(--off-white); color: var(--gold); }
.user-nav a i { width: 20px; text-align: center; }

.user-main h2 { font-family: var(--font-display); color: var(--dark); margin-bottom: 25px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.stat-card { background: var(--white); border-radius: var(--radius); padding: 25px; text-align: center; box-shadow: var(--shadow); }
.stat-card i { font-size: 1.5rem; color: var(--gold); margin-bottom: 10px; }
.stat-num { display: block; font-size: 1.8rem; font-weight: 700; color: var(--dark); }
.stat-label { font-size: 0.85rem; color: var(--text-light); }
.quick-links { display: flex; gap: 15px; }

@media (max-width: 768px) {
  .user-dashboard { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
  .quick-links { flex-direction: column; }
}
</style>
