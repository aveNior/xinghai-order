export function isLoggedIn() {
  return localStorage.getItem('is_logged_in') === 'true'
}

export function getUserName() {
  return localStorage.getItem('user_name')
}

export function logout() {
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_name')
  localStorage.removeItem('is_logged_in')
}
