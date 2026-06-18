<template>
  <div class="favorites-page">
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-heart"></i> 我的收藏</h1>
        <span class="fav-count" v-if="fav.items.length">{{ fav.items.length }} 件商品</span>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="!fav.items.length">
        <i class="far fa-heart"></i>
        <h3>还没有收藏任何商品</h3>
        <p>快去发现心仪好物吧~</p>
        <router-link to="/" class="btn-primary">去逛逛</router-link>
      </div>

      <!-- 收藏列表 -->
      <div class="fav-grid" v-else>
        <div class="fav-card" v-for="item in fav.items" :key="item.id">
          <router-link :to="'/product/' + item.id">
            <div class="fav-img">
              <img :src="item.image" :alt="item.name">
            </div>
            <div class="fav-info">
              <h4>{{ item.name }}</h4>
              <div class="fav-rating">
                <span v-for="s in 5" :key="s">{{ s <= Math.floor(item.rating) ? '★' : '☆' }}</span>
                <span class="review-count">({{ item.reviews }})</span>
              </div>
              <div class="fav-price">¥{{ item.price }}</div>
            </div>
          </router-link>
          <div class="fav-actions">
            <button class="btn-primary btn-sm" @click="addToCart(item.id)">加入购物车</button>
            <button class="remove-btn" @click="toggleFav(item.id)"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFavStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'

const fav = useFavStore()
const cart = useCartStore()

onMounted(() => { fav.init() })

function toggleFav(id) { fav.toggle(id) }
function addToCart(id) {
  const item = fav.items.find(i => i.id === id)
  if (item) cart.add(id, 1, item.options ? item.options[0] : '')
}
</script>

<style scoped>
.favorites-page { padding: 40px 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
.page-header h1 { font-family: var(--font-display); font-size: 1.8rem; color: var(--dark); }
.page-header h1 i { color: var(--red); margin-right: 10px; }
.fav-count { color: var(--text-light); }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state i { font-size: 4rem; color: #ddd; margin-bottom: 20px; }
.empty-state h3 { color: var(--dark); margin-bottom: 10px; }
.empty-state p { color: var(--text-light); margin-bottom: 20px; }

.fav-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
.fav-card { background: var(--white); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: var(--transition); }
.fav-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
.fav-img { position: relative; height: 220px; overflow: hidden; }
.fav-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.fav-card:hover .fav-img img { transform: scale(1.05); }
.fav-info { padding: 18px; }
.fav-info h4 { font-size: 1rem; color: var(--dark); margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.fav-rating { color: var(--gold); font-size: 0.85rem; margin-bottom: 8px; }
.review-count { color: var(--text-light); margin-left: 5px; }
.fav-price { font-size: 1.15rem; font-weight: 700; color: var(--red); }
.fav-actions { display: flex; gap: 10px; padding: 0 18px 18px; }
.btn-sm { padding: 8px 16px; font-size: 0.8rem; }
.remove-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #ddd; background: var(--white); color: #ccc; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
.remove-btn:hover { color: var(--red); border-color: var(--red); }

@media (max-width: 1024px) { .fav-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .fav-grid { grid-template-columns: 1fr; } }
</style>
