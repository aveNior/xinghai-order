<template>
  <div class="my-page">
    <div class="toast" :class="{ show: showToast, success: toastType === 'success', error: toastType === 'error' }">
      {{ toastText }}
    </div>

    <div class="profile-header">
      <div class="profile-bg"></div>
      <div class="profile-content">
        <div class="avatar-wrapper">
          <img src="https://hxuvcshkbgtqnjjjpakl.supabase.co/storage/v1/object/public/classify_img/7.jpg" alt="avatar" class="avatar" />
          <div class="avatar-ring"></div>
          <div class="avatar-glow"></div>
        </div>
        <div class="profile-info">
          <h2 class="username">{{ userName || '点击设置昵称' }}</h2>
          <p class="user-id" v-if="userName">会员</p>
          <p class="game-id-display" v-if="gameId">
            <span class="game-id-label">游戏ID：</span>
            <span class="game-id-value">{{ gameId }}</span>
          </p>
          <p class="game-id-hint" v-else>未绑定游戏ID</p>
        </div>
        <button class="edit-btn" @click="openEditModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="game-id-card" @click="openGameIdModal">
      <div class="game-id-info">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M20 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H20C20.5523 17 21 16.5523 21 16V8C21 7.44772 20.5523 7 20 7Z" stroke="currentColor" stroke-width="2"/>
          <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke="currentColor" stroke-width="2"/>
        </svg>
        <div class="game-id-text">
          <span class="game-id-title">游戏ID</span>
          <span class="game-id-content">{{ gameId || '点击绑定' }}</span>
        </div>
      </div>
      <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <div class="wallet-card">
      <div class="wallet-glow"></div>
      <div class="wallet-info">
        <span class="wallet-label">账户余额</span>
        <span class="wallet-balance">¥{{ balance.toFixed(2) }}</span>
      </div>
      <button class="recharge-btn" @click="toRecharge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        充值
      </button>
    </div>

    <div class="menu-section">
      <h3 class="section-title">我的服务</h3>
      <div class="menu-list">
        <div class="menu-item" @click="toMyOrder">
          <div class="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 12L15 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 16L13 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="menu-text">我的订单</span>
          <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="menu-item" @click="showRetrieveModal = true">
          <div class="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L12 15L22 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 16V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="menu-text">找回账号</span>
          <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="menu-item" @click="showMsg('设置功能开发中...', 'warning')">
          <div class="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9.00001C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18001L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.75523 6.47088C3.63393 6.22708 3.58213 5.96683 3.60818 5.704C3.63423 5.44117 3.73714 5.19092 3.90575 4.98871C4.07436 4.7865 4.29494 4.63423 4.55777 4.56818C4.8206 4.50213 5.08086 4.51433 5.32207 4.59414C5.56328 4.67394 5.77546 4.81819 5.935 5.01L7.53 7.04C7.72071 7.27324 7.83849 7.56086 7.85986 7.85986C7.88123 8.15886 7.79819 8.44648 7.62418 8.67324C7.45017 8.89999 7.19092 9.05849 6.907 9.11C6.62308 9.16151 6.32546 9.10517 6.07918 8.94605C5.8329 8.78693 5.64166 8.53218 5.535 8.23L4.12 5.88C3.8285 5.42516 3.95653 4.85575 4.41137 4.56425C4.86621 4.27275 5.43562 4.40078 5.72712 4.85562L7.14 7.2C7.38289 7.68054 7.87943 8 8.4 8H16C16.5204 8 17.0119 8.31946 17.2547 8.80012L18.97 11.34C19.2067 11.7402 19.6773 12 20.1115 12H21C21.2652 12 21.5196 12.1054 21.7071 12.2929C21.8946 12.4804 22 12.7348 22 13V15.8C22 16.3523 21.7893 16.851 21.4142 17.2262C21.0391 17.6014 20.5404 17.8121 20 17.8121C19.7348 17.8121 19.4804 17.7067 19.2929 17.5192C19.1054 17.3317 19 17.0773 19 16.8121V14H13C12.4696 14 12 14.4696 12 15V20C12 20.2652 12.1054 20.5196 12.2929 20.7071C12.4804 20.8946 12.7348 21 13 21H16C16.5304 21 17 20.5304 17 20V14C17 13.4696 16.5304 13 16 13H8C7.73478 13 7.5 12.7652 7.5 12C7.5 11.7348 7.73478 11.5 8 11.5H16C16.5304 11.5 17 11.0304 17 10.5V8C17 7.46957 16.5304 7 16 7H9C8.73478 7 8.5 6.76522 8.5 6.5C8.5 6.23478 8.73478 6 9 6H16C17.6569 6 19 7.34315 19 9V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="menu-text">设置</span>
          <svg class="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="logout-section" v-if="userName">
      <button class="logout-btn" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        退出登录
      </button>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div class="modal" v-if="showSetPwdModal" @click="closeSetPwdModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">设置支付密码</h3>
              <button class="modal-close" @click="closeSetPwdModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <form class="pwd-form">
                <input v-model="pwd1" type="password" class="input-field" placeholder="请设置6位支付密码" maxlength="6" />
                <input v-model="pwd2" type="password" class="input-field" placeholder="请确认6位支付密码" maxlength="6" />
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeSetPwdModal">取消</button>
              <button class="btn btn-primary" @click="savePaymentCode">确认设置</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div class="modal" v-if="showRechargeModal" @click="closeRechargeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">账户充值</h3>
              <button class="modal-close" @click="closeRechargeModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="recharge-options">
                <div class="recharge-item" :class="{active: rechargeAmount === 10}" @click="rechargeAmount = 10">¥10</div>
                <div class="recharge-item" :class="{active: rechargeAmount === 50}" @click="rechargeAmount = 50">¥50</div>
                <div class="recharge-item" :class="{active: rechargeAmount === 100}" @click="rechargeAmount = 100">¥100</div>
                <div class="recharge-item" :class="{active: rechargeAmount === 200}" @click="rechargeAmount = 200">¥200</div>
              </div>
              <input v-model.number="rechargeAmount" type="number" class="input-field" placeholder="输入自定义金额" min="1" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeRechargeModal">取消</button>
              <button class="btn btn-primary" @click="toWxPay">确认充值</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div class="modal" v-if="showRetrieveModal" @click="closeRetrieveModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">找回账号</h3>
              <button class="modal-close" @click="closeRetrieveModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="retrieve-content">
                <div class="retrieve-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L12 15L22 5" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 16V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="retrieve-text">请联系管理员找回账号</p>
                <div class="wechat-info">
                  <span class="wechat-label">管理员微信：</span>
                  <span class="wechat-value">18334103941</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" @click="closeRetrieveModal">知道了</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div class="modal" v-if="showEditModal" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">设置昵称</h3>
              <button class="modal-close" @click="closeModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <input v-model="editInput" type="text" class="input-field" placeholder="请输入2-12位昵称" maxlength="12" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">取消</button>
              <button class="btn btn-primary" @click="saveUserName">确认</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div class="modal" v-if="showGameIdModal" @click="closeGameIdModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">{{ gameId ? '修改游戏ID' : '绑定游戏ID' }}</h3>
              <button class="modal-close" @click="closeGameIdModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <input v-model="gameIdInput" type="text" class="input-field" placeholder="请输入游戏ID" maxlength="30" />
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeGameIdModal">取消</button>
              <button class="btn btn-primary" @click="saveGameId">确认</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { getUserId } from '../utils/user';
