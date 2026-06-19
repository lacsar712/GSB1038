/**
 * 通讯录服务模块
 * Contact service - independent from auth module
 */
import api from './api'

export interface Contact {
  id: number
  username: string
  name: string
  department?: string
  position?: string
  phone?: string
  email?: string
  create_time: string
}

export interface ContactCreate {
  username: string
  password: string
  name: string
  department?: string
  position?: string
  phone?: string
  email?: string
}

export interface ContactUpdate {
  name?: string
  department?: string
  position?: string
  phone?: string
  email?: string
}

/**
 * 获取通讯录列表
 */
export const getContacts = async (params?: {
  skip?: number
  limit?: number
  search?: string
}): Promise<Contact[]> => {
  const response = await api.get<Contact[]>('/contacts', { params })
  return response.data
}

/**
 * 创建联系人
 */
export const createContact = async (data: ContactCreate): Promise<Contact> => {
  const response = await api.post<Contact>('/contacts', data)
  return response.data
}

/**
 * 更新联系人
 */
export const updateContact = async (
  id: number,
  data: ContactUpdate
): Promise<Contact> => {
  const response = await api.put<Contact>(`/contacts/${id}`, data)
  return response.data
}

/**
 * 删除联系人
 */
export const deleteContact = async (id: number): Promise<void> => {
  await api.delete(`/contacts/${id}`)
}
