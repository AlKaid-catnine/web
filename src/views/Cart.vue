<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-shopping-bag"></i> 购物车</h1>
        <span class="cart-count" v-if="cart.items.length">{{ cart.items.length }} 件商品</span>
      </div>

      <!-- 空购物车 -->
      <div class="empty-state" v-if="!cart.items.length">
        <i class="fas fa-shopping-basket"></i>
        <h3>购物车是空的</h3>
        <p>快去挑选心仪好物吧~</p>
        <router-link to="/" class="btn-primary">去逛逛</router-link>
      </div>

      <!-- 购物车内容 -->
      <div class="cart-content" v-else>
        <div class="cart-items">
          <div class="cart-item" v-for="item in cart.items" :key="item.id">
            <img :src="item.image" :alt="item.name">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-option">{{ item.option }}</p>
              <p class="item-price">¥{{ item.price }}</p>
            </div>
            <div class="item-qty">
              <button @click="decrease(item.id)">−</button>
              <span>{{ item.qty }}</span>
              <button @click="increase(item.id)">+</button>
            </div>
            <button class="remove-btn" @click="remove(item.id)"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>

        <div class="cart-sidebar">
          <div class="coupon-section">
            <h4>优惠券</h4>
            <div class="coupon-input">
              <input type="text" v-model="couponCode" placeholder="输入优惠码">
              <button @click="verifyCoupon">使用</button>
            </div>
            <p class="coupon-msg" v-if="couponMsg" :class="{ success: couponValid }">{{ couponMsg }}</p>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>商品合计</span>
              <span>¥{{ cart.totalPrice }}</span>
            </div>
            <div class="summary-row" v-if="discount > 0">
              <span>优惠减免</span>
              <span class="discount">-¥{{ discount }}</span>
            </div>
            <div class="summary-row total">
              <span>应付总额</span>
              <span>¥{{ finalAmount }}</span>
            </div>
            <button class="btn-primary checkout-btn" @click="checkout">去结算</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { couponAPI } from '../api'

const cart = useCartStore()
const user = useUserStore()
const router = useRouter()

const couponCode = ref('')
const discount = ref(0)
const couponMsg = ref('')
const couponValid = ref(false)

const finalAmount = computed(() => Math.max(0, cart.totalPrice - discount.value))

onMounted(() => { cart.init() })

function increase(id) {
  const item = cart.items.find(i => i.id === id)
  if (item) cart.update(id, item.qty + 1)
}

function decrease(id) {
  const item = cart.items.find(i => i.id === id)
  if (item && item.qty > 1) cart.update(id, item.qty - 1)
}

function remove(id) {
  cart.remove(id)
}

function verifyCoupon() {
  if (!couponCode.value.trim()) return
  couponAPI.verify({ code: couponCode.value.trim(), amount: cart.totalPrice })
    .then(res => {
      discount.value = res.data.discount
      couponMsg.value = res.data.desc
      couponValid.value = true
    })
    .catch(err => {
      discount.value = 0
      couponMsg.value = err.message || '优惠券无效'
      couponValid.value = false
    })
}

function checkout() {
  if (!user.isLoggedIn) {
    router.push('/user')
    return
  }
  if (!cart.items.length) return
  router.push('/orders')
}
</script>

<style scoped>
.cart-page { padding: 40px 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
.page-header h1 { font-family: var(--font-display); font-size: 1.8rem; color: var(--dark); }
.page-header h1 i { color: var(--gold); margin-right: 10px; }
.cart-count { color: var(--text-light); }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state i { font-size: 4rem; color: #ddd; margin-bottom: 20px; }
.empty-state h3 { color: var(--dark); margin-bottom: 10px; }
.empty-state p { color: var(--text-light); margin-bottom: 20px; }

.cart-content { display: grid; grid-template-columns: 1fr 350px; gap: 30px; }
.cart-item { display: flex; align-items: center; gap: 20px; padding: 20px; background: var(--white); border-radius: var(--radius); margin-bottom: 15px; box-shadow: var(--shadow); }
.cart-item img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
.item-info { flex: 1; }
.item-info h4 { font-size: 1rem; color: var(--dark); margin-bottom: 5px; }
.item-option { font-size: 0.85rem; color: var(--text-light); margin-bottom: 5px; }
.item-price { font-size: 1.1rem; font-weight: 700; color: var(--red); }
.item-qty { display: flex; align-items: center; gap: 10px; }
.item-qty button { width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 6px; background: var(--white); cursor: pointer; font-size: 1rem; transition: var(--transition); }
.item-qty button:hover { border-color: var(--gold); color: var(--gold); }
.item-qty span { font-weight: 600; min-width: 24px; text-align: center; }
.remove-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 1.1rem; transition: var(--transition); }
.remove-btn:hover { color: var(--red); }

.cart-sidebar { position: sticky; top: 90px; }
.coupon-section { background: var(--white); border-radius: var(--radius); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow); }
.coupon-section h4 { margin-bottom: 12px; color: var(--dark); }
.coupon-input { display: flex; gap: 10px; }
.coupon-input input { flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-size: 0.9rem; font-family: inherit; }
.coupon-input input:focus { border-color: var(--gold); }
.coupon-input button { padding: 10px 20px; border: 1px solid var(--gold); border-radius: 8px; background: var(--white); color: var(--gold); cursor: pointer; font-weight: 600; font-family: inherit; transition: var(--transition); }
.coupon-input button:hover { background: var(--gold); color: var(--white); }
.coupon-msg { font-size: 0.85rem; margin-top: 8px; color: var(--text-light); }
.coupon-msg.success { color: #27ae60; }

.cart-summary { background: var(--white); border-radius: var(--radius); padding: 25px; box-shadow: var(--shadow); }
.summary-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 0.95rem; }
.summary-row.total { border-top: 2px solid #eee; margin-top: 10px; padding-top: 15px; font-size: 1.2rem; font-weight: 700; color: var(--dark); }
.discount { color: var(--red); }
.checkout-btn { width: 100%; margin-top: 20px; padding: 16px; font-size: 1.1rem; }

@media (max-width: 768px) {
  .cart-content { grid-template-columns: 1fr; }
  .cart-item { flex-wrap: wrap; }
}
</style>
