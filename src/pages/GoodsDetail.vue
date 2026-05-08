<template>
  <div class="detail-page">
    <div class="toast" :class="{ show: showToast, success: toastType === 'success', error: toastType === 'error', warning: toastType === 'warning' }">
      {{ toastText }}
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div class="pay-modal" v-if="showPayModal">
          <div class="modal-overlay" @click="closePayModal"></div>
          <div class="modal-container">
            <div class="pay-header">
              <h3 class="pay-title">安全支付</h3>
              <button class="pay-close" @click="closePayModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="pay-body">
              <div class="pay-price">¥{{ goodsDetail?.price || 0 }}</div>
              <p class="pay-desc">请输入支付密码完成交易</p>
              <input
                v-model="payPwd"
                type="password"
                class="pay-input"
                placeholder="请输入6位支付密码"
                maxlength="6"
              />
            </div>
            <div class="pay-footer">
              <button class="btn btn-secondary" @click="closePayModal">取消</button>
              <button class="btn btn-primary" @click="doPay" :disabled="payPwd.length < 6">确认支付</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <header class="header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-animation">
        <div class="loading-ring"></div>
        <div class="loading-ring delay-1"></div>
        <div class="loading-ring delay-2"></div>
      </div>
      <span>正在加载...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p>商品加载失败</p>
      <button class="retry-btn" @click="getGoodsDetail">重试</button>
    </div>

    <div class="detail-content" v-else-if="goodsDetail">
      <div class="info-card">
        <div class="card-glow-effect"></div>
        <div class="card-decoration"></div>
        <div class="price-row">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ goodsDetail.price }}</span>
          <span class="price-tag">限时优惠</span>
        </div>
        <h1 class="goods-title">{{ goodsDetail.title }}</h1>
        <p class="goods-desc">{{ goodsDetail.desc }}</p>
        <div class="goods-meta">
          <span class="sales-count">已售 {{ goodsDetail.order_num || 0 }} 单</span>
          <span class="rating-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            4.9
          </span>
        </div>
      </div>

      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7Z" stroke="currentColor" stroke-width="2"/>
              <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
          <span class="stat-value">{{ goodsDetail.order_num || 0 }}</span>
          <span class="stat-label">已售</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12L11 15L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="stat-value">100%</span>
          <span class="stat-label">好评率</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="stat-value">24h</span>
          <span class="stat-label">极速完成</span>
        </div>
      </div>

      <div class="content-card">
        <div class="content-header">
          <h3 class="content-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            商品详情
          </h3>
          <div class="content-decoration"></div>
        </div>
        <pre class="content-text">{{ goodsDetail.content }}</pre>
      </div>
    </div>

    <div class="action-bar">
      <div class="action-left">
        <div class="action-info">
          <span class="action-label">实付金额</span>
          <span class="action-price">¥{{ goodsDetail?.price || 0 }}</span>
        </div>
        <button class="contact-service-btn" @click="showContactModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          客服
        </button>
      </div>
      <button class="buy-btn" @click="buyNow" :disabled="submitting">
        <span v-if="!submitting">立即下单</span>
        <span v-else class="btn-loading">
          <span class="spinner"></span>
          处理中...
        </span>
      </button>
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
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="contact-desc">如有商品或订单问题，请联系客服协助处理</p>
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

    <Teleport to="body">
      <Transition name="modal">
        <div class="game-id-modal" v-if="showGameIdModal" @click="closeGameIdBindModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>绑定游戏ID</h3>
              <button class="close-btn" @click="closeGameIdBindModal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">请输入您的游戏ID以便打手接单</p>
              <input
                v-model="gameIdInput"
                type="text"
                class="game-id-input"
                placeholder="请输入游戏ID"
                maxlength="30"
              />
              <p class="error-text" v-if="gameIdError">{{ gameIdError }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeGameIdBindModal">取消</button>
              <button class="btn btn-primary" @click="saveGameIdAndPay">确认并支付</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import { getUserId } from '../utils/user';

const route = useRoute();

const goodsDetail = ref(null);
const loading = ref(true);
const error = ref('');

const showToast = ref(false);
const toastText = ref('');
const toastType = ref('success');
const showMsg = (text, type = 'success', second = 3) => {
  toastText.value = '星屿小筑提醒您：' + text;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => showToast.value = false, second * 1000);
};

