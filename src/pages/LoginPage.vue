<template>
  <div class="login-page">
    <div class="dynamic-background">
      <div class="rotating-container rotating-container-1">
        <div class="orbit orbit-1"></div>
        <div class="orbit orbit-2"></div>
        <div class="orbit orbit-3"></div>
      </div>
      <div class="rotating-container rotating-container-2">
        <div class="orbit orbit-4"></div>
        <div class="orbit orbit-5"></div>
        <div class="orbit orbit-6"></div>
      </div>
      <div class="floating-lines">
        <div class="float-line float-line-1"></div>
        <div class="float-line float-line-2"></div>
        <div class="float-line float-line-3"></div>
        <div class="float-line float-line-4"></div>
      </div>
      <div class="corner-accents">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
      </div>
    </div>

    <div class="toast" :class="{ show: showToast, success: toastType === 'success', error: toastType === 'error' }">
      {{ toastText }}
    </div>

    <div class="login-content">
      <div class="card">
        <div class="card-frame">
          <div class="frame-line frame-top"></div>
          <div class="frame-line frame-right"></div>
          <div class="frame-line frame-bottom"></div>
          <div class="frame-line frame-left"></div>
        </div>
        
        <div class="card-content">
          <div class="logo-section">
              <h1 class="title">XINGYU</h1>
              <p class="subtitle">星屿小筑</p>
            </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <div class="input-container">
                <input
                  v-model="phone"
                  type="tel"
                  class="form-input"
                  placeholder="手机号码"
                  maxlength="11"
                  :class="{ error: phoneError }"
                />
                <div class="input-line"></div>
                <div class="input-focus-line"></div>
              </div>
              <p class="error-text" v-if="phoneError">{{ phoneError }}</p>
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              <span class="btn-text">登录</span>
              <span class="btn-line"></span>
            </button>
          </form>
          
          <!-- 微信登录按钮 -->
          <div class="wechat-login-wrapper">
            <div class="divider">
              <span>OR</span>
            </div>
            <button class="wechat-login-btn" @click="wechatAuth" :disabled="loading">
              <svg class="wechat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#d0d0d0" stroke-width="1.5"/>
                <path d="M8 11h3v4H8v-4zm6 0h3v4h-3v-4z" fill="#666666"/>
              </svg>
              <span class="wechat-btn-text">微信一键登录</span>
              <span class="wechat-btn-line"></span>
            </button>
          </div>

          <div class="card-footer">
            <button class="register-btn" @click="showRegister = true">
              <span>注册新账户</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div class="register-modal" v-if="showRegister" @click="closeRegister">
          <div class="register-content" @click.stop>
            <div class="register-decoration">
              <div class="rotating-lines rotating-lines-1">
                <div class="rot-line rot-line-1"></div>
                <div class="rot-line rot-line-2"></div>
                <div class="rot-line rot-line-3"></div>
              </div>
              <div class="rotating-lines rotating-lines-2">
                <div class="rot-line rot-line-4"></div>
                <div class="rot-line rot-line-5"></div>
                <div class="rot-line rot-line-6"></div>
              </div>
              <div class="decor-line decor-line-1"></div>
              <div class="decor-line decor-line-2"></div>
              <div class="decor-line decor-line-3"></div>
              <div class="decor-circle decor-circle-1"></div>
              <div class="decor-circle decor-circle-2"></div>
              <div class="corner-tri corner-top-left"></div>
              <div class="corner-tri corner-bottom-right"></div>
            </div>
            <div class="register-header">
              <span class="register-title">JOIN</span>
              <button class="register-close" @click="closeRegister">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1"/>
                </svg>
              </button>
            </div>
            <div class="register-form">
              <div class="register-input-wrapper">
                <span class="input-label">PHONE</span>
                <input
                  v-model="registerPhone"
                  type="tel"
                  class="register-input"
                  placeholder="请输入手机号码"
                  maxlength="11"
                />
                <div class="input-bar"></div>
              </div>
              <div class="register-input-wrapper">
                <span class="input-label">NICKNAME</span>
                <input
                  v-model="registerNickname"
                  type="text"
                  class="register-input"
                  placeholder="输入昵称（可选）"
                  maxlength="12"
                />
                <div class="input-bar"></div>
              </div>
            </div>
            <div class="register-actions">
              <button class="register-btn-cancel" @click="closeRegister">
                <span>返回</span>
              </button>
              <button class="register-btn-submit" @click="handleRegister">
                <span>注册</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div class="game-id-modal" v-if="showGameIdModal" @click="closeGameIdModal">
          <div class="game-id-background">
            <div class="game-id-orbit-container game-id-orbit-container-1">
              <div class="orbit-line orbit-line-1"></div>
              <div class="orbit-line orbit-line-2"></div>
              <div class="orbit-line orbit-line-3"></div>
            </div>
            <div class="game-id-orbit-container game-id-orbit-container-2">
              <div class="orbit-line orbit-line-4"></div>
              <div class="orbit-line orbit-line-5"></div>
              <div class="orbit-line orbit-line-6"></div>
            </div>
            <div class="game-id-floating-dots">
              <div class="float-dot float-dot-1"></div>
              <div class="float-dot float-dot-2"></div>
              <div class="float-dot float-dot-3"></div>
              <div class="float-dot float-dot-4"></div>
              <div class="float-dot float-dot-5"></div>
            </div>
          </div>
          <div class="game-id-content" @click.stop>
            <div class="game-id-header">
              <span class="game-id-title">GAME ID</span>
              <button class="game-id-close" @click="closeGameIdModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1"/>
                </svg>
              </button>
            </div>
            <div class="game-id-form">
              <div class="game-id-input-wrapper">
                <span class="input-label">ID</span>
                <input
                  v-model="gameIdInput"
                  type="text"
                  class="game-id-input"
                  placeholder="请输入游戏ID"
                  maxlength="30"
                />
                <div class="input-bar"></div>
              </div>
              <p class="game-id-error" v-if="gameIdError">{{ gameIdError }}</p>
            </div>
            <div class="game-id-actions">
              <button class="game-id-btn-cancel" @click="closeGameIdModal">返回</button>
              <button class="game-id-btn-submit" @click="saveGameId">
                <span>确认</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const router = useRouter();

