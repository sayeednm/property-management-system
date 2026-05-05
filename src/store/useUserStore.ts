'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, dummyUsers } from '@/lib/dummy-users'

interface UserStore {
  users: User[]
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => User | null
  register: (name: string, email: string, phone: string) => User
  logout: () => void
  updateProfile: (userId: string, data: Partial<Omit<User, 'id' | 'joinedAt'>>) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: dummyUsers,
      currentUser: null,
      isAuthenticated: false,

      login: (email: string, name?: string) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        
        if (user) {
          set({ currentUser: user, isAuthenticated: true })
          return user
        }
        
        // Auto-register if not found (for demo purposes)
        if (name) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            phone: '',
            joinedAt: new Date().toISOString(),
            status: 'active',
          }
          set((state) => ({
            users: [...state.users, newUser],
            currentUser: newUser,
            isAuthenticated: true,
          }))
          return newUser
        }
        
        return null
      },

      register: (name: string, email: string, phone: string) => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          joinedAt: new Date().toISOString(),
          status: 'active',
        }
        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        }))
        return newUser
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false })
      },

      updateProfile: (userId: string, data: Partial<Omit<User, 'id' | 'joinedAt'>>) => {
        set((state) => {
          const updatedUsers = state.users.map((u) =>
            u.id === userId ? { ...u, ...data } : u
          )
          const updatedCurrentUser =
            state.currentUser?.id === userId
              ? { ...state.currentUser, ...data }
              : state.currentUser
          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser,
          }
        })
      },

      blockUser: (userId: string) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: 'blocked' as const } : u
          ),
        }))
      },

      unblockUser: (userId: string) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: 'active' as const } : u
          ),
        }))
      },
    }),
    {
      name: 'user-storage',
      version: 1,
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
