<template>
  <div class="my-page">
    <!-- 提示卡片 -->
    <div class="toast" v-show="showToast" :class="showToast ? 'show' : ''">
      {{ toastText }}
    </div>

    <!-- 设置支付密码弹窗 -->
    <div class="modal-mask" v-show="showSetPwdModal" @click="closeSetPwdModal">
      <div class="modal-box" @click.stop>
        <div class="modal-title">设置支付密码</div>
        <input v-model="pwd1" type="password" class="modal-input" placeholder="请设置6位支付密码" maxlength="6" />
        <input v-model="pwd2" type="password" class="modal-input" placeholder="请确认6位支付密码" maxlength="6" />
        <div class="modal-btns">
          <button class="btn cancel" @click="closeSetPwdModal">取消</button>
          <button class="btn confirm" @click="savePaymentCode">确认设置</button>
        </div>
      </div>
    </div>

    <!-- 充值金额弹窗 -->
    <div class="modal-mask" v-show="showRechargeModal" @click="closeRechargeModal">
      <div class="modal-box" @click.stop>
        <div class="modal-title">账户充值</div>
        <div class="recharge-grid">
          <div class="recharge-item" :class="{active: rechargeAmount === 10}" @click="rechargeAmount = 10">¥10</div>
          <div class="recharge-item" :class="{active: rechargeAmount === 50}" @click="rechargeAmount = 50">¥50</div>
          <div class="recharge-item" :class="{active: rechargeAmount === 100}" @click="rechargeAmount = 100">¥100</div>
          <div class="recharge-item" :class="{active: rechargeAmount === 200}" @click="rechargeAmount = 200">¥200</div>
        </div>
        <input v-model.number="rechargeAmount" type="number" class="modal-input" placeholder="输入自定义金额" min="1" />
        <div class="modal-btns">
          <button class="btn cancel" @click="closeRechargeModal">取消</button>
          <button class="btn confirm" @click="toWxPay">确认充值</button>
        </div>
      </div>
    </div>

    <!-- 修改昵称弹窗 -->
    <div class="modal-mask" v-show="showEditModal" @click="closeModal">
      <div class="modal-box" @click.stop>
        <div class="modal-title">设置昵称</div>
        <input v-model="editInput" class="modal-input" placeholder="请输入2-12位昵称" maxlength="12" />
        <div class="modal-btns">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="saveUserName">确认</button>
        </div>
      </div>
    </div>

    <!-- 钱包卡片 -->
    <div class="wallet-card">
      <div class="wallet-top">
        <div class="wallet-title">我的钱包</div>
        <div class="balance">¥ {{ balance }}</div>
      </div>
      <div class="wallet-bottom">
        <button class="recharge-btn" @click="toRecharge">立即充值</button>
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="user-card" @click="openEditModal">
      <div class="user-avatar">
        <img src="../assets/img/classify_img/7.jpg" alt="头像">
      </div>
      <div class="user-name">{{ userName || '点击设置昵称' }}</div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="toMyOrder">
        <span class="menu-icon">📋</span>
        <span class="menu-text">我的订单</span>
        <span class="menu-arrow">></span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">设置</span>
        <span class="menu-arrow">></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { getUserId } from '../utils/user';

const router = useRouter();
const userName = ref('');
const userTempId = getUserId();
const balance = ref(0.00);

// 提示
const showToast = ref(false);
const toastText = ref('');
const showMsg = (text) => {
  toastText.value = text;
  showToast.value = true;
  setTimeout(() => showToast.value = false, 1800);
};

// 昵称弹窗
const showEditModal = ref(false);
const editInput = ref('');
const openEditModal = () => { editInput.value = userName.value || ''; showEditModal.value = true; };
const closeModal = () => { showEditModal.value = false; };

// 支付密码设置
const showSetPwdModal = ref(false);
const pwd1 = ref('');
const pwd2 = ref('');
const closeSetPwdModal = () => { showSetPwdModal.value = false; pwd1.value = ''; pwd2.value = ''; };

// 充值弹窗
const showRechargeModal = ref(false);
const rechargeAmount = ref(10);
const closeRechargeModal = () => { showRechargeModal.value = false; };

// ============== 检查是否设置过支付密码 ==============
const checkPaymentCode = async () => {
  const { data } = await supabase
    .from('users')
    .select('payment_code')
    .eq('user_id', userTempId)
    .single();

  return data?.payment_code != null;
};

// ============== 保存支付密码 ==============
const savePaymentCode = async () => {
  if (pwd1.value.length !== 6 || pwd2.value.length !== 6) {
    return showMsg('请输入6位数字密码');
  }
  if (pwd1.value !== pwd2.value) {
    return showMsg('两次密码不一致');
  }

  const { error } = await supabase
    .from('users')
    .update({ payment_code: pwd1.value })
    .eq('user_id', userTempId);

  if (error) {
    showMsg('设置失败：' + error.message);
    return;
  }

  showMsg('✅ 支付密码设置成功');
  closeSetPwdModal();
  setTimeout(() => showRechargeModal.value = true, 500);
};