const TABLE_NAME = 'user';
const API_BASE_URL = '/api';

const phone = ref('');
const phoneError = ref('');
const loading = ref(false);
const showRegister = ref(false);
const registerPhone = ref('');
const registerNickname = ref('');

const showGameIdModal = ref(false);
const gameIdInput = ref('');
const gameIdError = ref('');
let pendingUserId = null;
let pendingUserInfo = null;

const showToast = ref(false);
const toastText = ref('');
const toastType = ref('success');
const showMsg = (text, type = 'success', second = 3) => {
  toastText.value = '星屿小筑提醒您：' + text;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => showToast.value = false, second * 1000);
};

// ==================== 微信授权相关 ====================

// 检查是否是微信浏览器
const isWechat = () => {
  return /micromessenger/i.test(navigator.userAgent);
};

// 发起微信授权
const wechatAuth = async () => {
  try {
    loading.value = true;
    
    // 获取当前页面 URL 作为回调地址
    const redirectUri = window.location.href.split('?')[0];
    
    const response = await fetch(`${API_BASE_URL}/wechat/auth?redirect_uri=${encodeURIComponent(redirectUri)}`);
    const result = await response.json();
    
    if (result.success) {
      // 跳转到微信授权页面
      window.location.href = result.auth_url;
    } else {
      showMsg(result.message || '获取授权链接失败', 'error');
    }
  } catch (error) {
    console.error('微信授权失败:', error);
    showMsg('微信授权失败', 'error');
  } finally {
    loading.value = false;
  }
};

