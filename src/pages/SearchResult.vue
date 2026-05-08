<template>
  <div class="search-page">
    <!-- 顶部 + 返回按钮 -->
    <div class="search-header" v-if="!isZone">
      <div class="back" @click="goBack">←</div>
      <div class="search-bar">
        <input
          v-model="keyword"
          type="text"
          placeholder="输入关键词搜索"
          @keyup.enter="doSearch"
        />
        <button @click="doSearch">搜索</button>
      </div>
    </div>

    <div class="search-header" v-else>
      <div class="back" @click="goBack">←</div>
      <div class="zone-title">{{ zoneTitle }}</div>
    </div>

    <div class="result-info" v-if="searched">
      找到 {{ total }} 个相关商品
    </div>

    <div class="goods-grid" v-if="goodsList.length > 0">
      <div
        class="goods-card"
        v-for="(item, index) in goodsList"
        :key="item.id"
        :class="`card-pattern-${(index % 4) + 1}`"
        @click="goDetail(item.id)"
      >
        <div class="goods-card-inner">
          <div class="card-decor"></div>
          <div class="card-content">
            <h3 class="goods-name">{{ item.title }}</h3>
            <div class="card-bottom">
              <span class="goods-price">¥{{ item.price }}</span>
              <div class="card-arrow">→</div>
            </div>
          </div>
          <div class="card-slash"></div>
        </div>
      </div>
    </div>

    <div class="load-tip" v-if="loading">加载中...</div>
    <div class="load-tip" v-if="searched && goodsList.length === 0 && !loading">暂无相关商品</div>
    <div class="load-tip" v-if="noMore && goodsList.length > 0">已加载全部商品</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../supabase'
import { getUserId } from '../utils/user'

const router = useRouter()
const route = useRoute()

const keyword = ref('')
const isZone = ref(false)
const zoneTitle = ref('')
const goodsList = ref([])
const loading = ref(false)
const searched = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = 20
const noMore = ref(false)

// 搜索方法（放到最前面，解决报错）
const doSearch = async () => {
  const kw = keyword.value?.trim()
  if (!kw) return

  isZone.value = false
  page.value = 1
  goodsList.value = []
  noMore.value = false
  searched.value = true
  loading.value = true

  const from = (page.value - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('goods')
    .select('*', { count: 'exact' })
    .ilike('title', `%${kw}%`)
    .range(from, to)

  loading.value = false
  if (error) return

  total.value = count || 0
  goodsList.value = data || []

  if (goodsList.value.length >= total.value) {
    noMore.value = true
  } else {
    page.value++
  }
}

// 监听路由（现在不会报错了）
watch(
  () => route.query.keyword,
  (newKw) => {
    if (newKw) {
      const kw = newKw
      if (kw.includes('专区')) {
        isZone.value = true
        zoneTitle.value = kw
        keyword.value = kw.replace(/专区/g, '').trim()
      } else {
        isZone.value = false
        keyword.value = kw
      }
      doSearch()
    }
  },
  { immediate: true }
)

// 加载更多
const loadMore = async () => {
  if (loading.value || noMore.value) return

  const kw = keyword.value?.trim()
  if (!kw) return

  loading.value = true
  const from = (page.value - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('goods')
    .select('*')
    .ilike('title', `%${kw}%`)
    .range(from, to)

  loading.value = false
  if (error || !data || data.length === 0) {
    noMore.value = true
    return
  }

  goodsList.value = [...goodsList.value, ...data]
  page.value++
}

// 触底
const handleScroll = () => {
  if (loading.value || noMore.value) return
  const st = document.documentElement.scrollTop || document.body.scrollTop
  const ch = document.documentElement.clientHeight
  const sh = document.documentElement.scrollHeight
  if (st + ch + 100 >= sh) loadMore()
}

// 返回
const goBack = () => {
  router.go(-1)
}

// 详情
const goDetail = (id) => {
  const uid = getUserId()
  if (!uid) return
  router.push(`/goods/${id}`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.search-page {
  padding: 12px;
  background: #ffffff;
  min-height: 100vh;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.back {
  font-size: 18px;
  padding: 8px;
  cursor: pointer;
  color: #666666;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back:hover {
  background: #eeeeee;
}

.zone-title {
  flex: 1;
  font-size: 16px;
  font-weight: 300;
  color: #333333;
  text-align: center;
  padding-right: 40px;
}

.search-bar {
  flex: 1;
  display: flex;
  gap: 10px;
}

.search-bar input {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0 14px;
  font-size: 14px;
  color: #333333;
  background: #f5f5f5;
  outline: none;
  transition: all 0.2s ease;
}

.search-bar input:focus {
  border-color: #999999;
  background: #ffffff;
}

.search-bar input::placeholder {
  color: #cccccc;
}

.search-bar button {
  padding: 0 18px;
  height: 40px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #333333;
  border: none;
  font-size: 13px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-bar button:hover {
  background: #eeeeee;
}

.result-info {
  font-size: 12px;
  color: #999999;
  margin-bottom: 14px;
}

.goods-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0 4px;
}

.goods-card {
  position: relative;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.goods-card-inner {
  position: relative;
  background: #ffffff;
  padding: 16px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  overflow: hidden;
}

.goods-card:hover .goods-card-inner {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-decor {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%);
  transition: all 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.card-arrow {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  transition: all 0.3s ease;
}

.goods-card:hover .card-arrow {
  background: #333333;
  color: #ffffff;
  transform: translateX(3px);
}

.card-slash {
  position: absolute;
  bottom: -15px;
  left: -5px;
  width: 100%;
  height: 50px;
  transform: rotate(-8deg);
  opacity: 0.5;
  transition: all 0.4s ease;
}

.goods-card:hover .card-slash {
  transform: rotate(-5deg) translateY(8px);
  opacity: 0.7;
}

.card-pattern-1 .card-slash {
  background: linear-gradient(90deg, transparent, rgba(100,100,100,0.08), transparent);
}

.card-pattern-2 .card-slash {
  background: linear-gradient(90deg, transparent, rgba(80,80,80,0.06), transparent);
}

.card-pattern-3 .card-slash {
  background: linear-gradient(90deg, transparent, rgba(120,120,120,0.07), transparent);
}

.card-pattern-4 .card-slash {
  background: linear-gradient(90deg, transparent, rgba(90,90,90,0.05), transparent);
}

.card-pattern-1 .goods-card-inner {
  border-bottom: 2px solid #f0f0f0;
}

.card-pattern-2 .goods-card-inner {
  border-left: 2px solid #f0f0f0;
}

.card-pattern-3 .goods-card-inner {
  border-top: 1px solid #f0f0f0;
}

.card-pattern-4 .goods-card-inner {
  border-right: 2px solid #f0f0f0;
}

.goods-name {
  font-size: 13px;
  font-weight: 300;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.goods-card:hover .goods-name {
  color: #000;
}

.goods-price {
  font-size: 16px;
  font-weight: 300;
  color: #1a1a1a;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.load-tip {
  text-align: center;
  padding: 20px 0;
  color: #999999;
  font-size: 12px;
}
</style>