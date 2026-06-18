/**
 * LUMIERE API Layer
 * Supports Mock data (for production) and real API (for development)
 */

export interface Product {
  id: number
  name: string
  category: string
  price: number
  original: number | null
  image: string
  images: string[]
  tag: string
  tagText: string
  rating: number
  reviews: number
  stock: number
  desc: string
  specs: Record<string, string>
  options: string[]
}

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar: string
  memberLevel: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  option: string
  qty: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  discount: number
  finalAmount: number
  address: string
  status: string
  statusText: string
  createdAt: string
}

export interface Review {
  id: number
  productId: number
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  date: string
}

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// ===== Mock Data =====
const mockProducts: Product[] = [
  {
    id: 1, name: '北欧极光落地灯', category: '家具', price: 599, original: 899,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80'],
    tag: 'hot', tagText: '热销', rating: 4.8, reviews: 236, stock: 50,
    desc: '灵感来源于北欧极光的柔和光线设计，三档调光。',
    specs: { '材质': '金属+磨砂玻璃', '高度': '165cm', '功率': '12W LED' },
    options: ['暖白光', '自然光', '冷白光']
  },
  {
    id: 2, name: '意式手工陶瓷花瓶', category: '饰品', price: 299, original: null,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80'],
    tag: 'new', tagText: '新品', rating: 4.9, reviews: 89, stock: 120,
    desc: '意大利工匠手工制作，高温烧制陶瓷。',
    specs: { '材质': '高温陶瓷', '高度': '28cm', '产地': '意大利' },
    options: ['象牙白', '雾霾蓝', '复古绿']
  },
  {
    id: 3, name: '天然大豆蜡香薰', category: '香氛', price: 168, original: 238,
    image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80'],
    tag: 'sale', tagText: '特惠', rating: 4.7, reviews: 412, stock: 200,
    desc: '100%天然大豆蜡，燃烧45小时。',
    specs: { '材质': '天然大豆蜡', '净重': '220g', '燃烧时间': '45小时' },
    options: ['佛手柑', '薰衣草', '白茶', '琥珀']
  },
  {
    id: 4, name: '日式侘寂风茶几', category: '家具', price: 1299, original: 1699,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&q=80'],
    tag: 'hot', tagText: '热销', rating: 4.9, reviews: 158, stock: 30,
    desc: '日本侘寂美学，白橡木实木。',
    specs: { '材质': '白橡木实木', '尺寸': '120×60×35cm' },
    options: ['原木色', '胡桃色']
  },
  {
    id: 5, name: '北欧羊毛地毯', category: '家具', price: 899, original: null,
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80'],
    tag: 'new', tagText: '新品', rating: 4.6, reviews: 67, stock: 45,
    desc: '新西兰进口羊毛手工编织。',
    specs: { '材质': '新西兰羊毛', '尺寸': '200×300cm' },
    options: ['米灰色', '浅驼色', '深咖色']
  },
  {
    id: 6, name: '手工锤纹铜壶', category: '餐厨', price: 359, original: 499,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
    tag: 'sale', tagText: '特惠', rating: 4.8, reviews: 203, stock: 80,
    desc: '纯铜手工锤纹工艺。',
    specs: { '材质': '纯铜99.9%', '容量': '1.2L' },
    options: ['黄铜色', '红铜色']
  },
  {
    id: 7, name: '极简壁挂装饰镜', category: '饰品', price: 459, original: null,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80'],
    tag: 'new', tagText: '新品', rating: 4.7, reviews: 94, stock: 60,
    desc: '极简无框设计，5mm银镜。',
    specs: { '材质': '5mm银镜', '尺寸': '60×80cm' },
    options: ['圆角矩形', '圆形', '拱形']
  },
  {
    id: 8, name: '法式真丝抱枕套', category: '家具', price: 199, original: 299,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'],
    tag: 'hot', tagText: '热销', rating: 4.9, reviews: 321, stock: 150,
    desc: '100%桑蚕丝，法式浪漫设计。',
    specs: { '材质': '100%桑蚕丝', '尺寸': '45×45cm', '克重': '22姆米' },
    options: ['香槟金', '玫瑰粉', '雾霾蓝', '薄荷绿']
  }
]