const showPayModal = ref(false);
const payPwd = ref('');
const closePayModal = () => { showPayModal.value = false; payPwd.value = ''; };

const showContact = ref(false);
const showContactModal = () => { showContact.value = true; };
const closeContactModal = () => { showContact.value = false; };

const showGameIdModal = ref(false);
const gameIdInput = ref('');
const gameIdError = ref('');
const submitting = ref(false);

const closeGameIdBindModal = () => {
  showGameIdModal.value = false;
  gameIdInput.value = '';
  gameIdError.value = '';
};

const getGoodsDetail = async () => {
  loading.value = true;
  error.value = '';
  try {
    const goodsId = route.params.id;
    const { data, error: fetchError } = await supabase
      .from('goods')
      .select('*')
      .eq('id', goodsId)
      .maybeSingle();

    if (fetchError || !data) {
      throw new Error('商品不存在');
    }

    goodsDetail.value = data;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const copyWechat = () => {
  navigator.clipboard.writeText('18334103941');
  showMsg('已复制到剪贴板', 'success');
  closeContactModal();
};

const checkLogin = () => {
  const uid = getUserId();
  if (!uid) {
    const event = new CustomEvent('show-login-modal', {
      detail: {
        message: '请先登录',
        callback: (confirmed) => {
          if (confirmed) {
            setTimeout(() => window.location.reload(), 500);
          }
        }
      }
    });
    window.dispatchEvent(event);
    return false;
  }
  return true;
};

const checkBalance = async (price) => {
  const uid = getUserId();
  const { data } = await supabase
    .from('user')
    .select('balance')
    .eq('id', uid)
    .maybeSingle();

  if (!data || data.balance < price) {
    showMsg('余额不足，请先充值', 'warning');
    return false;
  }
  return true;
};

const checkPaymentCode = async () => {
  const uid = getUserId();
  const { data } = await supabase
    .from('user')
    .select('payment_code')
    .eq('id', uid)
    .maybeSingle();
  return data?.payment_code != null;
};

const checkGameId = async () => {
  const uid = getUserId();
  const { data } = await supabase
    .from('user')
    .select('game_id')
    .eq('id', uid)
    .maybeSingle();
  return data?.game_id;
};

const buyNow = async () => {
  if (!checkLogin()) return;

  const price = goodsDetail.value.price;
  if (!(await checkBalance(price))) return;

  const hasPwd = await checkPaymentCode();
  if (!hasPwd) {
    showMsg('请先设置支付密码', 'warning');
    return;
  }

  const gameId = await checkGameId();
  if (!gameId) {
    showGameIdModal.value = true;
    return;
  }

  showPayModal.value = true;
};

const saveGameIdAndPay = async () => {
  if (!gameIdInput.value.trim()) {
    gameIdError.value = '请输入游戏ID';
    return;
  }

  const uid = getUserId();
  await supabase
    .from('user')
    .update({ game_id: gameIdInput.value.trim() })
    .eq('id', uid);

  localStorage.setItem('game_id', gameIdInput.value.trim());
  closeGameIdBindModal();
  showPayModal.value = true;
};

const doPay = async () => {
  if (payPwd.value.length !== 6) return;

  submitting.value = true;
  const uid = getUserId();
  const price = goodsDetail.value.price;

  try {
    const { data: user } = await supabase
      .from('user')
      .select('payment_code, balance')
      .eq('id', uid)
      .maybeSingle();

    if (!user || user.payment_code !== payPwd.value) {
      showMsg('支付密码错误', 'error');
      submitting.value = false;
      return;
    }

    await supabase
      .from('user')
      .update({ balance: user.balance - price })
      .eq('id', uid);

    const { data: userData } = await supabase
      .from('user')
      .select('game_id')
      .eq('id', uid)
      .maybeSingle();

    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: uid,
        goods_id: goodsDetail.value.id,
        amount: price,
        status: 1,
        game_id: userData?.game_id || ''
      }]);

    if (orderError) {
      throw orderError;
    }

    showMsg('支付成功！订单已创建', 'success');
    closePayModal();
    setTimeout(() => {
      window.location.href = '/my-orders';
    }, 1500);
  } catch (e) {
    showMsg('支付失败：' + e.message, 'error');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  getGoodsDetail();
});
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  position: relative;
}

