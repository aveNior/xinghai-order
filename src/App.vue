<template>
  <div class="app-container">
    <div class="page-content">
      <router-view />
    </div>

    <nav class="tab-bar" v-if="!isGoodsDetail && !isLoginPage">
      <div
        class="tab-item"
        @click="$router.push('/home')"
        :class="{ active: $route.path === '/home' }"
      >
        <span class="tab-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="tab-text">首页</span>
        <span class="tab-glow" v-if="$route.path === '/home'"></span>
      </div>
      <div
        class="tab-item"
        @click="$router.push('/my')"
        :class="{ active: $route.path === '/my' }"
      >
        <span class="tab-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="tab-text">我的</span>
        <span class="tab-glow" v-if="$route.path === '/my'"></span>
      </div>
    </nav>

    <Teleport to="body">
      <Transition name="modal">
        <div class="login-modal" v-if="showLoginModal">
          <div class="modal-overlay" @click="handleCancel"></div>
          <div class="modal-container">
            <div class="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--primary-color)" stroke-width="2"/>
                <path d="M12 8V12" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="1" fill="var(--primary-color)"/>
              </svg>
            </div>
            <h3 class="modal-title">提示</h3>
            <p class="modal-message">{{ modalMessage }}</p>
            <div class="modal-actions">
              <button class="btn btn-secondary" @click="handleCancel">取消</button>
              <button class="btn btn-primary" @click="handleConfirm">去登录</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.meta.title,
  (newTitle) => {
    if (newTitle) {
      document.title = newTitle
    }
  },
  { immediate: true }
)

const isGoodsDetail = computed(() => {
  return route.path.startsWith('/goods/') || route.path === '/goods/detail'
})

const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/'
})

const showLoginModal = ref(false)
const modalMessage = ref('')
let modalCallback = null

const handleLoginModalEvent = (e) => {
  const { message, callback } = e.detail || {}
  modalMessage.value = message || '您还未登录，是否前往登录？'
  modalCallback = callback
  showLoginModal.value = true
}

const handleConfirm = () => {
  showLoginModal.value = false
  if (modalCallback) {
    modalCallback(true)
  }
}

const handleCancel = () => {
  showLoginModal.value = false
  if (modalCallback) {
    modalCallback(false)
  }
}

onMounted(() => {
  window.addEventListener('show-login-modal', handleLoginModalEvent)
})

onUnmounted(() => {
  window.removeEventListener('show-login-modal', handleLoginModalEvent)
})
</script>

<style scoped>
.app-container {
  width: 100vw;
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

.page-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #eeeeee;
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  z-index: var(--z-tab-bar);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: #999999;
}

.tab-item.active {
  color: #333333;
}

.tab-item.active .tab-icon {
  transform: scale(1.08);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all var(--transition-fast);
}

.tab-text {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

.tab-glow {
  position: absolute;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: #333333;
  border-radius: 1px 1px 0 0;
}

.login-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 340px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  animation: scaleIn var(--transition-normal) ease;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.modal-icon {
  margin-bottom: var(--space-lg);
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.modal-message {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
}

.modal-actions .btn {
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
