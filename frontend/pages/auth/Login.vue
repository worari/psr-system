<template>
  <div class="login-container">
    <div class="login-box">
      <h1>เข้าสู่ระบบ</h1>
      <p class="subtitle">ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">อีเมล:</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="form-input"
            required
            placeholder="example@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">รหัสผ่าน:</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="form-input"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="links">
        <router-link to="/forgot-password" class="link">ลืมรหัสผ่าน?</router-link>
        <span class="divider">|</span>
        <router-link to="/register" class="link">ลงทะเบียนใหม่</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.error = null
      try {
        const response = await this.login(this.form)
        if (response.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = response.message
        }
      } catch (error) {
        this.error = 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 0.5rem;
  color: #333;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 4px;
  text-align: center;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.divider {
  margin: 0 0.5rem;
  color: #ddd;
}
</style>
