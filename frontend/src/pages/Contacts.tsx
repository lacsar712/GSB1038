/**
 * 通讯录管理页面
 * Contacts management page with CRUD operations
 */
import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Tag,
  Modal,
  Form,
  message,
  Layout,
  Avatar,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  Contact,
  ContactCreate,
  ContactUpdate,
} from '@/services/contact'
import ContactForm from '@/components/ContactForm'
import DeleteConfirm from '@/components/DeleteConfirm'

const { Title, Text } = Typography
const { Header, Content } = Layout
const { Search } = Input

export default function Contacts() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [form] = Form.useForm()

  // 获取当前用户信息
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  // 加载通讯录列表
  const loadContacts = async (search?: string) => {
    try {
      setLoading(true)
      const data = await getContacts({ search })
      setContacts(data)
    } catch (error) {
      // 错误已由 API 拦截器处理
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // 搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    loadContacts(value)
  }

  // 打开添加/编辑弹窗
  const openModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
      form.setFieldsValue(contact)
    } else {
      setEditingContact(null)
      form.resetFields()
    }
    setIsModalOpen(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingContact) {
        // 更新
        await updateContact(editingContact.id, values as ContactUpdate)
        message.success('员工信息更新成功')
      } else {
        // 创建
        await createContact(values as ContactCreate)
        message.success('员工添加成功')
      }
      
      closeModal()
      loadContacts(searchKeyword)
    } catch (error) {
      // 表单验证失败或 API 错误
    }
  }

  // 删除联系人
  const handleDelete = (contact: Contact) => {
    DeleteConfirm({
      name: contact.name,
      onConfirm: async () => {
        try {
          await deleteContact(contact.id)
          message.success('员工删除成功')
          loadContacts(searchKeyword)
        } catch (error) {
          // 错误已由 API 拦截器处理
        }
      },
      onCancel: () => {},
    })
  }

  // 退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        localStorage.removeItem('user')
        message.success('已退出登录')
        navigate('/')
      },
    })
  }

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (text: string) => (
        <Tag color="blue">{text || '-'}</Tag>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      render: (text: string) => (
        <Tag color="green">{text || '-'}</Tag>
      ),
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => text || '-',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Contact) => {
        // 只有 admin 用户可以删除
        const canDelete = currentUser.username === 'admin' && record.username !== 'admin'
        
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              className="text-blue-600 hover:text-blue-700"
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={!canDelete}
              className="hover:text-red-600"
              title={
                currentUser.username !== 'admin' 
                  ? '只有管理员可以删除账号' 
                  : record.username === 'admin' 
                  ? '不能删除管理员账号' 
                  : ''
              }
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  return (
    <Layout className="min-h-screen">
      {/* 顶部导航栏 */}
      <Header className="bg-white shadow-md px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <TeamOutlined className="text-3xl text-blue-600" />
          <Title level={3} className="!mb-0 !text-gray-800">
            家族公司通讯录
          </Title>
        </div>
        <Space size="large">
          <div className="flex items-center space-x-3">
            <Avatar icon={<UserOutlined />} size={40} className="bg-purple-500" />
            <div className="flex flex-col">
              <Text strong>{currentUser.name}</Text>
            </div>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="hover:text-red-500"
          >
            退出登录
          </Button>
        </Space>
      </Header>

      {/* 主内容区 */}
      <Content className="p-8">
        <Card className="shadow-lg rounded-xl border-0">
          {/* 操作栏 */}
          <div className="mb-6 flex items-center justify-between">
            <Space size="large">
              <Search
                placeholder="搜索姓名、部门、职位..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ width: 350 }}
                onSearch={handleSearch}
                className="rounded-lg"
              />
              <Text type="secondary">
                共 <strong className="text-blue-600 text-lg">{contacts.length}</strong> 名员工
              </Text>
            </Space>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              添加员工
            </Button>
          </div>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={contacts}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              className: 'px-4',
            }}
            scroll={{ x: 1200 }}
            className="rounded-lg overflow-hidden"
            locale={{
              emptyText: (
                <div className="py-12">
                  <TeamOutlined className="text-6xl text-gray-300 mb-4" />
                  <Text type="secondary" className="block">暂无员工信息</Text>
                </div>
              ),
            }}
          />
        </Card>
      </Content>

      {/* 添加/编辑弹窗 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-blue-600" />
            <span>{editingContact ? '编辑员工信息' : '添加新员工'}</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText="保存"
        cancelText="取消"
        width={600}
        centered
        destroyOnClose
      >
        <ContactForm form={form} isEdit={!!editingContact} />
      </Modal>
    </Layout>
  )
}