.toast {
  position: fixed;
  top: 80px;
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
.toast.warning { border-left: 3px solid #999999; }

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #333333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #eeeeee;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.loading-animation {
  position: relative;
  width: 40px;
  height: 40px;
}

.loading-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #eeeeee;
  border-top-color: #999999;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state span {
  color: #999999;
  font-size: 13px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
}

.error-icon {
  color: #999999;
}

.error-state p {
  color: #666666;
}

.retry-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  color: #333333;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #eeeeee;
}

.detail-content {
  position: relative;
  z-index: 1;
  padding: 70px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 8px;
}

.price-symbol {
  font-size: 16px;
  font-weight: 200;
  color: #333333;
}

.price-value {
  font-size: 32px;
  font-weight: 200;
  color: #333333;
  line-height: 1;
}

.price-tag {
  padding: 3px 8px;
  background: #f0f0f0;
  color: #666666;
  font-size: 10px;
  border-radius: 4px;
  margin-left: 8px;
}

.goods-title {
  font-size: 18px;
  font-weight: 300;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.goods-desc {
  font-size: 13px;
  color: #666666;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.goods-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sales-count {
  font-size: 11px;
  color: #999999;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #666666;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-icon {
  color: #999999;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 16px;
  font-weight: 300;
  color: #333333;
}

.stat-label {
  font-size: 10px;
  color: #999999;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #e0e0e0;
}

.content-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.content-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 300;
  color: #333333;
}

.content-decoration {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.content-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 0;
  font-family: inherit;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #eeeeee;
  z-index: 100;
}

.action-left {
  flex: 1;
}

.action-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-label {
  font-size: 10px;
  color: #999999;
}

.action-price {
  font-size: 22px;
  font-weight: 200;
  color: #333333;
}

.contact-service-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #dddddd;
  border-radius: 20px;
  color: #666666;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-service-btn:hover {
  border-color: #999999;
  color: #333333;
}

.buy-btn {
  flex-shrink: 0;
  padding: 14px 28px;
  background: #f5f5f5;
  color: #333333;
  font-size: 14px;
  font-weight: 300;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.buy-btn:hover:not(:disabled) {
  background: #555555;
}

.buy-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 6px;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.pay-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.pay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.pay-title {
  font-size: 15px;
  font-weight: 300;
  color: #333333;
}

.pay-close {
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

.pay-close:hover {
  color: #333333;
  background: #eeeeee;
}

.pay-body {
  padding: 20px;
  text-align: center;
}

.pay-price {
  font-size: 32px;
  font-weight: 200;
  color: #333333;
  margin-bottom: 6px;
}

.pay-desc {
  font-size: 12px;
  color: #999999;
  margin-bottom: 16px;
}

.pay-input {
  width: 100%;
  padding: 14px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  letter-spacing: 4px;
  transition: all 0.2s ease;
}

.pay-input:focus {
  outline: none;
  border-color: #999999;
  background: #ffffff;
}

.pay-footer {
  display: flex;
  gap: 10px;
  padding: 0 16px 16px;
}

.pay-footer .btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 300;
  font-size: 13px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #f5f5f5;
  color: #333333;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: #555555;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666666;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #eeeeee;
}

.contact-modal,
.game-id-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
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
  color: #333333;
  background: #eeeeee;
}

.modal-body {
  padding: 20px;
}

.contact-icon {
  text-align: center;
  color: #999999;
  margin-bottom: 12px;
}

.contact-desc {
  font-size: 12px;
  color: #666666;
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.6;
}

.wechat-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  font-size: 16px;
  font-weight: 300;
  color: #333333;
  font-family: monospace;
}

.copy-btn {
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  color: #333333;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #555555;
}

.modal-desc {
  font-size: 13px;
  color: #666666;
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.6;
}

.game-id-input {
  width: 100%;
  padding: 14px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  transition: all 0.2s ease;
}

.game-id-input:focus {
  outline: none;
  border-color: #999999;
  background: #ffffff;
}

.error-text {
  margin-top: 6px;
  font-size: 11px;
  color: #999999;
  text-align: left;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 0 16px 16px;
}

.modal-footer .btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 300;
  font-size: 13px;
  transition: all 0.2s ease;
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
