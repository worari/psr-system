<template>
  <div class="admin-dashboard">
    <h1>ผู้ดูแลระบบ</h1>

    <div class="admin-grid">
      <div class="card">
        <div class="card-icon">👤</div>
        <h2>ผู้ใช้รอการอนุมัติ</h2>
        <p class="card-value">{{ pendingUsersCount }}</p>
        <router-link to="/admin/users" class="btn-card">ตรวจสอบ</router-link>
      </div>

      <div class="card">
        <div class="card-icon">📋</div>
        <h2>คำขอรอการตรวจสอบ</h2>
        <p class="card-value">{{ pendingRequestsCount }}</p>
        <router-link to="/admin/requests" class="btn-card">ตรวจสอบ</router-link>
      </div>

      <div class="card">
        <div class="card-icon">✅</div>
        <h2>อนุมัติแล้ว</h2>
        <p class="card-value">{{ approvedCount }}</p>
      </div>

      <div class="card">
        <div class="card-icon">👥</div>
        <h2>จำนวนผู้ใช้ทั้งหมด</h2>
        <p class="card-value">{{ totalUsers }}</p>
      </div>
    </div>

    <div class="stats-section">
      <h2>สถิติการใช้งาน</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>คำขอเดือนนี้</h3>
          <p class="stat-value">{{ requestsThisMonth }}</p>
        </div>
        <div class="stat-card">
          <h3>คำขออนุมัติแล้ว</h3>
          <p class="stat-value">{{ requestsApproved }}</p>
        </div>
        <div class="stat-card">
          <h3>คำขอปฏิเสธ</h3>
          <p class="stat-value">{{ requestsRejected }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      pendingUsersCount: 3,
      pendingRequestsCount: 5,
      approvedCount: 24,
      totalUsers: 42,
      requestsThisMonth: 12,
      requestsApproved: 18,
      requestsRejected: 2
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.admin-grid {
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

.btn-card {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: #f0f0f0;
  color: #667eea;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  border: 1px solid #ddd;
  margin-top: 1rem;
}

.btn-card:hover {
  background: #667eea;
  color: white;
}

.stats-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
