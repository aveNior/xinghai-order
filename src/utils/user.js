import router from '../router'

export function getUserId() {
  const uid = localStorage.getItem('user_id')
  if (!uid) {
    window.dispatchEvent(new CustomEvent('show-login-modal', {
      detail: {
        message: '您还未登录，是否前往登录？',
        callback: (confirmed) => {
          if (confirmed) router.push('/login')
        }
      }
    }))
    return null
  }
  return uid
}

export function requireLogin() {
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true'
  if (!isLoggedIn) {
    window.dispatchEvent(new CustomEvent('show-login-modal', {
      detail: {
        message: '您还未登录，是否前往登录？',
        callback: (confirmed) => {
          if (confirmed) router.push('/login')
        }
      }
    }))
    return false
  }
  return true
}
