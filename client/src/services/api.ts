import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('access_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(r => r, async err => {
  const orig = err.config
  if (err.response?.status === 401 && !orig._retry) {
    orig._retry = true
    try {
      const { data } = await axios.post('/api/auth/token/refresh/', {
        refresh: localStorage.getItem('refresh_token')
      })
      localStorage.setItem('access_token', data.access)
      orig.headers.Authorization = `Bearer ${data.access}`
      return api(orig)
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }
  return Promise.reject(err)
})

export default api