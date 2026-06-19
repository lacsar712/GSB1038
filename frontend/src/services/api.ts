/**
 * API 请求服务
 * Axios instance with error handling and Toast notifications
 */
import axios, { AxiosError } from 'axios'
import { message } from 'antd'

// 创建 Axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    // 网络错误
    if (!error.response) {
      message.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }

    // HTTP 错误
    const { status, data } = error.response
    const errorMessage = data?.detail || '操作失败'

    switch (status) {
      case 400:
        message.error(errorMessage)
        break
      case 401:
        message.error('用户名或密码错误')
        break
      case 403:
        message.error(errorMessage)
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 500:
        message.error('服务器错误，请稍后重试')
        break
      default:
        message.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default api