const mockReviews: Record<number, Review[]> = {
  1: [
    { id: 1, productId: 1, userId: 'u1', userName: '林小姐', userAvatar: '林', rating: 5, content: '灯非常漂亮！光线很柔和。', date: '2024-12-15' },
    { id: 2, productId: 1, userId: 'u2', userName: '张先生', userAvatar: '张', rating: 5, content: '三档调光很实用，做工精致。', date: '2024-12-10' },
    { id: 3, productId: 1, userId: 'u3', userName: '王女士', userAvatar: '王', rating: 4, content: '整体不错，灯罩有点重。', date: '2024-12-05' }
  ],
  2: [
    { id: 4, productId: 2, userId: 'u4', userName: '陈先生', userAvatar: '陈', rating: 5, content: '手工陶瓷质感太好了。', date: '2024-12-18' },
    { id: 5, productId: 2, userId: 'u5', userName: '李女士', userAvatar: '李', rating: 5, content: '放在玄关插干花，心情很好。', date: '2024-12-12' }
  ],
  3: [
    { id: 6, productId: 3, userId: 'u6', userName: '赵先生', userAvatar: '赵', rating: 5, content: '味道很天然，不刺鼻。', date: '2024-12-20' },
    { id: 7, productId: 3, userId: 'u7', userName: '孙女士', userAvatar: '孙', rating: 4, content: '香味持久。', date: '2024-12-16' },
    { id: 8, productId: 3, userId: 'u8', userName: '周女士', userAvatar: '周', rating: 5, content: '回购第三次了！', date: '2024-12-08' }
  ],
  4: [
    { id: 9, productId: 4, userId: 'u9', userName: '吴先生', userAvatar: '吴', rating: 5, content: '实木质感太好了。', date: '2024-12-22' },
    { id: 10, productId: 4, userId: 'u10', userName: '郑女士', userAvatar: '郑', rating: 5, content: '侘寂风太有感觉了。', date: '2024-12-19' }
  ],
  5: [
    { id: 11, productId: 5, userId: 'u11', userName: '冯先生', userAvatar: '冯', rating: 4, content: '羊毛很柔软。', date: '2024-12-21' },
    { id: 12, productId: 5, userId: 'u12', userName: '何女士', userAvatar: '何', rating: 5, content: '颜色比图片还好看。', date: '2024-12-17' }
  ],
  6: [
    { id: 13, productId: 6, userId: 'u13', userName: '许先生', userAvatar: '许', rating: 5, content: '铜壶太有质感了！', date: '2024-12-23' },
    { id: 14, productId: 6, userId: 'u14', userName: '邓女士', userAvatar: '邓', rating: 4, content: '手工锤纹很精美。', date: '2024-12-14' }
  ],
  7: [
    { id: 15, productId: 7, userId: 'u15', userName: '曹先生', userAvatar: '曹', rating: 5, content: '镜子很清晰。', date: '2024-12-24' },
    { id: 16, productId: 7, userId: 'u16', userName: '彭女士', userAvatar: '彭', rating: 4, content: '尺寸刚好。', date: '2024-12-11' }
  ],
  8: [
    { id: 17, productId: 8, userId: 'u17', userName: '曾女士', userAvatar: '曾', rating: 5, content: '真丝触感太舒服了！', date: '2024-12-25' },
    { id: 18, productId: 8, userId: 'u18', userName: '苏先生', userAvatar: '苏', rating: 5, content: '颜色很高级。', date: '2024-12-13' },
    { id: 19, productId: 8, userId: 'u19', userName: '卢女士', userAvatar: '卢', rating: 4, content: '质量不错。', date: '2024-12-09' }
  ]
}

const storage = {
  get<T>(key: string, def: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') || def } catch { return def } },
  set(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)) }
}

