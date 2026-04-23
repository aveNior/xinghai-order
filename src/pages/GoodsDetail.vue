<template>
  <div class="detail-page">
    <!-- 提示框 -->
    <div class="toast" v-show="showToast" :class="showToast ? 'show' : ''">
      {{ toastText }}
    </div>

    <!-- 微信支付密码弹窗 -->
    <div class="pay-modal" v-show="showPayModal">
      <div class="pay-modal-mask" @click="closePayModal"></div>
      <div class="pay-modal-box">
        <div class="pay-title">微信安全支付</div>
        <div class="pay-price">¥{{ goodsDetail?.value?.price || 0 }}</div>
        <div class="pay-desc">请输入支付密码完成交易</div>

        <input 
          v-model="payPwd" 
          type="password" 
          class="pay-input" 
          placeholder="请输入6位支付密码"
          maxlength="6"
        />

        <div class="pay-btns">
          <button class="btn cancel" @click="closePayModal">取消</button>
          <button class="btn confirm" @click="doPay" :disabled="payPwd.length < 6">确认支付</button>
        </div>
      </div>
    </div>

    <!-- 顶部返回 -->
    <div class="back-btn" @click="$router.back()">← 返回</div>

    <!-- 商品详情 -->
    <div v-if="loading" class="loading-tip">正在加载商品详情...</div>
    <div v-if="error" class="error-tip">商品加载失败，请返回重试</div>
    
    <div class="detail-box" v-if="goodsDetail">
      <img :src="goodsDetail.cover_img" class="detail-cover" :alt="goodsDetail.title" />
      <div class="detail-info">
        <h1 class="goods-title">{{ goodsDetail.title }}</h1>
        <div class="goods-price">¥ {{ goodsDetail.price }}</div>
        <div class="goods-desc">{{ goodsDetail.desc }}</div>
        <div class="goods-content">
          <h3>商品详情</h3>
          <pre class="preserve-space">{{ goodsDetail.content }}</pre>
        </div>
      </div>
      <button class="buy-btn" @click="buyNow" :disabled="submitting">
        {{ submitting ? '提交中...' : '立即下单' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getUserId } from '../utils/user'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const goodsId = route.params.id
const goodsDetail = ref(null)
const loading = ref(false)
const error = ref(false)
const submitting = ref(false)

// 提示
const showToast = ref(false)
const toastText = ref('')
const showMsg = (text) => {
  toastText.value = text
  showToast.value = true
  setTimeout(() => showToast.value = false, 2200)
}

// 支付弹窗
const showPayModal = ref(false)
const payPwd = ref('')
const userBalance = ref(0)

// 获取用户信息
const getUserInfo = async () => {
  const userId = getUserId()
  const { data } = await supabase
    .from('users')
    .select('balance, payment_code')
    .eq('user_id', userId)
    .maybeSingle()
  
  if (data) {
    userBalance.value = data.balance || 0
    return data
  }
  return null
}

// 立即下单
const buyNow = async () => {
  if (!goodsDetail.value) return
  submitting.value = true

  const user = await getUserInfo()
  const balance = user?.balance || 0
  const price = goodsDetail.value.price || 0

  if (balance < price) {
    showMsg('余额不足，请前往我的页面充值')
    submitting.value = false
    return
  }

  if (!user?.payment_code) {
    showMsg('请先前往我的页面设置支付密码')
    submitting.value = false
    return
  }

  showPayModal.value = true
  submitting.value = false
}

// 关闭弹窗
const closePayModal = () => {
  showPayModal.value = false
  payPwd.value = ''
}

// ====================== 支付验证（修复版）======================
const doPay = async () => {
  const userId = getUserId()
  const price = goodsDetail.value.price

  // 1. 查询真实密码
  const { data } = await supabase
    .from('users')
    .select('payment_code, balance')
    .eq('user_id', userId)
    .single()

  if (!data || !data.payment_code) {
    showMsg('请先设置支付密码')
    return
  }

  // ---------------- 关键修复：自动去空格 ----------------
  const realPwd = String(data.payment_code).trim()
  const inputPwd = String(payPwd.value).trim()

  console.log('当前用户ID：', userId)
  console.log('数据库真实密码：[' + realPwd + ']')
  console.log('你输入的密码：[' + inputPwd + ']')

  // 2. 验证
  if (inputPwd !== realPwd) {
    showMsg('支付密码错误')
    return
  }

  // 3. 扣款
  submitting.value = true
  await supabase
    .from('users')
    .update({ balance: data.balance - price })
    .eq('user_id', userId)

  // 4. 下单
  await supabase.from('orders').insert([{
    goods_id: goodsDetail.value.id,
    title: goodsDetail.value.title,
    price: price,
    user_id: userId,
    status: '待接取',
    created_at: new Date()
  }])

  submitting.value = false
  closePayModal()
  showMsg('✅ 支付成功')
}

// 获取商品
const getGoodsDetail = async () => {
  loading.value = true
  const { data, error: err } = await supabase
    .from('goods')
    .select('*')
    .eq('id', goodsId)
    .single()

  loading.value = false
  if (err) { error.value = true; return }
  goodsDetail.value = data
}

onMounted(() => {
  if (goodsId) getGoodsDetail()
})
</script>

<style scoped>
.detail-page {
  padding: 15px;
  padding-bottom: 80px;
  min-height: 100vh;
  background: #ffe8df;
  position: relative;
}

/* 提示框 */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: #fff;
  color: #ff753a;
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 15px;
  z-index: 9999;
  box-shadow: 0 6px 20px rgba(255,117,58,0.15);
  border: 1px solid #ffd1b8;
  opacity: 0;
  transition: all 0.3s ease;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 支付弹窗 */
.pay-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.pay-modal-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
.pay-modal-box {
  width: 85%;
  max-width: 330px;
  background: #fff;
  border-radius: 20px;
  padding: 30px 24px;
  position: relative;
  z-index: 10;
}
.pay-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
.pay-price {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #ff753a;
  margin-bottom: 8px;
}
.pay-desc {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}
.pay-input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
  outline: none;
}
.pay-input:focus {
  border-color: #ff753a;
}
.pay-btns {
  display: flex;
  gap: 12px;
}
.btn {
  flex: 1;
  padding: 14px 0;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  cursor: pointer;
}
.btn.cancel {
  background: #f1f1f1;
  color: #666;
}
.btn.confirm {
  background: #ff753a;
  color: #fff;
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 返回按钮 */
.back-btn {
  position: sticky;
  top: 10px;
  z-index: 10;
  width: 60px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  background: #fff;
  border: 1px solid #ffd1b8;
  border-radius: 25px;
  color: #ff753a;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}
.back-btn:hover {
  background: #ff753a;
  color: white;
}

/* 商品样式 */
.detail-cover {
  width: 100%;
  border-radius: 12px;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}
.detail-info {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}
.goods-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}
.goods-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff753a;
  margin-bottom: 15px;
}
.goods-desc {
  font-size: 15px;
  color: #666;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.goods-content {
  margin-top: 20px;
}
.goods-content h3 {
  color: #ff753a;
  font-weight: bold;
}

/* 下单按钮 */
.buy-btn {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 50px;
  border: none;
  border-radius: 25px;
  background: #ff753a;
  color: white;
  font-size: 17px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255,117,58,0.3);
}
.buy-btn:disabled {
  background: #ccc;
}

.loading-tip, .error-tip {
  text-align: center;
  padding: 40px 0;
  color: #666;
}
</style>