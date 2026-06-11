import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'kanban_user_id'

const getUserId = (): string => {
  const existingId = localStorage.getItem(USER_ID_KEY)
  if (existingId) return existingId

  const newId = uuidv4()
  localStorage.setItem(USER_ID_KEY, newId)
  return newId
}

interface UserState {
  userId: string
}

export const useUserStore = create<UserState>(() => ({
  userId: getUserId()
}))
