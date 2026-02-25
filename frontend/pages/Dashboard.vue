<template>
  <div class="dashboard">
    <h1>ยินดีต้อนรับ {{ currentUser?.name }}</h1>
    
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-icon">📋</div>
        <h2>คำขอของฉัน</h2>
        <p class="card-value">{{ userRequests }}</p>
        <router-link to="/requests" class="btn-card">ดูรายการ</router-link>
      </div>

      <div class="card">
        <div class="card-icon">✅</div>
        <h2>อนุมัติแล้ว</h2>
        <p class="card-value">{{ approvedRequests }}</p>
        <router-link to="/requests?status=approved" class="btn-card">ดูรายการ</router-link>
      </div>

      <div class="card">
        <div class="card-icon">⏳</div>
        <h2>รอการพิจารณา</h2>
        <p class="card-value">{{ pendingRequests }}</p>
        <router-link to="/requests?status=pending" class="btn-card">ดูรายละเอียด</router-link>
      </div>

      <div class="card">
        <div class="card-icon">➕</div>
        <h2>สร้างคำขอใหม่</h2>
        <p class="card-subtitle">เสนอขอบำเหน็จความชอบใหม่</p>
        <router-link to="/requests/create" class="btn-card btn-primary">เริ่มต้น</router-link>
      </div>
    </div>

    <div v-if="recentRequests.length > 0" class="recent-section">
      <h2>คำขอล่าสุด</h2>
      <table class="requests-table">
        <thead>
          <tr>
            <th>หมายเลขคำขอ</th>
            <th>วันที่สร้าง</th>
            <th>สถานะ</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in recentRequests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ formatDate(request.createdDate) }}</td>
            <td>
              <span :class="['status-badge', 'status-' + request.status]">
                {{ request.status }}
              </span>
            </td>
            <td>
              <router-link :to="`/requests/${request.id}`" class="link">ดูรายละเอียด</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      userRequests: 5,
      approvedRequests: 3,
      pendingRequests: 2,
      recentRequests: [
        {
          id: 'PSR-2026021401',
          createdDate: new Date(2026, 1, 14),
          status: 'approved'
        },
        {
          id: 'PSR-2026021301',
          createdDate: new Date(2026, 1, 13),
          status: 'pending'
        },
        {
          id: 'PSR-2026021101',
          createdDate: new Date(2026, 1, 11),
          status: 'draft'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h2 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.2rem;
}

.card-value {
  font-size: 2.5rem;
  color: #667eea;
  font-weight: bold;
  margin: 0.5rem 0;
}

.card-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-card {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: #f0f0f0;
  color: #667eea;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #ddd;
}

.btn-card:hover {
  background: #e0e0e0;
}

.btn-card.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-card.btn-primary:hover {
  opacity: 0.9;
}

.recent-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.requests-table {
  width: 100%;
  border-collapse: collapse;
}

.requests-table th {
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.requests-table td {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.requests-table tr:hover {
  background: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-draft {
  background: #e2e3e5;
  color: #383d41;
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

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .requests-table {
    font-size: 0.9rem;
  }

  .requests-table th,
  .requests-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
