import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  token: string | null
  user: {
    email: string
    id: number
  } | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userEmail: (state) => state.user?.email,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('https://dist.nd.ru/api/auth', {
          email,
          password,
        })

        const token = response.data.accessToken
        if (!token) {
          throw new Error('Token not received from server')
        }

        const tokenData = JSON.parse(atob(token.split('.')[1]))
        const userData = {
          email: tokenData.data.email,
          id: tokenData.data.id,
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))

        this.token = token
        this.user = userData

        return response.data
      } catch (error: any) {
        console.error('Login error:', error)
        throw error.response?.data || error
      }
    },

    async register(email: string, password: string, confirmPassword: string) {
      try {
        const registerResponse = await axios.post('https://dist.nd.ru/api/reg', {
          email,
          password,
          confirm_password: confirmPassword,
        })

        if (registerResponse.data) {
          try {
            return await this.login(email, password)
          } catch (loginError: any) {
            console.error('Error during auto-login after registration:', loginError)
            throw loginError
          }
        }

        return registerResponse.data
      } catch (error: any) {
        if (error.response?.status === 409) {
          const errorResponse = {
            status: 409,
            message: 'Пользователь с таким e-mail уже зарегистрирован',
          }
          throw errorResponse
        }
        throw error.response?.data || error
      }
    },

    async fetchUserData() {
      try {
        const response = await axios.get('https://dist.nd.ru/api/auth', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return response
      } catch (error: any) {
        throw error.response?.data || error
      }
    },

    async logout() {
      try {
        await axios.delete('https://dist.nd.ru/api/auth', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
      } catch (error) {
        console.error('Ошибка при выходе:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})
