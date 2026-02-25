<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <h1>ตั้งรหัสผ่านใหม่</h1>

      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="newPassword">รหัสผ่านใหม่:</label>
          <input
            v-model="form.newPassword"
            type="password"
            id="newPassword"
            class="form-input"
            required
            placeholder="••••••••"
          />
          <small class="password-hint">ต้องมีอย่างน้อย 8 ตัวอักษร</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">ยืนยันรหัสผ่านใหม่:</label>
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
          {{ loading ? 'กำลังตั้งรหัสผ่าน...' : 'ตั้งรหัสผ่านใหม่' }}
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
  name: 'ResetPassword',
  data() {
    return {
      form: {
        newPassword: '',
        confirmPassword: ''
      },
      error: null,
      success: null
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['resetPassword']),
    async handleResetPassword() {
      this.error = null
      this.success = null

      if (this.form.newPassword !== this.form.confirmPassword) {
        this.error = 'รหัสผ่านไม่ตรงกัน'
        return
      }

      if (this.form.newPassword.length < 8) {
        this.error = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
        return
      }

      try {
        const response = await this.resetPassword({
          token: this.$route.params.token,
          newPassword: this.form.newPassword
        })
        if (response.success) {
          this.success = response.message
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
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
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.reset-password-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 1.5rem;
  color: #333;
  text-align: center;
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

.password-hint {
  display: block;
  margin-top: 0.3rem;
  color: #999;
  font-size: 0.85rem;
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