// ===== Mock Implementation =====
function mockAPI() {
  interface MockUser { id: string; username: string; email: string; phone: string; avatar: string; memberLevel: string }
  let users: MockUser[] = storage.get<MockUser[]>('mock_users', [])
  let carts: Record<string, CartItem[]> = storage.get('mock_carts', {})
  let orders: Order[] = storage.get('mock_orders', [])
  let favorites: Record<string, number[]> = storage.get('mock_favorites', {})
  let reviews: Record<number, Review[]> = storage.get('mock_reviews', mockReviews)
  const tokens: Record<string, string> = {}

  function findUser(userId: string) { return users.find(u => u.id === userId) }
  function getTokenUserId(token: string): string {
    return tokens[token] || JSON.parse(atob(token)).userId
  }

  return {
    'GET /api/products': (params: Record<string, string>) => {
      let list = [...mockProducts]
      if (params.category && params.category !== 'all') list = list.filter(p => p.category === decodeURIComponent(params.category))
      if (params.keyword) { const kw = decodeURIComponent(params.keyword).toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(kw)) }
      if (params.minPrice) list = list.filter(p => p.price >= parseFloat(params.minPrice))
      if (params.maxPrice) list = list.filter(p => p.price <= parseFloat(params.maxPrice))
      if (params.tag) list = list.filter(p => p.tag === params.tag)
      const sort = params.sort || 'default'
      if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
      else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
      else if (sort === 'sales') list.sort((a, b) => b.reviews - a.reviews)
      const page = parseInt(params.page) || 1
      const pageSize = parseInt(params.pageSize) || 8
      const total = list.length
      return { code: 200, data: { list: list.slice((page - 1) * pageSize, page * pageSize), total, page, pageSize, totalPages: Math.ceil(total / pageSize) } }
    },
    'GET /api/products/:id': (params: { id: string }) => {
      const p = mockProducts.find(x => x.id === parseInt(params.id))
      return p ? { code: 200, data: p } : { code: 404, message: '商品不存在' }
    },
    'GET /api/products/recommend/:id': (params: { id: string }) => {
      const p = mockProducts.find(x => x.id === parseInt(params.id))
      if (!p) return { code: 404 }
      return { code: 200, data: mockProducts.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4) }
    },
    'GET /api/reviews/:id': (params: { id: string }) => ({ code: 200, data: reviews[parseInt(params.id)] || [] }),
    'POST /api/reviews': (data: { productId: number; rating: number; content: string }, token?: string) => {
      const userId = token ? getTokenUserId(token) : 'guest'
      const user = findUser(userId) || { username: '用户', avatar: 'U' }
      const review: Review = { id: Date.now(), productId: data.productId, userId, userName: user.username, userAvatar: user.avatar, rating: data.rating, content: data.content, date: new Date().toISOString().split('T')[0] }
      if (!reviews[data.productId]) reviews[data.productId] = []
      reviews[data.productId].unshift(review)
      storage.set('mock_reviews', reviews)
      return { code: 200, data: review, message: '评价提交成功' }
    },
    'POST /api/auth/register': (data: { username: string; email: string; password: string; phone?: string }) => {
      if (users.find(u => u.email === data.email)) return { code: 400, message: '该邮箱已被注册' }
      const user: MockUser = { id: 'user_' + Date.now(), username: data.username, email: data.email, phone: data.phone || '', avatar: data.username.charAt(0), memberLevel: '普通会员' }
      users.push(user); storage.set('mock_users', users)
      carts[user.id] = []; favorites[user.id] = []
      const token = btoa(JSON.stringify({ userId: user.id, username: user.username }))
      tokens[token] = user.id
      return { code: 200, data: { token, user }, message: '注册成功' }
    },
    'POST /api/auth/login': (data: { email: string; password: string }) => {
      const user = users.find(u => u.email === data.email)
      if (!user) return { code: 400, message: '用户不存在' }
      const token = btoa(JSON.stringify({ userId: user.id, username: user.username }))
      tokens[token] = user.id
      return { code: 200, data: { token, user }, message: '登录成功' }
    },
    'GET /api/auth/me': (_data: unknown, token?: string) => {
      if (!token) return { code: 401, message: '请先登录' }
      const userId = getTokenUserId(token)
      const user = findUser(userId)
      return user ? { code: 200, data: user } : { code: 404, message: '用户不存在' }
    },
    'GET /api/cart': (_data: unknown, token?: string) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      return { code: 200, data: carts[userId] || [] }
    },
    'POST /api/cart': (data: { productId: number; quantity: number; option: string }, token?: string) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      const product = mockProducts.find(p => p.id === data.productId)
      if (!product) return { code: 404, message: '商品不存在' }
      if (!carts[userId]) carts[userId] = []
      const existing = carts[userId].find(i => i.id === data.productId && i.option === data.option)
      if (existing) existing.qty += (data.quantity || 1)
      else carts[userId].push({ id: product.id, name: product.name, price: product.price, image: product.image, option: data.option || product.options[0], qty: data.quantity || 1 })
      storage.set('mock_carts', carts)
      return { code: 200, data: carts[userId], message: '已添加到购物车' }
    },
    'PUT /api/cart/:id': (data: { qty: number }, token?: string, params?: { id: string }) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      const item = carts[userId]?.find(i => i.id === parseInt(params?.id || '0'))
      if (item) item.qty = Math.max(1, data.qty)
      storage.set('mock_carts', carts)
      return { code: 200, data: carts[userId] || [] }
    },
    'DELETE /api/cart/:id': (_data: unknown, token?: string, params?: { id: string }) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      if (carts[userId]) carts[userId] = carts[userId].filter(i => i.id !== parseInt(params?.id || '0'))
      storage.set('mock_carts', carts)
      return { code: 200, data: carts[userId] || [], message: '已删除' }
    },
    'GET /api/favorites': (_data: unknown, token?: string) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      const ids = favorites[userId] || []
      return { code: 200, data: mockProducts.filter(p => ids.includes(p.id)) }
    },
    'POST /api/favorites/:id': (_data: unknown, token?: string, params?: { id: string }) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      if (!favorites[userId]) favorites[userId] = []
      const idx = favorites[userId].indexOf(parseInt(params?.id || '0'))
      if (idx > -1) favorites[userId].splice(idx, 1)
      else favorites[userId].push(parseInt(params?.id || '0'))
      storage.set('mock_favorites', favorites)
      return { code: 200, data: favorites[userId], message: idx > -1 ? '已取消收藏' : '已添加收藏' }
    },
    'POST /api/orders': (data: { items: Array<{ id: number; qty: number; option: string }>; address: string; couponCode?: string }, token?: string) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      let totalAmount = 0
      const items = data.items.map(item => {
        const p = mockProducts.find(x => x.id === item.id)
        if (p) { totalAmount += p.price * item.qty; return { id: item.id, name: p.name, price: p.price, image: p.image, option: item.option, qty: item.qty } }
        return null
      }).filter(Boolean) as CartItem[]
      let discount = 0
      if (data.couponCode === 'WELCOME10' && totalAmount >= 299) discount = 10
      else if (data.couponCode === 'SAVE30' && totalAmount >= 599) discount = 30
      else if (data.couponCode === 'VIP50' && totalAmount >= 999) discount = 50
      const order: Order = { id: 'ORD' + Date.now(), userId, items, totalAmount, discount, finalAmount: totalAmount - discount, address: data.address || '默认地址', status: 'pending', statusText: '待支付', createdAt: new Date().toISOString() }
      orders.push(order); storage.set('mock_orders', orders)
      if (carts[userId]) { carts[userId] = []; storage.set('mock_carts', carts) }
      return { code: 200, data: order, message: '订单创建成功' }
    },
    'GET /api/orders': (_data: unknown, token?: string) => {
      if (!token) return { code: 401 }
      const userId = getTokenUserId(token)
      return { code: 200, data: orders.filter(o => o.userId === userId).reverse() }
    },
    'PUT /api/orders/:id/status': (data: { status: string }, token?: string, params?: { id: string }) => {
      const order = orders.find(o => o.id === params?.id)
      if (!order) return { code: 404 }
      const statusMap: Record<string, string> = { paid: '已支付', shipped: '已发货', delivered: '已签收', cancelled: '已取消' }
      order.status = data.status; order.statusText = statusMap[data.status] || data.status
      storage.set('mock_orders', orders)
      return { code: 200, data: order }
    },
    'POST /api/coupons/verify': (data: { code: string; amount: number }) => {
      const coupons: Array<{ code: string; discount: number; minAmount: number; desc: string }> = [
        { code: 'WELCOME10', discount: 10, minAmount: 299, desc: '新用户专享满299减10' },
        { code: 'SAVE30', discount: 30, minAmount: 599, desc: '满599减30' },
        { code: 'VIP50', discount: 50, minAmount: 999, desc: '会员专享满999减50' }
      ]
      const coupon = coupons.find(c => c.code === data.code && data.amount >= c.minAmount)
      return coupon ? { code: 200, data: { discount: coupon.discount, desc: coupon.desc } } : { code: 400, message: '优惠券无效' }
    }
  }
}

