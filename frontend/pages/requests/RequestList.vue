<template>
  <div class="requests-page">
    <h1>คำขอของฉัน</h1>

    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาหมายเลขคำขอ..."
          class="search-input"
        />
      </div>
      <router-link to="/requests/create" class="btn-new">+ สร้างคำขอใหม่</router-link>
    </div>

    <div v-if="filteredRequests.length === 0" class="empty-state">
      <p>ไม่พบคำขอ</p>
      <router-link to="/requests/create" class="btn-new">สร้างคำขอใหม่</router-link>
    </div>

    <div v-else class="requests-list">
      <div
        v-for="request in filteredRequests"
        :key="request.id"
        class="request-card"
      >
        <div class="request-header">
          <h3>{{ request.id }}</h3>
          <span :class="['status-badge', 'status-' + request.status]">
            {{ getStatusLabel(request.status) }}
          </span>
        </div>

        <div class="request-info">
          <div class="info-row">
            <span class="label">วันที่สร้าง:</span>
            <span class="value">{{ formatDate(request.createdDate) }}</span>
          </div>
          <div class="info-row">
            <span class="label">สังกัด:</span>
            <span class="value">{{ request.affiliation }}</span>
          </div>
          <div class="info-row">
            <span class="label">ประเภทภารกิจ:</span>
            <span class="value">{{ request.missionType }}</span>
          </div>
          <div class="info-row">
            <span class="label">จังหวัด:</span>
            <span class="value">{{ request.province }}</span>
          </div>
          <div class="info-row">
            <span class="label">บุคคล:</span>
            <span class="value">{{ request.beneficiaryCount }} คน</span>
          </div>
        </div>

        <div class="request-actions">
          <router-link
            :to="`/requests/${request.id}`"
            class="btn-action btn-view"
          >
            ดูรายละเอียด
          </router-link>
          <button
            v-if="request.status === 'draft'"
            @click="editRequest(request.id)"
            class="btn-action btn-edit"
          >
            แก้ไข
          </button>
          <button
            v-if="request.status === 'draft'"
            @click="deleteRequest(request.id)"
            class="btn-action btn-delete"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestList',
  data() {
    return {
      searchQuery: '',
      requests: [
        {
          id: 'PSR-2026021401',
          createdDate: new Date(2026, 1, 14),
          status: 'approved',
          affiliation: 'สถานีทหารประจำจังหวัด',
          missionType: 'รักษาความสงบ',
          province: 'ตราด',
          beneficiaryCount: 2
        },
        {
          id: 'PSR-2026021301',
          createdDate: new Date(2026, 1, 13),
          status: 'pending',
          affiliation: 'สถานีทหารประจำจังหวัด',
          missionType: 'ป้องกันประเทศ',
          province: 'สระแก้ว',
          beneficiaryCount: 1
        },
        {
          id: 'PSR-2026021101',
          createdDate: new Date(2026, 1, 11),
          status: 'draft',
          affiliation: 'บังเหียน',
          missionType: 'บรรเทาสาธารณภัย',
          province: 'อุบลราชธานี',
          beneficiaryCount: 3
        }
      ]
    }
  },
  computed: {
    filteredRequests() {
      return this.requests.filter(r =>
        r.id.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    getStatusLabel(status) {
      const labels = {
        draft: 'ร่างค่า',
        pending: 'รอการพิจารณา',
        approved: 'อนุมัติแล้ว',
        rejected: 'ปฏิเสธ'
      }
      return labels[status] || status
    },
    editRequest(id) {
      this.$router.push(`/requests/${id}?edit=true`)
    },
    async deleteRequest(id) {
      if (confirm('ยืนยันการลบคำขอนี้?')) {
        // Delete logic
        this.requests = this.requests.filter(r => r.id !== id)
      }
    }
  }
}
</script>

<style scoped>
.requests-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  flex: 1;
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

.btn-new {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.3s;
}

.btn-new:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  color: #666;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.request-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.request-header h3 {
  margin: 0;
  color: #333;
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

.request-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.request-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-view {
  background: #f0f0f0;
  color: #667eea;
  border-color: #667eea;
}

.btn-view:hover {
  background: #667eea;
  color: white;
}

.btn-edit {
  background: #fff3cd;
  color: #856404;
  border-color: #ffc107;
}

.btn-edit:hover {
  background: #ffc107;
  color: #fff;
}

.btn-delete {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c2c7;
}

.btn-delete:hover {
  background: #f5c2c7;
  color: #721c24;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .request-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .request-actions {
    flex-wrap: wrap;
  }
}
</style>