import { logout } from '../utils/auth';

const router = useRouter();
const API_BASE_URL = '/api';
const userName = ref('');
const gameId = ref('');
let userTempId = null;
const balance = ref(0.00);

const showToast = ref(false);
const toastText = ref('');
const toastType = ref('success');
const showMsg = (text, type = 'success', second = 3) => {
  toastText.value = '星屿小筑提醒您：' + text;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => showToast.value = false, second * 1000);
};

const showEditModal = ref(false);
const editInput = ref('');
const openEditModal = () => { editInput.value = userName.value || ''; showEditModal.value = true; };
const closeModal = () => { showEditModal.value = false; };

const showGameIdModal = ref(false);
const gameIdInput = ref('');
const openGameIdModal = () => { gameIdInput.value = gameId.value || ''; showGameIdModal.value = true; };
const closeGameIdModal = () => { showGameIdModal.value = false; gameIdInput.value = ''; };

const saveGameId = async () => {
  if (!gameIdInput.value.trim()) {
    return showMsg('请输入游戏ID', 'error');
  }

  const { error } = await supabase
    .from('user')
    .update({ game_id: gameIdInput.value.trim() })
    .eq('id', userTempId);

  if (error) {
    showMsg('保存失败：' + error.message, 'error');
    return;
  }

  gameId.value = gameIdInput.value.trim();
  localStorage.setItem('game_id', gameIdInput.value.trim());
  showMsg('游戏ID保存成功', 'success');
  closeGameIdModal();
};

const showSetPwdModal = ref(false);
const pwd1 = ref('');
const pwd2 = ref('');
const closeSetPwdModal = () => { showSetPwdModal.value = false; pwd1.value = ''; pwd2.value = ''; };

const showRechargeModal = ref(false);
const rechargeAmount = ref(10);
const closeRechargeModal = () => { showRechargeModal.value = false; };

const showRetrieveModal = ref(false);
const closeRetrieveModal = () => { 
  showRetrieveModal.value = false; 
};

