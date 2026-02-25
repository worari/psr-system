import { createStore } from 'vuex'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_GAS_DEPLOYMENT_ID

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
        const response = await axios.post(`${API_BASE}?action=login`, { email, password })
        if (response.data.success) {
          commit('setUser', response.data.user)
          commit('setError', null)
          return response.data
        } else {
          commit('setError', response.data.message)
          return response.data
        }
      } catch (error) {
        commit('setError', error.message)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },

    async register({ commit }, userData) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`${API_BASE}?action=register`, userData)
        commit('setError', null)
        return response.data
      } catch (error) {
        commit('setError', error.message)
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
        const response = await axios.post(`${API_BASE}?action=getMasterData`)
        commit('setMasterData', response.data)
        commit('setError', null)
        return response.data
      } catch (error) {
        commit('setError', error.message)
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
