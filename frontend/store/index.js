import { createStore } from 'vuex'
import axios from 'axios'
import { mockRegister, mockLogin, mockGetMasterData, mockCreateRequest, mockGetRequests } from '../services/mockApi'
import { supabase } from '../services/supabaseClient'

// Configuration: choose backend
const USE_SUPABASE = true
const API_BASE = import.meta.env.VITE_GAS_DEPLOYMENT_ID

console.log('[STORE] USE_SUPABASE:', USE_SUPABASE)
console.log('[STORE] API_BASE:', API_BASE ? API_BASE.substring(0, 50) + '...' : 'NOT SET')

// Configure axios for fallback calls (if any)
axios.defaults.timeout = 10000
axios.defaults.maxRedirects = 5
axios.defaults.withCredentials = false
axios.defaults.headers.common['Accept'] = 'application/json'

// Add axios request interceptor for debugging
axios.interceptors.request.use(
  config => {
    console.log('[AXIOS] Sending request to:', config.url)
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

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
        if (USE_SUPABASE) {
          // Normalize email: trim and lowercase to avoid case sensitivity issues
          const normalizedEmail = String(email).trim().toLowerCase()
          console.log('[LOGIN] Attempting login:', { email: normalizedEmail })

          const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
          console.log('[LOGIN] Auth response:', { error: error?.message, hasUser: !!data?.user })

          if (error) {
            const msg = error.message || 'รหัสผ่านหรืออีเมลไม่ถูกต้อง'
            console.error('[LOGIN] Auth error:', msg)
            commit('setError', msg)
            return { success: false, message: msg }
          }

          // Fetch user profile
          const user = data.user
          if (!user || !user.id) {
            console.error('[LOGIN] No user returned from auth')
            commit('setError', 'ไม่พบผู้ใช้')
            return { success: false, message: 'ไม่พบผู้ใช้' }
          }

          const { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profError && profError.code !== 'PGRST116') {
            console.warn('[LOGIN] Profile fetch warning:', profError.message)
          }

          const userObj = profile || { email: user.email, id: user.id }
          console.log('[LOGIN] Success:', { userId: user.id, email: user.email })
          commit('setUser', userObj)
          commit('setError', null)
          return { success: true, user: userObj }
        } else {
          const result = await axios.post(`${API_BASE}?action=login`, { email, password })
          const response = result.data
          if (response.success) {
            commit('setUser', response.user)
            commit('setError', null)
            return response
          } else {
            commit('setError', response.message)
            return response
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถเชื่อมต่อ backend'
        console.error('[LOGIN] Exception:', errorMessage)
        commit('setError', errorMessage)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async register({ commit }, userData) {
      commit('setLoading', true)
      try {
        if (USE_SUPABASE) {
          // Normalize email: trim and lowercase to avoid case sensitivity issues
          const normalizedEmail = String(userData.email).trim().toLowerCase()
          const password = String(userData.password)

          console.log('[REGISTER] Starting signup:', { email: normalizedEmail })

          // Use Supabase Auth to sign up with email and password
          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: password
          })

          console.log('[REGISTER] Signup response:', { error: error?.message, hasUser: !!data?.user })

          if (error) {
            const msg = error.message || 'Failed to register'
            console.error('[REGISTER] Signup error:', msg)
            commit('setError', msg)
            return { success: false, message: msg }
          }

          const authUser = data.user
          if (!authUser || !authUser.id) {
            const msg = 'Failed to create auth user'
            console.error('[REGISTER]', msg)
            commit('setError', msg)
            return { success: false, message: msg }
          }

          // Create profile row in public.profiles table
          const profile = {
            id: authUser.id,
            email: normalizedEmail,
            name: userData.name || '',
            nickname: userData.nickname || '',
            unit: userData.unit || '',
            role: 'user',
            status: 'pending',
            created_at: new Date().toISOString()
          }

          console.log('[REGISTER] Creating profile:', profile)
          const { data: profData, error: insErr } = await supabase
            .from('profiles')
            .upsert([profile], { onConflict: 'id' })

          if (insErr) {
            // If profile insert fails but auth succeeded, user can still login
            console.error('[REGISTER] Profile insert error:', insErr.message)
            console.warn('[REGISTER] Auth succeeded but profile failed — user may still login')
            commit('setError', null)
            return {
              success: true,
              message: 'ลงทะเบียนสำเร็จ (แต่ข้อมูลอื่นยังรอการประมวลผล) รอการอนุมัติจากผู้ดูแลระบบ'
            }
          }

          console.log('[REGISTER] Success:', { userId: authUser.id, email: normalizedEmail })
          commit('setError', null)
          return { success: true, message: 'ลงทะเบียนสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ' }
        } else {
          const result = await axios.post(`${API_BASE}?action=register`, userData)
          const response = result.data
          commit('setError', null)
          return response
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'ไม่สามารถเชื่อมต่อ backend'
        console.error('[REGISTER] Exception:', errorMessage)
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
