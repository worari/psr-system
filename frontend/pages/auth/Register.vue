<template>
  <div class="register-container">
    <div class="register-box">
      <div v-if="useMockApi" class="mock-api-banner">
        ⚠️ <strong>ใช้ Mock API (ทดสอบ)</strong><br>
        Backend ยังไม่ได้การ connect ใช้ข้อมูลจำลองสำหรับทดสอบแทน
      </div>

      <div v-if="mockUsers" class="mock-users-info">
        <strong>🔐 Test Accounts:</strong>
        <div>✉️ admin@test.com / 🔑 admin123 (Admin)</div>
        <div>✉️ user@test.com / 🔑 user1234 (User)</div>
      </div>

      <h1>ลงทะเบียน</h1>
      <p class="subtitle">ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)</p>

      <form @submit.prevent="handleRegister">
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
          <label for="name">ชื่อจริง:</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="form-input"
            required
            placeholder="ชื่อจริง"
          />
        </div>

        <div class="form-group">
          <label for="nickname">ชื่อเล่น:</label>
          <input
            v-model="form.nickname"
            type="text"
            id="nickname"
            class="form-input"
            required
            placeholder="ชื่อเล่น"
          />
        </div>

        <div class="form-group">
          <label for="unit">สังกัด:</label>
          <input
            v-model="form.unit"
            type="text"
            id="unit"
            class="form-input"
            required
            placeholder="สังกัด"
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
          <small class="password-hint">ต้องมีอย่างน้อย 8 ตัวอักษร</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">ยืนยันรหัสผ่าน:</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            class="form-input"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน' }}
        </button>
      </form>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="links">
        <span>มีบัญชีอยู่แล้ว?</span>
        <router-link to="/login" class="link">เข้าสู่ระบบ</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        email: '',
        name: '',
        nickname: '',
        unit: '',
        password: '',
        confirmPassword: ''
      },
      error: null,
      success: null,
      useMockApi: !import.meta.env.VITE_GAS_DEPLOYMENT_ID || 
                   import.meta.env.VITE_GAS_DEPLOYMENT_ID.includes('DEFAULT_ID') ||
                   import.meta.env.VITE_GAS_DEPLOYMENT_ID.includes('PASTE_YOUR') ||
                   import.meta.env.VITE_GAS_DEPLOYMENT_ID.includes('macros/d/'),
      mockUsers: [
        { email: 'admin@test.com', password: 'admin123', role: 'Admin' },
        { email: 'user@test.com', password: 'user1234', role: 'User' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      this.error = null
      this.success = null

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'รหัสผ่านไม่ตรงกัน'
        return
      }

      if (this.form.password.length < 8) {
        this.error = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
        return
      }

      try {
        const response = await this.register(this.form)
        if (response.success) {
          this.success = response.message
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          this.error = response.message
        }
      } catch (error) {
        // Check if it's a network error (backend not connected)
        if (error.message.includes('Network') || error.code === 'ERR_NETWORK') {
          this.error = '⚠️ Backend ยังไม่ได้เชื่อมต่อ\n\nกรุณาตั้งค่า Google Apps Script:\n1. ตั้ง VITE_GAS_DEPLOYMENT_ID ใน .env.local\n2. Deploy Google Apps Script โดยเข้าไป https://script.google.com'
        } else {
          this.error = 'เกิดข้อผิดพลาด: ' + error.message
        }
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
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
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-hint {
  display: block;
  margin-top: 0.3rem;
  color: #999;
  font-size: 0.85rem;
}

.mock-api-banner {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.mock-users-info {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #e7f3ff;
  color: #0066cc;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.5;
}

.mock-users-info div {
  margin: 0.3rem 0;
  font-family: 'Courier New', monospace;
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
  margin-top: 1rem;
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

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;
  border-radius: 4px;
  text-align: center;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.link {
  color: #667eea;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: color 0.3s;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
