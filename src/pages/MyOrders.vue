<template>
  <div class="orders-page">
    <div class="toast" :class="{ show: showToast, success: toastType === 'success', error: toastType === 'error' }">
      {{ toastText }}
    </div>

    <div class="header">
      <div class="back" @click="$router.back()">← 返回</div>
      <h2 class="title">我的订单</h2>
    </div>

    <div class="loading" v-if="loading">加载中...</div>

    <div class="empty" v-else-if="orders.length === 0">
      <p>暂无订单</p>
    </div>

    <div class="order-list" v-else>
      <div class="order-card" v-for="item in orders" :key="item.id">
        <div class="card-top">
          <div class="goods-name">{{ item.title }}</div>
          <div class="price">¥{{ item.price }}</div>
        </div>

        <div class="status" :class="getStatusClass(item.status)">
          {{ item.status }}
        </div>

        <div class="info-row" v-if="item.handler_id">
          <span>接单打手：</span>
          <span>{{ item.handler_id }}</span>
        </div>

        <div class="info-row transfer" v-if="item.transfer_to_id">
          <span>转单至：</span>
          <span>{{ item.transfer_to_id }}</span>
        </div>

        <div class="info-row finished" v-if="item.status === '已结单' && item.finished_at">
          <span>结单时间：</span>
          <span>{{ formatTime(item.finished_at) }}</span>
        </div>

        <div class="card-bottom">
          <span>下单时间</span>
          <span>{{ formatTime(item.created_at) }}</span>
        </div>

        <div class="contact-row" v-if="item.status === '待接取' || item.status === '接取中'">
          <button class="contact-btn" @click="showContactModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92V19.92C22 20.48 21.79 21.04 21.42 21.42C21.05 21.79 20.48 22 19.92 22H6.92C5.62 22 4.39 21.47 3.46 20.54C2.54 19.61 2 18.38 2 17.08V7.08C2 5.78 2.54 4.55 3.46 3.62C4.39 2.69 5.62 2.16 6.92 2.16H9.92" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.08 5.08L18.92 8.92" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12H8.92" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 16H8.92" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 8H8.92" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            联系客服
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div class="contact-modal" v-if="showContact" @click="closeContactModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>联系客服</h3>
              <button class="close-btn" @click="closeContactModal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="contact-desc">如有订单问题，请联系客服协助处理</p>
              <div class="wechat-box">
                <span class="wechat-label">客服微信</span>
                <span class="wechat-value">18334103941</span>
              </div>
              <button class="copy-btn" @click="copyWechat">复制客服微信</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { getUserId } from '../utils/user'

const orders = ref([])
const loading = ref(true)
const showContact = ref(false)
const showToast = ref(false)
const toastText = ref('')
const toastType = ref('success')

const showMsg = (text, type = 'success', second = 3) => {
  toastText.value = '星屿小筑提醒您：' + text
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, second * 1000)
}

const showContactModal = () => { showContact.value = true }
const closeContactModal = () => { showContact.value = false }

const copyWechat = () => {
  navigator.clipboard.writeText('18334103941').then(() => {
    showMsg('客服微信已复制到剪贴板', 'success')
    closeContactModal()
  }).catch(() => {
    showMsg('复制失败，请手动复制', 'error')
  })
}

const getOrders = async () => {
  const user_id = getUserId()
  if (!user_id) return
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  loading.value = false
  if (!error) orders.value = data
}

const getStatusClass = (status) => {
  if (status === '待接取') return 'wait'
  if (status === '接取中') return 'ing'
  if (status === '已结单') return 'done'
  if (status === '转单中') return 'transfer'
  return ''
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

onMounted(() => {
  const uid = getUserId()
  if (!uid) return
  getOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 12px;
  background: #ffffff;
  min-height: 100vh;
}

.toast {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 12px 24px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  border-radius: 8px;
  z-index: 300;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  max-width: 85%;
  text-align: center;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.toast.success { border-left: 3px solid #999999; }
.toast.error { border-left: 3px solid #999999; }

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px 0;
}

.back {
  font-size: 14px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  color: #666666;
  transition: all 0.2s ease;
}

.back:hover {
  background: #eeeeee;
}

.title {
  margin-left: 12px;
  font-size: 17px;
  font-weight: 300;
  color: #1a1a1a;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #999999;
  font-size: 13px;
}

.empty {
  text-align: center;
  padding: 80px 0;
  color: #999999;
}
.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.goodsName {
  font-size: 15px;
  font-weight: 300;
  color: #1a1a1a;
}

.price {
  font-size: 16px;
  font-weight: 300;
  color: #333333;
}

.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 10px;
}

.status.wait { background: #f5f5f5; color: #666666; }
.status.ing { background: #f0f0f0; color: #333333; }
.status.done { background: #f0f0f0; color: #333333; }
.status.transfer { background: #f5f5f5; color: #666666; }

.info-row {
  font-size: 12px;
  color: #666666;
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
}

.card-bottom {
  margin-top: 10px;
  font-size: 11px;
  color: #999999;
  display: flex;
  justify-content: space-between;
}

.contact-row {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-btn:hover {
  background: #eeeeee;
}

.contact-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.modal-header h3 {
  font-size: 15px;
  font-weight: 300;
  color: #333333;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #999999;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #eeeeee;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.contact-icon {
  margin-bottom: 12px;
  color: #999999;
}

.contact-desc {
  font-size: 13px;
  color: #666666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.wechat-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.wechat-label {
  font-size: 12px;
  color: #666666;
}

.wechat-value {
  font-size: 15px;
  font-weight: 300;
  color: #333333;
  font-family: monospace;
}

.copy-btn {
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #555555;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
