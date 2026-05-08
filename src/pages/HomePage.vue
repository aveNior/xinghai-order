<template>
  <div class="home-page">
    <div class="page-decoration">
      <div class="diagonal-line diagonal-line-1"></div>
      <div class="diagonal-line diagonal-line-2"></div>
      <div class="diagonal-line diagonal-line-3"></div>
      <div class="diagonal-line diagonal-line-4"></div>
      <div class="diagonal-line diagonal-line-5"></div>
      <div class="corner-accent corner-accent-1"></div>
      <div class="corner-accent corner-accent-2"></div>
      <div class="corner-accent corner-accent-3"></div>
      <div class="corner-accent corner-accent-4"></div>
      <div class="grid-overlay"></div>
    </div>

    <header class="home-header">
      <div class="header-content">
        <div class="logo-section">
          <span class="logo-text">XINGYU</span>
          <span class="logo-sub">星屿小筑</span>
        </div>
        <div class="search-wrapper">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索商品"
              @keyup.enter="goSearch()"
              class="search-input"
            />
          </div>
        </div>
      </div>
    </header>

    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-title-wrapper">
          <div class="hero-title-container">
            <h1 class="hero-title">星屿</h1>
            <span class="hero-subtitle-small">小筑</span>
          </div>
          <div class="title-line"></div>
          <h2 class="hero-subtitle">致力于优质服务</h2>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">诚信</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">高效</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">保障</span>
          </div>
        </div>
      </div>
    </section>

    <section class="category-section">
      <div class="section-label">CATEGORIES</div>
      <div class="slash-container">
        <div class="slash-line slash-1"></div>
        <div class="slash-line slash-3"></div>
        <div class="slash-line slash-5"></div>
        
        <div class="category-items">
          <div class="category-item item-1" @click="goSearch(categoryList[0].title)">
            <span>{{ categoryList[0].title }}</span>
          </div>
          <div class="category-item item-2" @click="goSearch(categoryList[2].title)">
            <span>{{ categoryList[2].title }}</span>
          </div>
          <div class="category-item item-3" @click="goSearch(categoryList[1].title)">
            <span>{{ categoryList[1].title }}</span>
          </div>
          <div class="category-item item-4" @click="goSearch(categoryList[3].title)">
            <span>{{ categoryList[3].title }}</span>
          </div>
          <div class="category-item item-5" @click="goSearch(categoryList[4].title)">
            <span>{{ categoryList[4].title }}</span>
          </div>
          
          <div class="stick-figure-container">
            <svg class="stick-figure" viewBox="0 0 40 60" width="16" height="24">
              <circle cx="20" cy="6" r="5" fill="none" stroke="#666666" stroke-width="1.5"/>
              <line x1="20" y1="11" x2="20" y2="30" stroke="#666666" stroke-width="1.5" stroke-linecap="round"/>
              <line class="arm-left" x1="20" y1="16" x2="10" y2="24" stroke="#666666" stroke-width="1.5" stroke-linecap="round"/>
              <line class="arm-right" x1="20" y1="16" x2="30" y2="24" stroke="#666666" stroke-width="1.5" stroke-linecap="round"/>
              <line class="leg-left" x1="20" y1="30" x2="12" y2="45" stroke="#666666" stroke-width="1.5" stroke-linecap="round"/>
              <line class="leg-right" x1="20" y1="30" x2="28" y2="45" stroke="#666666" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section class="goods-section">
      <div class="section-header">
        <span class="section-label">FEATURED</span>
        <span class="section-link" @click="goSearch('')">VIEW ALL</span>
      </div>
      <div class="goods-container">
        <div class="goods-grid">
          <div
            v-for="(item, index) in goodsList"
            :key="item.id"
            class="goods-card"
            :class="`card-pattern-${(index % 4) + 1}`"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="goGoodsDetail(item.id)"
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
      </div>
    </section>

    <footer class="home-footer">
      <div class="footer-content">
        <span class="footer-brand">星屿小筑</span>
        <span class="footer-copyright">© 2026 XINGYU. All rights reserved.</span>
      </div>
    </footer>

    <Teleport to="body">
      <Transition name="toast">
        <div class="toast" v-if="showToast" :class="toastType">
          <span>{{ toastText }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import { getUserId } from '../utils/user'

const router = useRouter()
const keyword = ref('')
const goodsList = ref([])
const showToast = ref(false)
const toastText = ref('')
const toastType = ref('success')

const categoryList = ref([
  { title: '手游专区', icon: 'gamepad', count: 30 },
  { title: '端游专区', icon: 'monitor', count: 25 },
  { title: '趣味专区', icon: 'sparkles', count: 15 },
  { title: '陪玩专区', icon: 'users', count: 20 },
  { title: '清图专区', icon: 'map', count: 18 },
])

const showMsg = (text, type = 'success', second = 3) => {
  toastText.value = '星屿小筑提醒您：' + text
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, second * 1000)
}