// ===== Real API =====
import axios from 'axios'
const api = axios.create({ baseURL: '/api', timeout: 10000 })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = 'Bearer ' + token
  return config
})
api.interceptors.response.use(res => res.data, err => Promise.reject(err.response?.data || err.message))

// ===== Unified Request =====
const mockImpl = mockAPI()

function request(method: string, url: string, data?: unknown, params?: Record<string, string>): Promise<any> {
  if (useMock) {
    const key = `${method} ${url.split('?')[0]}`
    const fn = mockImpl[key as keyof typeof mockImpl] as any
    if (fn) {
      const token = localStorage.getItem('token') || undefined
      const urlParams = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''))
      const pathParams: Record<string, string> = {}
      const pathParts = url.split('?')[0].split('/')
      if (pathParts.length > 4) pathParams.id = pathParts[4]
      return Promise.resolve(fn({ ...urlParams, ...pathParams }, token, pathParams, data))
    }
    return Promise.reject({ message: 'API not mocked: ' + key })
  }
  if (method === 'GET') return api.get(url, { params })
  if (method === 'POST') return api.post(url, data)
  if (method === 'PUT') return api.put(url, data)
  if (method === 'DELETE') return api.delete(url)
  return Promise.reject({ method })
}

export default { request, useMock }
export type { Product, User, CartItem, Order, Review }