// ============== 进入充值 ==============
const toRecharge = async () => {
  const hasPwd = await checkPaymentCode();
  if (!hasPwd) {
    showSetPwdModal.value = true;
    return;
  }
  showRechargeModal.value = true;
};

// ============== 微信支付 + 增加余额 ==============
const toWxPay = async () => {
  if (!rechargeAmount.value || rechargeAmount.value < 1) {
    return showMsg('请输入正确金额');
  }

  closeRechargeModal();
  showMsg('正在发起微信支付...');

  // 模拟支付成功
  const paySuccess = true;

  if (paySuccess) {
    const { error } = await supabase
      .from('users')
      .update({ balance: balance.value + rechargeAmount.value })
      .eq('user_id', userTempId);

    if (error) {
      showMsg('充值失败：' + error.message);
      return;
    }

    await loadBalance();
    showMsg(`✅ 充值成功 +${rechargeAmount.value}元`);
  } else {
    showMsg('❌ 支付失败');
  }
};

// ============== 加载余额 ==============
const loadBalance = async () => {
  const { data } = await supabase
    .from('users')
    .select('balance')
    .eq('user_id', userTempId)
    .maybeSingle();

  if (data?.balance != null) balance.value = data.balance;
};

// ============== 加载用户信息 ==============
onMounted(async () => {
  try {
    const localName = localStorage.getItem('user_name');
    if (localName) userName.value = localName;

    const { data } = await supabase
      .from('users')
      .select('user_name')
      .eq('user_id', userTempId)
      .maybeSingle();

    if (data?.user_name) {
      userName.value = data.user_name;
      localStorage.setItem('user_name', data.user_name);
    }

    loadBalance();
  } catch (e) {
    console.log('加载失败', e);
  }
});

// ============== 跳转订单 ==============
const toMyOrder = () => {
  router.push('/my-orders');
};

// ============== 保存昵称 ==============
const saveUserName = async () => {
  const trimName = editInput.value.trim();
  if (!trimName) return;
  if (trimName.length < 2 || trimName.length > 12) return showMsg('昵称长度2-12位');

  const { data: existingUser } = await supabase
    .from('users')
    .select('user_id')
    .eq('user_name', trimName)
    .maybeSingle();

  if (existingUser) return showMsg('昵称已被使用');

  const { error } = await supabase
    .from('users')
    .upsert([{ user_id: userTempId, user_name: trimName }], { onConflict: 'user_id' });

  if (error) {
    showMsg('保存失败');
    return;
  }

  userName.value = trimName;
  localStorage.setItem('user_name', trimName);
  showMsg('✅ 昵称设置成功！');
  closeModal();
};
</script>

<style scoped>
.my-page {
  padding: 20px 15px;
  min-height: 100vh;
  position: relative;
  background: #ffe8df;
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
  box-shadow: 0 6px 20px rgba(255, 117, 58, 0.15);
  border: 1px solid #ffd1b8;
  opacity: 0;
  transition: all 0.3s ease;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 充值金额选项 */
.recharge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.recharge-item {
  padding: 12px 0;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}
.recharge-item.active {
  border-color: #ff753a;
  background: #fff5f0;
  color: #ff753a;
  font-weight: bold;
}

/* 钱包卡片 */
.wallet-card {
  background: linear-gradient(135deg, #ff753a, #f05a20);
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 20px;
  color: white;
  box-shadow: 0 6px 20px rgba(255, 117, 58, 0.25);
}
.wallet-top { margin-bottom: 18px; }
.wallet-title { font-size: 15px; opacity: 0.9; margin-bottom: 6px; }
.balance { font-size: 32px; font-weight: bold; }
.wallet-bottom { display: flex; justify-content: flex-end; }
.recharge-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-box {
  width: 80%;
  max-width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}
.modal-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}
.modal-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
  outline: none;
}
.modal-input:focus { border-color: #ff753a; }
.modal-btns { display: flex; gap: 12px; }
.btn { flex: 1; padding: 12px 0; border-radius: 8px; border: none; font-size: 15px; cursor: pointer; }
.btn.cancel { background: #f1f1f1; color: #666; }
.btn.confirm { background: #ff753a; color: #fff; }

/* 用户卡片 */
.user-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(255, 117, 58, 0.1);
  cursor: pointer;
}
.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #ffefe5;
}
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-size: 18px; font-weight: bold; color: #ff753a; }

/* 菜单 */
.menu-list {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #ffe8df;
  cursor: pointer;
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: #fff5f0; }
.menu-icon { font-size: 18px; margin-right: 12px; color: #ff753a; }
.menu-text { flex: 1; font-size: 16px; color: #263238; }
.menu-arrow { color: #999; }
</style>