// 处理微信回调
const handleWechatCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (!code) return;
  
  try {
    loading.value = true;
    
    const response = await fetch(`${API_BASE_URL}/wechat/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // 清除 URL 中的 code 参数
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, '', url.toString());
      
      // 保存用户信息
      localStorage.setItem('user_id', result.user_id);
      localStorage.setItem('wx_openid', result.openid);
      localStorage.setItem('is_logged_in', 'true');
      
      // 获取用户详情
      const { data: userInfo } = await supabase
        .from('user')
        .select('user_name, game_id')
        .eq('id', result.user_id)
        .maybeSingle();
        
      if (userInfo?.user_name) {
        localStorage.setItem('user_name', userInfo.user_name);
      }
      if (userInfo?.game_id) {
        localStorage.setItem('game_id', userInfo.game_id);
        showMsg('登录成功', 'success');
        setTimeout(() => router.push('/home'), 500);
      } else {
        // 需要绑定游戏 ID
        pendingUserId.value = result.user_id;
        showGameIdModal.value = true;
      }
    } else {
      showMsg(result.message || '微信登录失败', 'error');
    }
  } catch (error) {
    console.error('处理微信回调失败:', error);
    showMsg('处理微信回调失败', 'error');
  } finally {
    loading.value = false;
  }
};

// 页面加载时检查是否有微信回调
onMounted(() => {
  if (isWechat()) {
    handleWechatCallback();
  }
});

const validatePhone = () => {
  phoneError.value = '';
  if (!phone.value) {
    phoneError.value = '请输入手机号';
    return false;
  }
  if (phone.value.length !== 11) {
    phoneError.value = '请输入11位手机号';
    return false;
  }
  const regex = /^1[3-9]\d{9}$/;
  if (!regex.test(phone.value)) {
    phoneError.value = '请输入正确的手机号格式';
    return false;
  }
  return true;
};

const generateDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

const closeRegister = () => {
  showRegister.value = false;
  registerPhone.value = '';
  registerNickname.value = '';
};

const closeGameIdModal = () => {
  showGameIdModal.value = false;
  gameIdInput.value = '';
  gameIdError.value = '';
};

const handleLogin = async () => {
  if (!validatePhone()) return;

  loading.value = true;
  const deviceId = generateDeviceId();

  try {
    const { data: phoneUser } = await supabase
      .from(TABLE_NAME)
      .select('id, user_name, game_id, device_id')
      .eq('phone', phone.value)
      .maybeSingle();

    if (!phoneUser) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('game_id');
      localStorage.removeItem('is_logged_in');
      return showMsg('未找到账号，请先注册', 'error');
    }

    await supabase
      .from(TABLE_NAME)
      .update({ device_id: deviceId })
      .eq('id', phoneUser.id);

    localStorage.setItem('user_id', phoneUser.id);
    localStorage.setItem('user_name', phoneUser.user_name || '');
    localStorage.setItem('is_logged_in', 'true');
    
    if (phoneUser.game_id) {
      localStorage.setItem('game_id', phoneUser.game_id);
      showMsg('登录成功', 'success');
      setTimeout(() => router.push('/home'), 500);
    } else {
      pendingUserId = phoneUser.id;
      showGameIdModal.value = true;
    }
  } catch (e) {
    showMsg('登录失败，请重试', 'error');
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerPhone.value || registerPhone.value.length !== 11) {
    loading.value = false;
    closeRegister();
    return showMsg('请输入正确的手机号', 'error');
  }
  
  loading.value = true;
  const nickname = registerNickname.value.trim() || '用户' + Date.now().toString().slice(-6);
  const deviceId = generateDeviceId();

  try {
    const { data: existing, error: queryError } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('phone', registerPhone.value)
      .maybeSingle();

    if (queryError) {
      throw new Error(queryError.message);
    }

    if (existing) {
      closeRegister();
      loading.value = false;
      return showMsg('小筑提醒您：该用户已经存在，请返回登录哦', 'error');
    }

    pendingUserInfo = {
      phone: registerPhone.value,
      password: '',
      user_name: nickname,
      device_id: deviceId,
      balance: 0
    };
    
    closeRegister();
    showGameIdModal.value = true;
    loading.value = false;
  } catch (e) {
    loading.value = false;
    showMsg('注册失败：' + e.message, 'error');
  }
};

const saveGameId = async () => {
  if (!gameIdInput.value.trim()) {
    gameIdError.value = '请输入游戏ID';
    return;
  }

  try {
    if (pendingUserInfo) {
      const { data: newUser } = await supabase
        .from(TABLE_NAME)
        .insert([{
          ...pendingUserInfo,
          game_id: gameIdInput.value.trim()
        }])
        .select()
        .single();

      localStorage.setItem('user_id', newUser.id);
      localStorage.setItem('user_name', newUser.user_name);
      localStorage.setItem('game_id', gameIdInput.value.trim());
      localStorage.setItem('is_logged_in', 'true');
      
      showMsg('注册成功', 'success');
      pendingUserInfo = null;
    } else if (pendingUserId) {
      await supabase
        .from(TABLE_NAME)
        .update({ game_id: gameIdInput.value.trim() })
        .eq('id', pendingUserId);

      localStorage.setItem('game_id', gameIdInput.value.trim());
      localStorage.setItem('is_logged_in', 'true');
      
      showMsg('游戏ID绑定成功', 'success');
    }
    
    closeGameIdModal();
    pendingUserId = null;
    setTimeout(() => router.push('/home'), 500);
  } catch (e) {
    showMsg('操作失败：' + e.message, 'error');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.dynamic-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.rotating-container {
  position: absolute;
  inset: -50%;
  animation: rotate 30s linear infinite;
}

.rotating-container-2 {
  animation-direction: reverse;
  animation-duration: 45s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.orbit {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 50%;
}

.orbit-1 {
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
}

.orbit-2 {
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
}

.orbit-3 {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
}

.orbit-4 {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.orbit-5 {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
}

.orbit-6 {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
}

.floating-lines {
  position: absolute;
  inset: 0;
}

.float-line {
  position: absolute;
  background: #f5f5f5;
  opacity: 0.04;
  height: 1px;
  animation: floatLine 20s ease-in-out infinite;
}

.float-line-1 {
  width: 300px;
  top: 20%;
  left: -100px;
  transform: rotate(30deg);
  animation-delay: 0s;
}

.float-line-2 {
  width: 200px;
  top: 50%;
  right: -50px;
  transform: rotate(-45deg);
  animation-delay: -5s;
}

.float-line-3 {
  width: 250px;
  top: 70%;
  left: -70px;
  transform: rotate(15deg);
  animation-delay: -10s;
}

.float-line-4 {
  width: 180px;
  top: 35%;
  right: -80px;
  transform: rotate(-30deg);
  animation-delay: -15s;
}

@keyframes floatLine {
  0%, 100% {
    transform: translateX(0) translateY(0);
    opacity: 0.04;
  }
  25% {
    transform: translateX(50px) translateY(-30px);
    opacity: 0.08;
  }
  50% {
    transform: translateX(100px) translateY(0);
    opacity: 0.04;
  }
  75% {
    transform: translateX(50px) translateY(30px);
    opacity: 0.02;
  }
}

.corner-accents {
  position: absolute;
  inset: 20px;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.corner-tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 14px 24px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 500;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
  max-width: 85%;
  text-align: center;
  line-height: 1.5;
  border: 1px solid #e0e0e0;
}

.toast.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  pointer-events: auto;
}

.toast.success {
  border-left: 3px solid #666666;
}

.toast.error {
  border-left: 3px solid #888888;
}

.login-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 360px;
}

.card {
  position: relative;
  padding: 40px 32px;
}

.card-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.frame-line {
  position: absolute;
  background: #e0e0e0;
}

.frame-top {
  top: 0;
  left: 20px;
  right: 20px;
  height: 1px;
}

.frame-right {
  top: 20px;
  right: 0;
  bottom: 20px;
  width: 1px;
}

.frame-bottom {
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
}

.frame-left {
  top: 20px;
  left: 0;
  bottom: 20px;
  width: 1px;
}

.card-content {
  position: relative;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 24px;
  font-weight: 300;
  color: #000000;
  letter-spacing: 8px;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #999999;
  letter-spacing: 4px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-container {
  position: relative;
  width: 280px;
  margin: 0 auto;
}

.form-input {
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  font-size: 18px;
  color: #000000;
  outline: none;
  padding: 0;
  text-align: center;
  letter-spacing: 2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-input::placeholder {
  color: #cccccc;
}

.form-input.error {
  color: #999999;
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.input-focus-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: #e0e0e0;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.input-container:focus-within .input-focus-line {
  width: 100%;
}

.error-text {
  font-size: 12px;
  color: #999999;
  margin: 0;
}

.login-btn {
  position: relative;
  height: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.btn-text {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  letter-spacing: 4px;
}

.btn-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #e0e0e0;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.login-btn:hover .btn-line {
  width: 100%;
}

.login-btn:active {
  opacity: 0.7;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 微信登录相关样式 */
.wechat-login-wrapper {
  margin-top: 32px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #cccccc;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 2px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e8e8e8;
}

.divider span {
  padding: 0 20px;
  text-transform: uppercase;
}

.wechat-login-btn {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.wechat-icon {
  width: 18px;
  height: 18px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.wechat-login-btn:hover .wechat-icon {
  opacity: 0.9;
}

.wechat-btn-text {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.wechat-login-btn:hover .wechat-btn-text {
  color: #333333;
}

.wechat-btn-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: #e0e0e0;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.wechat-login-btn:hover .wechat-btn-line {
  width: 60px;
}

.wechat-login-btn:active {
  opacity: 0.7;
}

.wechat-login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-footer {
  margin-top: 32px;
  text-align: center;
}

.register-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn:hover {
  color: #000000;
  gap: 12px;
}

.register-modal,
.game-id-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 340px;
  background: #ffffff;
  padding: 32px;
}

.modal-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #999999;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #000000;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-desc {
  font-size: 14px;
  color: #666666;
  text-align: center;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 14px;
  border-radius: 0;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #f5f5f5;
  color: #333333;
}

.btn-primary:hover {
  background: #f5f5f5;
}

.register-content {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 48px 32px;
  background: #ffffff;
  overflow: hidden;
}

.register-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rotating-lines {
  position: absolute;
  inset: -50%;
  animation: rotate 25s linear infinite;
}

.rotating-lines-2 {
  animation-direction: reverse;
  animation-duration: 35s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rot-line {
  position: absolute;
  background: #e0e0e0;
  opacity: 0.5;
  height: 1px;
}

.rot-line-1 {
  width: 180px;
  top: 50%;
  left: calc(50% - 90px);
}

.rot-line-2 {
  width: 140px;
  top: 50%;
  left: calc(50% - 70px);
  transform: rotate(120deg);
}

.rot-line-3 {
  width: 140px;
  top: 50%;
  left: calc(50% - 70px);
  transform: rotate(240deg);
}

.rot-line-4 {
  width: 200px;
  top: 50%;
  left: calc(50% - 100px);
}

.rot-line-5 {
  width: 160px;
  top: 50%;
  left: calc(50% - 80px);
  transform: rotate(120deg);
}

.rot-line-6 {
  width: 160px;
  top: 50%;
  left: calc(50% - 80px);
  transform: rotate(240deg);
}

.decor-line {
  position: absolute;
  background: #e0e0e0;
  opacity: 0.5;
}

.decor-line-1 {
  top: 12%;
  left: 0;
  width: 120px;
  height: 1px;
  transform: rotate(-15deg);
}

.decor-line-2 {
  bottom: 20%;
  right: 0;
  width: 80px;
  height: 1px;
  transform: rotate(25deg);
}

.decor-line-3 {
  top: 60%;
  left: -20px;
  width: 60px;
  height: 1px;
  transform: rotate(45deg);
}

.decor-circle {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
}

.decor-circle-1 {
  width: 100px;
  height: 100px;
  top: -50px;
  right: -50px;
}

.decor-circle-2 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  left: -30px;
}

.corner-tri {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.corner-top-left {
  top: 0;
  left: 0;
  border-width: 40px 0 0 40px;
  border-color: #000000 transparent transparent #000000;
  opacity: 0.06;
}

.corner-bottom-right {
  bottom: 0;
  right: 0;
  border-width: 0 30px 30px 0;
  border-color: transparent #000000 #000000 transparent;
  opacity: 0.06;
}

.register-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
}

.register-title {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 12px;
  color: #000000;
}

.register-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #999999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.register-close:hover {
  color: #000000;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 10;
}

.register-input-wrapper {
  position: relative;
}

.input-label {
  display: block;
  font-size: 10px;
  letter-spacing: 2px;
  color: #999999;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.register-input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #000000;
  outline: none;
  padding: 0;
}

.register-input::placeholder {
  color: #cccccc;
}

.input-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #e0e0e0;
  transition: width 0.3s ease;
}

.register-input:focus + .input-bar {
  width: 100%;
}

.register-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
  position: relative;
  z-index: 10;
}

.register-btn-cancel {
  background: transparent;
  border: none;
  font-size: 14px;
  color: #999999;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 8px 16px;
  position: relative;
  z-index: 11;
}

.register-btn-cancel:hover {
  color: #000000;
}

.register-btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: gap 0.3s ease;
  padding: 8px 16px;
  position: relative;
  z-index: 11;
}

.register-btn-submit:hover {
  gap: 16px;
}

.btn-arrow {
  font-size: 18px;
}

.game-id-modal {
  overflow: hidden;
}

.game-id-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.game-id-orbit-container {
  position: absolute;
  inset: -100%;
  animation: gameIdOrbit 30s linear infinite;
}

.game-id-orbit-container-2 {
  animation-direction: reverse;
  animation-duration: 45s;
}

@keyframes gameIdOrbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.orbit-line {
  position: absolute;
  background: #e0e0e0;
  opacity: 0.5;
  height: 1px;
}

.orbit-line-1 {
  width: 300px;
  top: 50%;
  left: calc(50% - 150px);
}

.orbit-line-2 {
  width: 240px;
  top: 50%;
  left: calc(50% - 120px);
  transform: rotate(120deg);
}

.orbit-line-3 {
  width: 240px;
  top: 50%;
  left: calc(50% - 120px);
  transform: rotate(240deg);
}

.orbit-line-4 {
  width: 350px;
  top: 50%;
  left: calc(50% - 175px);
}

.orbit-line-5 {
  width: 280px;
  top: 50%;
  left: calc(50% - 140px);
  transform: rotate(120deg);
}

.orbit-line-6 {
  width: 280px;
  top: 50%;
  left: calc(50% - 140px);
  transform: rotate(240deg);
}

.game-id-floating-dots {
  position: absolute;
  inset: 0;
}

.float-dot {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #e0e0e0;
  border-radius: 50%;
  opacity: 0.8;
  animation: floatDot 20s ease-in-out infinite;
}

.float-dot-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.float-dot-2 {
  top: 60%;
  right: 20%;
  animation-delay: -4s;
}

.float-dot-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: -8s;
}

.float-dot-4 {
  top: 40%;
  right: 40%;
  animation-delay: -12s;
}

.float-dot-5 {
  bottom: 20%;
  right: 15%;
  animation-delay: -16s;
}

@keyframes floatDot {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.08;
  }
  25% {
    transform: translate(30px, -20px) scale(1.5);
    opacity: 0.15;
  }
  50% {
    transform: translate(60px, 0) scale(1);
    opacity: 0.08;
  }
  75% {
    transform: translate(30px, 20px) scale(0.8);
    opacity: 0.04;
  }
}

.game-id-content {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 48px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.game-id-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.game-id-title {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 8px;
  color: #000000;
}

.game-id-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #999999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.game-id-close:hover {
  color: #000000;
}

.game-id-form {
  position: relative;
}

.game-id-input-wrapper {
  position: relative;
}

.game-id-input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #000000;
  outline: none;
  padding: 0;
}

.game-id-input::placeholder {
  color: #cccccc;
}

.game-id-error {
  font-size: 12px;
  color: #999999;
  margin: 8px 0 0 0;
}

.game-id-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
}

.game-id-btn-cancel {
  background: transparent;
  border: none;
  font-size: 14px;
  color: #999999;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 8px 16px;
}

.game-id-btn-cancel:hover {
  color: #000000;
}

.game-id-btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
  transition: gap 0.3s ease;
  padding: 8px 16px;
  position: relative;
  z-index: 11;
}

.game-id-btn-submit:hover {
  gap: 16px;
}

.btn-secondary {
  background: transparent;
  color: #666666;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  border-color: #000000;
  color: #000000;
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
.modal-leave-to .modal-content,
.modal-enter-from .register-content,
.modal-leave-to .register-content,
.modal-enter-from .game-id-content,
.modal-leave-to .game-id-content {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .card {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 20px;
    letter-spacing: 6px;
  }
}
</style>
