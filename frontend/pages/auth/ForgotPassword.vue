<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <h1>ลืมรหัสผ่าน</h1>
      <p class="subtitle">ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)</p>

      <form @submit.prevent="handleForgotPassword">
        <p class="instruction">
          กรุณากรอกอีเมลของคุณ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้
        </p>

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

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'กำลังส่ง...' : 'ส่งลิงก์ตั้งรหัสผ่านใหม่' }}
        </button>
      </form>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="links">
        <router-link to="/login" class="link">กลับไปเข้าสู่ระบบ</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      form: {
        email: ''
      },
      error: null,
      success: null
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['forgotPassword']),
    async handleForgotPassword() {
      this.error = null
      this.success = null

      try {
        const response = await this.forgotPassword(this.form.email)
        if (response.success) {
          this.success = response.message
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
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.forgot-password-box {
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
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.instruction {
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
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
</style>
