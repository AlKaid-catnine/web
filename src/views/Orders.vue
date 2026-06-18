<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title"><i class="fas fa-box"></i> 我的订单</h1>

      <!-- 空状态 -->
      <div class="empty-state" v-if="!orders.length">
        <i class="fas fa-box-open"></i>
        <h3>暂无订单</h3>
        <p>快去下单吧~</p>
        <router-link to="/" class="btn-primary">去购物</router-link>
      </div>

      <!-- 订单列表 -->
      <div class="orders-list" v-else>
        <div class="order-card" v-for="order in orders" :key="order.id">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">{{ order.id }}</span>
              <span class="order-date">{{ order.createdAt?.split('T')[0] }}</span>
            </div>
            <span class="order-status" :class="order.status">{{ order.statusText }}</span>
          </div>

          <div class="order-items">
            <div class="order-item" v-for="item in order.items" :key="item.id">
              <img :src="item.image" :alt="item.name">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.option }} × {{ item.qty }}</p>
              </div>
              <span class="item-price">¥{{ item.price }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-address"><i class="fas fa-map-marker-alt"></i> {{ order.address }}</div>
            <div class="order-total">
              <span v-if="order.discount > 0" class="discount">-¥{{ order.discount }}</span>
              <span class="total">合计：¥{{ order.finalAmount }}</span>
            </div>
          </div>

          <div class="order-actions">
            <button class="btn-outline btn-sm" v-if="order.status === 'pending'" @click="payOrder(order.id)">去支付</button>
            <button class="btn-outline btn-sm" v-if="order.status === 'shipped'" @click="confirmOrder(order.id)">确认收货</button>
            <button class="btn-primary btn-sm" v-if="order.status === 'delivered'" @click="reviewOrder(order.id)">去评价</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { orderAPI } from '../api'

const user = useUserStore()
const router = useRouter()
const orders = ref([])

onMounted(() => {
  if (user.isLoggedIn) {
    orderAPI.list().then(res => { orders.value = res.data }).catch(() => {})
  }
})

function payOrder(id) {
  orderAPI.updateStatus(id, 'paid').then(res => {
    const order = orders.value.find(o => o.id === id)
    if (order) { order.status = 'paid'; order.statusText = res.data.statusText }
  })
}

function confirmOrder(id) {
  orderAPI.updateStatus(id, 'delivered').then(res => {
    const order = orders.value.find(o => o.id === id)
    if (order) { order.status = 'delivered'; order.statusText = res.data.statusText }
  })
}

function reviewOrder(id) {
  router.push({ path: '/', query: { review: id } })
}
</script>

<style scoped>
.orders-page { padding: 40px 0; }
.page-title { font-family: var(--font-display); font-size: 1.8rem; color: var(--dark); margin-bottom: 30px; }
.page-title i { color: var(--gold); margin-right: 10px; }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state i { font-size: 4rem; color: #ddd; margin-bottom: 20px; }
.empty-state h3 { color: var(--dark); margin-bottom: 10px; }
.empty-state p { color: var(--text-light); margin-bottom: 20px; }

.order-card { background: var(--white); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); margin-bottom: 20px; }
.order-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 25px; background: var(--off-white); }
.order-info { display: flex; gap: 20px; align-items: center; }
.order-id { font-weight: 600; color: var(--dark); }
.order-date { font-size: 0.85rem; color: var(--text-light); }
.order-status { padding: 4px 12px; border-radius: 15px; font-size: 0.8rem; font-weight: 600; }
.order-status.pending { background: #FFF3CD; color: #856404; }
.order-status.paid { background: #D1ECF1; color: #0C5460; }
.order-status.shipped { background: #D4EDDA; color: #155724; }
.order-status.delivered { background: #D6D8DB; color: #383D41; }

.order-items { padding: 20px 25px; }
.order-item { display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.order-item:last-child { border-bottom: none; }
.order-item img { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; }
.item-info { flex: 1; }
.item-info h4 { font-size: 0.95rem; color: var(--dark); margin-bottom: 4px; }
.item-info p { font-size: 0.8rem; color: var(--text-light); }
.item-price { font-weight: 600; color: var(--dark); }

.order-footer { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-top: 1px solid #f5f5f5; }
.order-address { font-size: 0.85rem; color: var(--text-light); }
.order-total { display: flex; align-items: center; gap: 10px; }
.discount { color: var(--red); font-size: 0.85rem; }
.total { font-weight: 700; color: var(--dark); font-size: 1.05rem; }

.order-actions { display: flex; gap: 10px; padding: 15px 25px; border-top: 1px solid #f5f5f5; justify-content: flex-end; }
.btn-sm { padding: 8px 20px; font-size: 0.8rem; }
</style>
