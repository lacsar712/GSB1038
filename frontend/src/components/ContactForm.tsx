/**
 * 联系人表单组件
 * Contact form component - reusable for create and edit
 */
import { Form, Input, FormInstance } from 'antd'

interface ContactFormProps {
  form: FormInstance
  isEdit?: boolean
}

export default function ContactForm({ form, isEdit = false }: ContactFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      {!isEdit && (
        <>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 50, message: '用户名长度为 2-50 个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </>
      )}

      <Form.Item
        label="姓名"
        name="name"
        rules={[
          { required: true, message: '请输入姓名' },
          { max: 50, message: '姓名最多 50 个字符' },
        ]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item
        label="部门"
        name="department"
        rules={[{ max: 100, message: '部门最多 100 个字符' }]}
      >
        <Input placeholder="请输入部门" />
      </Form.Item>

      <Form.Item
        label="职位"
        name="position"
        rules={[{ max: 100, message: '职位最多 100 个字符' }]}
      >
        <Input placeholder="请输入职位" />
      </Form.Item>

      <Form.Item
        label="电话"
        name="phone"
        rules={[
          { max: 20, message: '电话最多 20 个字符' },
          { pattern: /^[0-9-+\s()]*$/, message: '请输入有效的电话号码' },
        ]}
      >
        <Input placeholder="请输入电话" />
      </Form.Item>

      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { max: 100, message: '邮箱最多 100 个字符' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
    </Form>
  )
}
