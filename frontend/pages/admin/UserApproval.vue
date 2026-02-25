<template>
  <div class="user-approval-page">
    <div class="header">
      <router-link to="/admin" class="btn-back">← กลับ</router-link>
      <h1>อนุมัติการใช้งาน</h1>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาอีเมล..."
        class="search-input"
      />
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-state">
      <p>ไม่มีผู้ใช้ที่รอการอนุมัติ</p>
    </div>

    <div v-else class="users-grid">
      <div
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="user-card"
      >
        <div class="user-header">
          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>

        <div class="user-details">
          <div class="detail-row">
            <span class="label">ชื่อเล่น:</span>
            <span class="value">{{ user.nickname }}</span>
          </div>
          <div class="detail-row">
            <span class="label">สังกัด:</span>
            <span class="value">{{ user.unit }}</span>
          </div>
          <div class="detail-row">
            <span class="label">วันที่ขอ:</span>
            <span class="value">{{ formatDate(user.registeredDate) }}</span>
          </div>
        </div>

        <div class="user-actions">
          <button @click="approveUser(index)" class="btn-approve">
            ✓ อนุมัติ
          </button>
          <button @click="showRejectReason(index)" class="btn-reject">
            ✕ ปฏิเสธ
          </button>
        </div>

        <!-- Rejection Form -->
        <div v-if="rejectingUserId === index" class="rejection-form">
          <textarea
            v-model="rejectionReason"
            placeholder="กรุณาระบุเหตุผลในการปฏิเสธ"
            class="reason-input"
            rows="3"
          ></textarea>
          <div class="form-actions">
            <button @click="cancelReject" class="btn-cancel">ยกเลิก</button>
            <button @click="confirmReject(index)" class="btn-confirm">ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserApproval',
  data() {
    return {
      searchQuery: '',
      rejectingUserId: null,
      rejectionReason: '',
      pendingUsers: [
        {
          name: 'สมชาย เก่งกำลัง',
          email: 'somchai@example.com',
          nickname: 'ชาย',
          unit: 'สถานีทหารประจำจังหวัดตราด',
          registeredDate: new Date(2026, 1, 20)
        },
        {
          name: 'สมศรี ใจกล้า',
          email: 'somsri@example.com',
          nickname: 'ศรี',
          unit: 'บังเหียน',
          registeredDate: new Date(2026, 1, 19)
        },
        {
          name: 'สมยง เก่งค้น',
          email: 'somyong@example.com',
          nickname: 'ยอง',
          unit: 'สถานีทหารประจำจังหวัดสระแก้ว',
          registeredDate: new Date(2026, 1, 18)
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.pendingUsers.filter(user =>
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    approveUser(index) {
      if (confirm(`อนุมัติการใช้งานสำหรับ ${this.pendingUsers[index].name}?`)) {
        alert('อนุมัติสำเร็จ')
        this.pendingUsers.splice(index, 1)
      }
    },
    showRejectReason(index) {
      this.rejectingUserId = index
      this.rejectionReason = ''
    },
    cancelReject() {
      this.rejectingUserId = null
      this.rejectionReason = ''
    },
    confirmReject(index) {
      if (!this.rejectionReason.trim()) {
        alert('กรุณาระบุเหตุผลการปฏิเสธ')
        return
      }

      if (confirm(`ปฏิเสธการใช้งานสำหรับ ${this.pendingUsers[index].name}?`)) {
        alert('ปฏิเสธสำเร็จ')
        this.pendingUsers.splice(index, 1)
        this.rejectingUserId = null
        this.rejectionReason = ''
      }
    }
  }
}
</script>

<style scoped>
.user-approval-page {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #e0e0e0;
}

h1 {
  color: #333;
  margin: 0;
}

.filters {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  color: #666;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.user-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-header {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.user-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.email {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.user-details {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f9f9f9;
  border-top: 1px solid #f0f0f0;
}

.btn-approve,
.btn-reject {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-approve:hover {
  opacity: 0.9;
}

.btn-reject {
  background: #dc3545;
  color: white;
}

.btn-reject:hover {
  opacity: 0.9;
}

.rejection-form {
  padding: 1rem 1.5rem;
  background: #fff8dc;
  border-top: 2px solid #ffc107;
}

.reason-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;
}

.reason-input:focus {
  outline: none;
  border-color: #ffc107;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: #ffc107;
  color: #333;
}

.btn-confirm:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-actions {
    flex-direction: column;
  }
}
</style>
