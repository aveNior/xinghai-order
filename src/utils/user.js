// 获取用户唯一ID（不登录方案）
export function getUserId() {
  let uid = localStorage.getItem('user_temp_id')
  
  if (!uid) {
    // 生成永不重复的ID
    uid = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10)
    localStorage.setItem('user_temp_id', uid)
  }
  
  return uid
}