import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'kanban_user_id'

const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

interface UserState {
  userId: string
}

export const useUserStore = create<UserState>(() => ({
  userId: getUserId()
}))
