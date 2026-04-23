<template>
  <div class="home-page">
    <!-- 搜索框区域 -->
    <div class="search-box">
      <input 
        v-model="keyword" 
        type="text" 
        placeholder="搜索商品关键词..."
        @keyup.enter="goSearch"
      />
      <button class="search-btn" @click="goSearch">搜索</button>
    </div>

    <!-- 轮播图区域：平滑淡入淡出自动切换 -->
    <div class="carousel-box">
      <img 
        class="carousel-img" 
        :src="carouselList[carouselIndex]" 
        :key="carouselIndex"
      />
    </div>

    <!-- 分类区域（带展开更多，修复文字遮挡） -->
    <div class="classify-box">
      <div class="classify-title">全部分类</div>

      <div class="classify-grid">
        <div 
          class="classify-item" 
          v-for="(item, index) in showAllClassify ? classifyList : classifyList.slice(0, 10)" 
          :key="index"
          @click="goClassifySearch(item.title)"
        >
          <img :src="item.img" class="classify-img" />
          <span class="classify-text">{{ item.title }}</span>
        </div>
      </div>

      <div class="classify-more" @click="showAllClassify = !showAllClassify">
        {{ showAllClassify ? '收起 ↑' : '更多 ↓' }}
      </div>
    </div>

    <!-- 商品列表区域 -->
    <div class="goods-box">
      <div class="goods-title">推荐商品</div>
      <div class="goods-grid">
        <div 
          class="goods-item" 
          v-for="item in goodsList" 
          :key="item.id"
          @click="goGoodsDetail(item.id)"
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

      <div class="load-tip" v-if="loading">正在加载更多商品...</div>
      <div class="load-tip" v-if="noMore">没有更多商品了</div>
      <div class="load-observer" ref="loadObserver"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const keyword = ref('')

// 搜索
const goSearch = () => {
  if (!keyword.value.trim()) return
  router.push(`/search?keyword=${encodeURIComponent(keyword.value.trim())}`)
}

// 分类点击：取前两个字搜索
const goClassifySearch = (title) => {
  const searchWord = title.slice(0, 2)
  router.push(`/search?keyword=${encodeURIComponent(searchWord)}`)
}

// 控制分类是否全部显示
const showAllClassify = ref(false)

// ====================== 分类 + 图片 ======================
const classifyList = ref([
  { title: '新品专区', img: new URL('../assets/img/classify_img/1.jpg', import.meta.url).href },
  { title: '体验专区', img: new URL('../assets/img/classify_img/2.jpg', import.meta.url).href },
  { title: '任务专区', img: new URL('../assets/img/classify_img/3.jpg', import.meta.url).href },
  { title: '航天专区', img: new URL('../assets/img/classify_img/4.jpg', import.meta.url).href },
  { title: '女陪专区', img: new URL('../assets/img/classify_img/5.jpg', import.meta.url).href },
  { title: '趣味专区', img: new URL('../assets/img/classify_img/6.jpg', import.meta.url).href },
  { title: '监狱专区', img: new URL('../assets/img/classify_img/7.jpg', import.meta.url).href },
  { title: '陪玩专区', img: new URL('../assets/img/classify_img/8.jpg', import.meta.url).href },
  { title: '大红专区', img: new URL('../assets/img/classify_img/1.jpg', import.meta.url).href },
  { title: '清图专区', img: new URL('../assets/img/classify_img/2.jpg', import.meta.url).href },
  { title: '手游专区', img: new URL('../assets/img/classify_img/3.jpg', import.meta.url).href },
  { title: '小金专区', img: new URL('../assets/img/classify_img/5.jpg', import.meta.url).href },
  { title: '包出专区', img: new URL('../assets/img/classify_img/8.jpg', import.meta.url).href },
  { title: '休闲娱乐', img: new URL('../assets/img/classify_img/2.jpg', import.meta.url).href },
  { title: '巴克什专区', img: new URL('../assets/img/classify_img/3.jpg', import.meta.url).href },
])

// ===================== 商品列表 =====================
const goodsList = ref([])
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const noMore = ref(false)
const loadObserver = ref(null)
let observer = null

const getGoodsList = async (isLoadMore = false) => {
  if (loading.value || noMore.value) return
  loading.value = true

  const from = (page.value - 1) * pageSize.value
  const to = from + pageSize.value - 1

  const { data, error, count } = await supabase
    .from('goods')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .range(from, to)

  loading.value = false
  if (error) return

  if (isLoadMore) {
    goodsList.value = [...goodsList.value, ...data]
  } else {
    goodsList.value = data
  }

  if (goodsList.value.length >= count) noMore.value = true
  else page.value += 1
}

// 轮播图
const carouselList = ref([
  new URL('../assets/img/carousel_graph/1.jpg', import.meta.url).href,
  new URL('../assets/img/carousel_graph/2.jpg', import.meta.url).href,
])
const carouselIndex = ref(0)

function nextCarousel() {
  carouselIndex.value = (carouselIndex.value + 1) % carouselList.value.length
}

onMounted(() => {
  setInterval(nextCarousel, 3000)
})

const goGoodsDetail = (id) => {
  router.push(`/goods/${id}`)
}

onMounted(() => {
  getGoodsList()

  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) getGoodsList(true)
  }, { rootMargin: '0px 0px 100px 0px' })

  if (loadObserver.value) observer.observe(loadObserver.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.home-page { 
  padding: 15px; 
  padding-bottom: 30px; 
  background: #ffe8df; 
  color: #000;
}

.search-box { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 20px;
  background: #ffe8df;
  padding: 5px;
  border-radius: 30px;
}
.search-box input { 
  flex: 1; 
  height: 45px; 
  padding: 0 15px; 
  border: 1px solid #ffd1b8; 
  border-radius: 25px; 
  background: #ffffff; 
  color: #000;
}
.search-btn { 
  width: 70px; 
  height: 45px; 
  border: none; 
  border-radius: 25px; 
  background: #ff753a; 
  color: white; 
  cursor: pointer;
}

.carousel-box {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
  background: #ffd1b8;
  position: relative;
}
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  animation: fadeSlide 3s ease-in-out infinite;
}
.carousel-img:first-of-type { opacity: 1; }
@keyframes fadeSlide {
  0% { opacity: 0; transform: scale(1.05); }
  15% { opacity: 1; transform: scale(1); }
  85% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.05); }
}

.classify-box { 
  margin-bottom: 25px;
  background: #ffffff;
  padding: 15px;
  border-radius: 16px;
}
.classify-title { 
  font-size: 18px; 
  font-weight: bold; 
  color: #000; 
  margin-bottom: 15px; 
  border-left: 4px solid #ff753a; 
  padding-left: 5px; 
}
.classify-grid { 
  display: grid; 
  grid-template-columns: repeat(5, 1fr); 
  gap: 15px 10px;
  margin-bottom: 10px;
}
.classify-item { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  cursor: pointer;
}
.classify-img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffefe5;
}
.classify-text { 
  font-size: 13px; 
  color: #333; 
  margin-top: 6px; 
  text-align: center; 
  white-space: nowrap;
}

.classify-more {
  text-align: center;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s;
}
.classify-more:hover {
  color: #ff753a;
}

.goods-box { 
  background: #ffe8df;
}
.goods-title { 
  font-size: 18px; 
  font-weight: bold; 
  color: #000; 
  margin-bottom: 15px; 
  border-left: 4px solid #ff753a; 
  padding-left: 5px; 
}
.goods-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 15px; 
}
.goods-item { 
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
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
  align-items: center;
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
  padding: 20px 0; 
  color: #999; 
}
.load-observer { 
  height: 10px; 
}
</style>