export const productAPI = {
  list: (params: Record<string, string>) => request('GET', '/products', null, params),
  detail: (id: number) => request('GET', '/products/' + id),
  recommend: (id: number) => request('GET', '/products/recommend/' + id),
  reviews: (id: number) => request('GET', '/reviews/' + id),
  addReview: (data: { productId: number; rating: number; content: string }) => request('POST', '/reviews', data)
}
export const authAPI = {
  register: (data: { username: string; email: string; password: string; phone?: string }) => request('POST', '/auth/register', data),
  login: (data: { email: string; password: string }) => request('POST', '/auth/login', data),
  me: () => request('GET', '/auth/me')
}
export const cartAPI = {
  list: () => request('GET', '/cart'),
  add: (data: { productId: number; quantity: number; option: string }) => request('POST', '/cart', data),
  update: (id: number, data: { qty: number }) => request('PUT', '/cart/' + id, data),
  remove: (id: number) => request('DELETE', '/cart/' + id)
}
export const favAPI = {
  list: () => request('GET', '/favorites'),
  toggle: (id: number) => request('POST', '/favorites/' + id)
}
export const orderAPI = {
  create: (data: { items: Array<{ id: number; qty: number; option: string }>; address: string; couponCode?: string }) => request('POST', '/orders', data),
  list: () => request('GET', '/orders'),
  updateStatus: (id: string, status: string) => request('PUT', '/orders/' + id + '/status', { status })
}
export const couponAPI = {
  verify: (data: { code: string; amount: number }) => request('POST', '/coupons/verify', data)
}
