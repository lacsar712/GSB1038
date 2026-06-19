/**
 * 登录页面
 * Login page with left-right layout
 */
import { useState } from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login, LoginRequest } from '@/services/auth'
import { message } from 'antd'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: LoginRequest) => {
    try {
      setLoading(true)
      const user = await login(values)
      message.success(`欢迎回来，${user.name}！`)
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/contacts')
    } catch (error) {
      // 错误已由 API 拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden shadow-2xl border-0 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* 左侧品牌展示 */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10 text-center">
                <TeamOutlined className="text-8xl mb-6 animate-pulse" />
                <Title level={1} className="!text-white !mb-4 !font-bold">
                  家族公司通讯录
                </Title>
                <Text className="text-blue-100 text-lg block mb-2">
                  Family Company Contact System
                </Text>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-white">现代化界面设计</Text>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-white">高效通讯录管理</Text>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <Text className="text-white">安全可靠</Text>
                  </div>
                </div>
              </div>
              {/* 装饰性元素 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            </div>

            {/* 右侧登录表单 */}
            <div className="p-12 bg-white flex flex-col justify-center">
              <div className="mb-8">
                <Title level={2} className="!mb-2 !text-gray-800">
                  欢迎登录
                </Title>
                <Text className="text-gray-500">请输入您的账号信息</Text>
              </div>

              <Form
                name="login"
                onFinish={handleLogin}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="用户名"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="密码"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item className="mb-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="h-12 rounded-lg text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    登录
                  </Button>
                </Form.Item>

                {/* 默认账号密码提示 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Text className="text-gray-600 text-sm block text-center">
                    💡 默认账号：<strong className="text-blue-600">admin</strong> / 密码：
                    <strong className="text-blue-600">123456</strong>
                  </Text>
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