const checkPaymentCode = async () => {
  const { data } = await supabase
    .from('user')
    .select('payment_code')
    .eq('id', userTempId)
    .maybeSingle();
  return data?.payment_code != null;
};

const savePaymentCode = async () => {
  if (pwd1.value.length !== 6 || pwd2.value.length !== 6) {
    return showMsg('请输入6位数字密码', 'error');
  }
  if (pwd1.value !== pwd2.value) {
    return showMsg('两次密码不一致', 'error');
  }

  const { error } = await supabase
    .from('user')
    .update({ payment_code: pwd1.value })
    .eq('id', userTempId);

  if (error) {
    showMsg('设置失败：' + error.message, 'error');
    return;
  }

  showMsg('支付密码设置成功', 'success');
  showSetPwdModal.value = false;
  pwd1.value = '';
  pwd2.value = '';
};

const toRecharge = async () => {
  const hasPwd = await checkPaymentCode();
  if (!hasPwd) {
    showSetPwdModal.value = true;
    return;
  }
  showRechargeModal.value = true;
};

const toWxPay = async () => {
  const amount = rechargeAmount.value;
  if (!amount || amount < 1) {
    showMsg('请输入有效的充值金额', 'warning');
    return;
  }

  closeRechargeModal();
  showMsg('正在跳转支付...', 'success', 2);

  try {
    const openid = localStorage.getItem('wx_openid');
    if (!openid) {
      await getWechatOpenid();
    }

    const response = await fetch(`${API_BASE_URL}/pay/unifiedorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userTempId,
        amount: amount,
        openid: localStorage.getItem('wx_openid')
      })
    });

    const result = await response.json();

    if (result.success) {
      const payData = result.data;
      callWxPay(payData);
    } else {
      showMsg(result.message || '创建订单失败', 'error');
    }
  } catch (error) {
    console.error('Payment error:', error);
    showMsg('支付请求失败，请重试', 'error');
  }
};

const getWechatOpenid = async () => {
  try {
    // 检查是否有 openid
    const existingOpenid = localStorage.getItem('wx_openid');
    if (existingOpenid) {
      return existingOpenid;
    }
    
    // 检查 URL 中是否有 code 参数
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // 通过 code 获取 openid
      const response = await fetch(`${API_BASE_URL}/wechat/getOpenid?code=${encodeURIComponent(code)}`);
      const result = await response.json();
      
      if (result.success && result.openid) {
        localStorage.setItem('wx_openid', result.openid);
        // 清除 URL 中的 code 参数
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        window.history.replaceState({}, '', url.toString());
        return result.openid;
      }
    } else {
      // 没有 openid 也没有 code，跳转到授权页面
      const redirectUri = window.location.href;
      const authResponse = await fetch(`${API_BASE_URL}/wechat/auth?redirect_uri=${encodeURIComponent(redirectUri)}`);
      const authResult = await authResponse.json();
      
      if (authResult.success) {
        window.location.href = authResult.auth_url;
      }
    }
  } catch (error) {
    console.error('获取 openid 失败:', error);
  }
};

const callWxPay = (payData) => {
  /* eslint-disable-next-line no-undef */
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', () => onBridgeReady(payData), false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', () => onBridgeReady(payData));
      document.attachEvent('onWeixinJSBridgeReady', () => onBridgeReady(payData));
    }
  } else {
    onBridgeReady(payData);
  }
};

const onBridgeReady = (payData) => {
  /* eslint-disable-next-line no-undef */
  WeixinJSBridge.invoke('getBrandWCPayRequest', {
    appId: payData.appId || 'wxcff48cc05e7788dc',
    timeStamp: payData.timeStamp,
    nonceStr: payData.nonceStr,
    package: payData.package,
    signType: payData.signType,
    paySign: payData.paySign
  }, (res) => {
    if (res.err_msg === 'get_brand_wcpay_request:ok') {
      showMsg('充值成功', 'success');
      loadBalance();
    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
      showMsg('已取消支付', 'warning');
    } else {
      showMsg('支付失败：' + res.err_msg, 'error');
    }
  });
};

const loadBalance = async () => {
  const { data } = await supabase
    .from('user')
    .select('balance')
    .eq('id', userTempId)
    .maybeSingle();

  if (data?.balance != null) balance.value = data.balance;
};

onMounted(async () => {
  userTempId = getUserId();
  if (!userTempId) return;

  try {
    const localName = localStorage.getItem('user_name');
    if (localName) userName.value = localName;

    const localGameId = localStorage.getItem('game_id');
    if (localGameId) gameId.value = localGameId;

    const { data } = await supabase
      .from('user')
      .select('user_name, game_id')
      .eq('id', userTempId)
      .maybeSingle();

    if (data?.user_name) {
      userName.value = data.user_name;
      localStorage.setItem('user_name', data.user_name);
    }

    if (data?.game_id) {
      gameId.value = data.game_id;
      localStorage.setItem('game_id', data.game_id);
    }

    loadBalance();
  } catch (e) {
    console.log('加载失败', e);
  }
});

const toMyOrder = () => {
  const uid = getUserId();
  if (!uid) return;
  router.push('/my-orders');
};

const handleLogout = () => {
  logout();
  userName.value = '';
  showMsg('已退出登录', 'success');
  router.push('/');
};

const saveUserName = async () => {
  const trimName = editInput.value.trim();
  if (!trimName) return;
  if (trimName.length < 2 || trimName.length > 12) return showMsg('昵称长度2-12位', 'error');

  const { data: existingUser } = await supabase
    .from('user')
    .select('id')
    .eq('user_name', trimName)
    .maybeSingle();

  if (existingUser) return showMsg('昵称已被使用', 'error');

  const { error } = await supabase
    .from('user')
    .update({ user_name: trimName })
    .eq('id', userTempId);

  if (error) {
    showMsg('保存失败', 'error');
    return;
  }

  userName.value = trimName;
  localStorage.setItem('user_name', trimName);
  showMsg('昵称设置成功', 'success');
  closeModal();
};
</script>

<style scoped>
.my-page {
  padding: 12px;
  padding-bottom: calc(80px + 16px);
  min-height: 100vh;
  background: #ffffff;
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
.toast.warning { border-left: 3px solid #999999; }

.profile-header {
  margin-bottom: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 18px;
  font-weight: 300;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.user-id {
  font-size: 11px;
  color: #999999;
}

.edit-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.edit-btn:hover {
  background: #eeeeee;
}

.game-id-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.game-id-card:hover {
  background: #f5f5f5;
}

.game-id-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.game-id-info svg {
  color: #999999;
}

.game-id-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.game-id-title {
  font-size: 11px;
  color: #999999;
}

.game-id-content {
  font-size: 14px;
  color: #333333;
  font-weight: 300;
}

.menu-arrow {
  color: #cccccc;
  transition: all 0.2s ease;
}

.game-id-card:hover .menu-arrow {
  color: #999999;
  transform: translateX(3px);
}

.game-id-display {
  font-size: 12px;
  color: #666666;
  margin: 4px 0 0 0;
}

.game-id-label {
  color: #999999;
}

.game-id-value {
  color: #333333;
}

.game-id-hint {
  font-size: 11px;
  color: #999999;
  margin: 4px 0 0 0;
}

.wallet-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
}

.wallet-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wallet-label {
  font-size: 12px;
  color: #666666;
}

.wallet-balance {
  font-size: 28px;
  font-weight: 200;
  color: #333333;
}

.recharge-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #f5f5f5;
  color: #333333;
  font-size: 13px;
  font-weight: 300;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recharge-btn:hover {
  background: #eeeeee;
}

.menu-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 12px;
  font-weight: 300;
  color: #999999;
  margin-bottom: 10px;
  padding-left: 4px;
}

.menu-list {
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f0f0f0;
}

.menu-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666666;
  transition: all 0.2s ease;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #333333;
  font-weight: 300;
}

.logout-section {
  margin-top: 16px;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  background: #f5f5f5;
  color: #666666;
  font-size: 14px;
  font-weight: 300;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #f5f5f5;
  border-color: #999999;
}

.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
}

.modal-container {
  width: 100%;
  max-width: 340px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.modal-title {
  font-size: 15px;
  font-weight: 300;
  color: #333333;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #999999;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #333333;
  background: #eeeeee;
}

.modal-body {
  padding: 20px;
}

.input-field {
  width: 100%;
  padding: 14px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  outline: none;
}

.input-field:last-child {
  margin-bottom: 0;
}

.input-field:focus {
  border-color: #999999;
  background: #ffffff;
}

.input-field::placeholder {
  color: #cccccc;
}

.pwd-form .input-field:last-child {
  margin-bottom: 0;
}

.recharge-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.recharge-item {
  padding: 12px 8px;
  text-align: center;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 300;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recharge-item.active {
  background: #999999;
  border-color: #999999;
  color: #ffffff;
}

.recharge-item:hover {
  border-color: #999999;
}

.retrieve-content {
  text-align: center;
}

.retrieve-icon {
  margin-bottom: 14px;
  color: #999999;
}

.retrieve-text {
  font-size: 13px;
  color: #666666;
  margin-bottom: 14px;
}

.wechat-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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

.btn-primary {
  background: #f5f5f5;
  color: #333333;
  border: none;
}

.btn-primary:hover {
  background: #555555;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666666;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #eeeeee;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