const goSearch = (kw = '') => {
  const searchKeyword = kw || keyword.value.trim()
  if (!searchKeyword) return
  router.push(`/search?keyword=${encodeURIComponent(searchKeyword)}`)
}

const goGoodsDetail = (id) => {
  const uid = getUserId()
  if (!uid) {
    showMsg('请先登录', 'warning')
    return
  }
  router.push(`/goods/${id}`)
}

const getGoodsList = async () => {
  const { data, error } = await supabase
    .from('goods').select('*')
    .order('id', { ascending: false }).limit(8)
  if (!error && data) {
    goodsList.value = data
  }
}

onMounted(() => {
  getGoodsList()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  padding-bottom: 100px;
}

.page-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.diagonal-line {
  position: absolute;
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
}

.diagonal-line-1 {
  top: 15%;
  left: -10%;
  right: 30%;
  transform: rotate(-5deg);
}

.diagonal-line-2 {
  top: 35%;
  left: 20%;
  right: -10%;
  transform: rotate(3deg);
}

.diagonal-line-3 {
  top: 55%;
  left: -5%;
  right: 40%;
  transform: rotate(-2deg);
}

.diagonal-line-4 {
  top: 75%;
  left: 30%;
  right: -5%;
  transform: rotate(4deg);
}

.diagonal-line-5 {
  top: 90%;
  left: -15%;
  right: 20%;
  transform: rotate(-3deg);
}

.corner-accent {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.corner-accent-1 {
  top: 10%;
  left: 5%;
  border-right: none;
  border-bottom: none;
}

.corner-accent-2 {
  top: 10%;
  right: 5%;
  border-left: none;
  border-bottom: none;
}

.corner-accent-3 {
  bottom: 20%;
  left: 5%;
  border-right: none;
  border-top: none;
}

.corner-accent-4 {
  bottom: 20%;
  right: 5%;
  border-left: none;
  border-top: none;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

.home-header {
  position: relative;
  z-index: 10;
  padding: 24px 20px;
  padding-top: calc(env(safe-area-inset-top) + 24px);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-text {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 8px;
  color: #000000;
}

.logo-sub {
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}

.search-wrapper {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #333333;
  background: #ffffff;
}

.search-icon {
  color: #cccccc;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #000000;
  outline: none;
}

.search-input::placeholder {
  color: #cccccc;
}

.hero-section {
  position: relative;
  z-index: 10;
  padding: 40px 20px;
  margin-bottom: 30px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.hero-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-title-container {
  position: relative;
  display: inline-block;
}

.hero-title {
  font-size: 42px;
  font-weight: 200;
  color: #000000;
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero-subtitle-small {
  position: absolute;
  right: -10px;
  bottom: -8px;
  font-size: 12px;
  font-weight: 200;
  color: #000000;
  letter-spacing: 1px;
}

.title-line {
  width: 80px;
  height: 1px;
  background: #f5f5f5;
  margin: 16px 0;
}

.hero-subtitle {
  font-size: 16px;
  font-weight: 300;
  color: #666666;
  letter-spacing: 4px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 200;
  color: #000000;
}

.stat-label {
  font-size: 11px;
  color: #999999;
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
}

.category-section {
  position: relative;
  z-index: 10;
  padding: 0 20px;
  margin-bottom: 40px;
}

.section-label {
  font-size: 10px;
  font-weight: 600;
  color: #999999;
  letter-spacing: 3px;
  margin-bottom: 16px;
  display: block;
}

.slash-container {
  position: relative;
  height: 200px;
  background: transparent;
  overflow: visible;
}

.slash-line {
  position: absolute;
  height: 2px;
  background: #cccccc;
}

.slash-1 {
  top: 35px;
  left: -100px;
  width: 500px;
  transform: rotate(-15deg);
}

.slash-3 {
  top: 90px;
  left: -60px;
  width: 480px;
  transform: rotate(-30deg);
}

.slash-5 {
  bottom: 30px;
  left: -70px;
  width: 530px;
  transform: rotate(10deg);
}

.category-items {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.stick-figure-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.stick-figure {
  position: absolute;
  animation: walkAcross 8s linear infinite;
}

.arm-left {
  transform-origin: 20px 16px;
  animation: armSwing 0.4s ease-in-out infinite alternate;
}

.arm-right {
  transform-origin: 20px 16px;
  animation: armSwing 0.4s ease-in-out infinite alternate-reverse;
}

.leg-left {
  transform-origin: 20px 30px;
  animation: legSwing 0.4s ease-in-out infinite alternate;
}

.leg-right {
  transform-origin: 20px 30px;
  animation: legSwing 0.4s ease-in-out infinite alternate-reverse;
}

@keyframes walkAcross {
  0% {
    left: -30px;
    top: 25px;
    transform: scaleX(1);
  }
  15% {
    left: 50px;
    top: 55px;
  }
  30% {
    left: 120px;
    top: 85px;
  }
  45% {
    left: 190px;
    top: 115px;
  }
  55% {
    left: 250px;
    top: 105px;
  }
  70% {
    left: 320px;
    top: 75px;
  }
  85% {
    left: 370px;
    top: 45px;
    transform: scaleX(-1);
  }
  100% {
    left: 450px;
    top: 15px;
    transform: scaleX(-1);
  }
}

@keyframes armSwing {
  0% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(20deg);
  }
}

@keyframes legSwing {
  0% {
    transform: rotate(-25deg);
  }
  100% {
    transform: rotate(25deg);
  }
}

.category-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item span {
  font-size: 15px;
  font-weight: 200;
  color: #000000;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-block;
  line-height: 1.4;
}

.category-item:hover span {
  color: #555555;
  letter-spacing: 1px;
}

.item-1 {
  top: 30px;
  left: 20px;
  transform: rotate(-5deg);
}

.item-1 span {
  font-size: 16px;
}

.item-2 {
  top: 80px;
  left: 80px;
  transform: rotate(-5deg);
}

.item-2 span {
  font-size: 15px;
}

.item-3 {
  top: 130px;
  left: 140px;
  transform: rotate(-5deg);
}

.item-3 span {
  font-size: 15px;
}

.item-4 {
  bottom: 80px;
  right: 60px;
  transform: rotate(5deg);
}

.item-4 span {
  font-size: 15px;
}

.item-5 {
  bottom: 30px;
  right: 0;
  transform: rotate(5deg);
}

.item-5 span {
  font-size: 16px;
}

.goods-section {
  position: relative;
  z-index: 10;
  padding: 0 20px;
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-link {
  font-size: 12px;
  color: #666666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.section-link:hover {
  color: #000000;
}

.goods-container {
  position: relative;
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

.highlight-section {
  position: relative;
  z-index: 10;
  padding: 0 20px;
  margin-bottom: 40px;
}

.highlight-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 16px;
}

.highlight-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.highlight-icon {
  color: #333333;
}

.highlight-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlight-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.highlight-desc {
  font-size: 12px;
  color: #999999;
}

.highlight-btn {
  padding: 10px 24px;
  background: #ffffff;
  color: #000000;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.highlight-btn:hover {
  background: #f0f0f0;
  transform: scale(1.02);
}

.quick-links {
  position: relative;
  z-index: 10;
  padding: 0 20px;
  margin-bottom: 40px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666666;
}

.link-item:hover {
  background: #f0f0f0;
  color: #000000;
  transform: translateY(-2px);
}

.link-item svg {
  width: 24px;
  height: 24px;
}

.link-item span {
  font-size: 11px;
}

.home-footer {
  position: relative;
  z-index: 10;
  padding: 32px 20px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-brand {
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 6px;
  color: #000000;
}

.footer-copyright {
  font-size: 11px;
  color: #cccccc;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.toast.warning {
  background: #f5f5f5;
  color: #333333;
}

.toast.error {
  background: #f5f5f5;
  color: #666666;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>