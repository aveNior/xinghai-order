<template>
  <div class="orders-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="back" @click="$router.back()">← 返回</div>
      <h2 class="title">我的订单</h2>
    </div>

    <!-- 加载中 -->
    <div class="loading" v-if="loading">加载中...</div>

    <!-- 无订单 -->
    <div class="empty" v-else-if="orders.length === 0">
      <div class="empty-icon">📭</div>
      <p>暂无订单</p>
    </div>

    <!-- 订单卡片列表 -->
    <div class="order-list" v-else>
      <div class="order-card" v-for="item in orders" :key="item.id">
        <div class="card-top">
          <div class="goods-name">{{ item.title }}</div>
          <div class="price">¥{{ item.price }}</div>
        </div>

        <!-- 订单状态 -->
        <div class="status" :class="getStatusClass(item.status)">
          {{ item.status }}
        </div>

        <!-- 接单打手 -->
        <div class="info-row" v-if="item.handler_id">
          <span>接单打手：</span>
          <span>{{ item.handler_id }}</span>
        </div>

        <!-- 转单目标 -->
        <div class="info-row transfer" v-if="item.transfer_to_id">
          <span>转单至：</span>
          <span>{{ item.transfer_to_id }}</span>
        </div>

        <!-- 结单时间（只有已结单才显示） -->
        <div class="info-row finished" v-if="item.status === '已结单' && item.finished_at">
          <span>结单时间：</span>
          <span>{{ formatTime(item.finished_at) }}</span>
        </div>

        <!-- 下单时间 -->
        <div class="card-bottom">
          <span>下单时间</span>
          <span>{{ formatTime(item.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserId } from '../utils/user'
import { supabase } from '../supabase'

const orders = ref([])
const loading = ref(true)

// 获取我的订单
const getOrders = async () => {
  const user_id = getUserId()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  loading.value = false
  if (!error) orders.value = data
}

// 状态样式
const getStatusClass = (status) => {
  if (status === '待接取') return 'wait'
  if (status === '接取中') return 'ing'
  if (status === '已结单') return 'done'
  if (status === '转单中') return 'transfer'
  return ''
}

// 时间格式化
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

onMounted(() => {
  getOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 20px 15px;
  background: #f7f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.back {
  font-size: 16px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.title {
  margin-left: 15px;
  font-size: 18px;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.empty {
  text-align: center;
  padding: 80px 0;
  color: #999;
}
.empty-icon {
  font-size: 50px;
  margin-bottom: 10px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  position: relative;
}

.card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.goods-name {
  font-size: 16px;
  font-weight: 500;
}
.price {
  color: #ff4d4f;
  font-weight: bold;
}

/* 状态标签 */
.status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  margin-bottom: 10px;
}
.status.wait { background: #f5f5f5; color: #666; }
.status.ing { background: #e6f7ff; color: #1890ff; }
.status.done { background: #f6ffed; color: #52c41a; }
.status.transfer { background: #fff7e6; color: #fa8c16; }

.info-row {
  font-size: 13px;
  color: #333;
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
}
.transfer {
  color: #fa8c16;
  font-weight: 500;
}
.finished {
  color: #52c41a;
  font-weight: 500;
}

.card-bottom {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  display: flex;
  justify-content: space-between;
}
</style>