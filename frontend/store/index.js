import { createStore } from 'vuex'
import axios from 'axios'
import { mockRegister, mockLogin, mockGetMasterData, mockCreateRequest, mockGetRequests } from '../services/mockApi'

const API_BASE = import.meta.env.VITE_GAS_DEPLOYMENT_ID

// ใช้ Backend จริง เว้นแต่ค่า placeholder
const USE_MOCK_API = !API_BASE || API_BASE.includes('DEFAULT_ID') || API_BASE.includes('PASTE_YOUR') || API_BASE.includes('macros/d/')

// Debug: ตรวจสอบว่าใช้ API ไหน
console.log('[STORE] API_BASE:', API_BASE ? API_BASE.substring(0, 50) + '...' : 'NOT SET')
console.log('[STORE] USE_MOCK_API:', USE_MOCK_API)

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    masterData: {},
    requests: [],
    loading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    isAdmin: state => state.isAdmin,
    currentUser: state => state.user,
    masterData: state => state.masterData,
    requests: state => state.requests,
    loading: state => state.loading
  },

  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      state.isAdmin = user?.role === 'admin'
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      localStorage.removeItem('user')
    },

    setMasterData(state, data) {
      state.masterData = data
    },

    setRequests(state, requests) {
      state.requests = requests
    },

    setLoading(state, loading) {
      state.loading = loading
    },

    setError(state, error) {
      state.error = error
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      commit('setLoading', true)
      try {
        let response
        
        if (USE_MOCK_API) {
          // ใช้ Mock API สำหรับทดสอบ
          response = await mockLogin(email, password)
        } else {
          // ใช้ Backend จริง
          const result = await axios.post(`${API_BASE}?action=login`, { email, password })
          response = result.data
        }
        
        if (response.success) {
          commit('setUser', response.user)
          commit('setError', null)
          return response
        } else {
          commit('setError', response.message)
          return response
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถเชื่อมต่อ backend'
        commit('setError', errorMessage)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async register({ commit }, userData) {
      commit('setLoading', true)
      try {
        let response
        
        if (USE_MOCK_API) {
          // ใช้ Mock API สำหรับทดสอบ
          response = await mockRegister(userData.email, userData.password, userData.name, userData.nickname, userData.unit)
        } else {
          // ใช้ Backend จริง
          const result = await axios.post(`${API_BASE}?action=register`, userData)
          response = result.data
        }
        
        commit('setError', null)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถเชื่อมต่อ backend'
        commit('setError', errorMessage)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async forgotPassword({ commit }, email) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`${API_BASE}?action=forgotPassword`, { email })
        commit('setError', null)
        return response.data
      } catch (error) {
        commit('setError', error.message)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async resetPassword({ commit }, { token, newPassword }) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`${API_BASE}?action=resetPassword`, { token, newPassword })
        commit('setError', null)
        return response.data
      } catch (error) {
        commit('setError', error.message)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async getMasterData({ commit }) {
      commit('setLoading', true)
      try {
        let response
        
        if (USE_MOCK_API) {
          // ใช้ Mock API สำหรับทดสอบ
          response = await mockGetMasterData()
        } else {
          // ใช้ Backend จริง
          const result = await axios.post(`${API_BASE}?action=getMasterData`)
          response = result.data
        }
        
        commit('setMasterData', response)
        commit('setError', null)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถเชื่อมต่อ backend'
        commit('setError', errorMessage)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    logout({ commit }) {
      commit('clearUser')
    },

    restoreUser({ commit }) {
      const user = localStorage.getItem('user')
      if (user) {
        commit('setUser', JSON.parse(user))
      }
    }
  }
})
