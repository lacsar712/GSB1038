/**
 * 删除确认对话框组件
 * Custom delete confirmation dialog with modern UI design
 */
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface DeleteConfirmProps {
  name: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirm({
  name,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  Modal.confirm({
    title: '确认删除',
    icon: <ExclamationCircleOutlined className="text-red-500" />,
    content: (
      <div className="py-4">
        <p className="text-gray-700 mb-2">您确定要删除以下联系人吗？</p>
        <p className="font-semibold text-gray-900 text-lg">{name}</p>
        <p className="text-gray-500 text-sm mt-3">此操作不可撤销</p>
      </div>
    ),
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: onConfirm,
    onCancel: onCancel,
    centered: true,
    maskClosable: true,
  })

  return null
}
