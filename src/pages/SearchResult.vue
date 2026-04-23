<template>
  <div class="search-page">
    <!-- 顶部 + 返回按钮 -->
    <div class="search-header">
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

    <div class="result-info" v-if="searched">
      找到 {{ total }} 个相关商品
    </div>

    <div class="goods-grid" v-if="goodsList.length > 0">
      <div
        class="goods-item"
        v-for="item in goodsList"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <img :src="item.cover_img" class="goods-cover" />
        <div class="goods-info">
          <div class="goods-name">{{ item.title }}</div>
          <div class="goods-bottom">
            <span class="goods-price">¥{{ item.price }}</span>
            <span class="goods-sales">销量 {{ item.order_num || 0 }}</span>
          </div>
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

const router = useRouter()
const route = useRoute()

const keyword = ref('')
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
      keyword.value = newKw
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
  padding: 15px;
  background: #f5f5f7;
  min-height: 100vh;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}
.back {
  font-size: 20px;
  padding: 8px;
  cursor: pointer;
}
.search-bar {
  flex: 1;
  display: flex;
  gap: 10px;
}
.search-bar input {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #eee;
  padding: 0 15px;
}
.search-bar button {
  padding: 0 18px;
  border-radius: 22px;
  background: #ff753a;
  color: #fff;
  border: none;
}

.result-info {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.goods-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.goods-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}
.goods-info {
  padding: 10px;
}
.goods-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.goods-price {
  color: #ff753a;
  font-weight: bold;
}
.goods-sales {
  color: #999;
}

.load-tip {
  text-align: center;
  padding: 15px 0;
  color: #999;
  font-size: 13px;
}
</style>