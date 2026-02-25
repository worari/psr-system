<template>
  <div class="request-detail-page">
    <div class="header">
      <router-link to="/requests" class="btn-back">← กลับ</router-link>
      <h1>{{ requestId }}</h1>
    </div>

    <div class="content-grid">
      <div class="main-content">
        <!-- Request Summary -->
        <section class="detail-section">
          <h2>ข้อมูลคำขอ</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">สถานะ:</span>
              <span :class="['value', 'status-' + currentRequest.status]">
                {{ getStatusLabel(currentRequest.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">วันที่สร้าง:</span>
              <span class="value">{{ formatDate(currentRequest.createdDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">สังกัด:</span>
              <span class="value">{{ currentRequest.affiliation }}</span>
            </div>
            <div class="detail-row">
              <span class="label">ประเภทภารกิจ:</span>
              <span class="value">{{ currentRequest.missionType }}</span>
            </div>
            <div class="detail-row">
              <span class="label">ยุทธการ:</span>
              <span class="value">{{ currentRequest.operation }}</span>
            </div>
            <div class="detail-row">
              <span class="label">พื้นที่:</span>
              <span class="value">{{ currentRequest.area }}</span>
            </div>
            <div class="detail-row">
              <span class="label">จังหวัด:</span>
              <span class="value">{{ currentRequest.province }}</span>
            </div>
          </div>
        </section>

        <!-- Beneficiaries -->
        <section class="detail-section">
          <h2>รายชื่อบุคคลที่ขอสิทธิ</h2>
          <div v-if="beneficiaries.length === 0" class="empty">
            <p>ไม่มีบุคคล</p>
          </div>
          <div v-else class="beneficiaries-table">
            <table>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ยศ</th>
                  <th>ชื่อ-สกุล</th>
                  <th>ตำแหน่ง</th>
                  <th>ประเภทสูญเสีย</th>
                  <th>เสนอบำเหน็จ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(person, index) in beneficiaries" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ person.rank }}</td>
                  <td>{{ person.firstName }} {{ person.lastName }}</td>
                  <td>{{ person.position }}</td>
                  <td :class="'loss-type-' + person.lossType">{{ getLossTypeLabel(person.lossType) }}</td>
                  <td>{{ person.benefitLevel }} ขั้น</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Timeline Sidebar -->
      <aside class="sidebar">
        <div class="timeline-section">
          <h2>ประวัติการพิจารณา</h2>
          <div class="timeline">
            <div
              v-for="(event, index) in timeline"
              :key="index"
              :class="['timeline-item', 'step-' + event.step]"
            >
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-action">{{ event.actionLabel }}</div>
                <div class="timeline-date">{{ formatDate(event.date) }}</div>
                <div v-if="event.reviewer" class="timeline-reviewer">
                  โดย {{ event.reviewer }}
                </div>
                <div v-if="event.comment" class="timeline-comment">
                  {{ event.comment }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <h3>การดำเนินการ</h3>
          <button
            v-if="currentRequest.status === 'draft'"
            @click="editRequest"
            class="btn-action btn-primary"
          >
            ✎ แก้ไข
          </button>
          <button
            v-if="currentRequest.status === 'draft'"
            @click="submitRequest"
            class="btn-action btn-submit"
          >
            ✓ ส่งคำขอ
          </button>
          <button
            v-if="currentRequest.status === 'draft'"
            @click="deleteRequest"
            class="btn-action btn-danger"
          >
            ✕ ลบ
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestDetail',
  data() {
    return {
      requestId: 'PSR-2026021401',
      currentRequest: {
        id: 'PSR-2026021401',
        createdDate: new Date(2026, 1, 14),
        status: 'approved',
        affiliation: 'สถานีทหารประจำจังหวัด',
        missionType: 'รักษาความสงบ',
        operation: 'ยุทธบดินทร์',
        area: 'ปราสาทตาเมือน',
        province: 'ตราด'
      },
      beneficiaries: [
        {
          rank: 'พ.ตท.',
          firstName: 'สมชาย',
          lastName: 'เก่งกำลัง',
          position: 'นักรบ',
          lossType: 'severe',
          benefitLevel: '4'
        },
        {
          rank: 'พ.ต.',
          firstName: 'สมศรี',
          lastName: 'ใจกล้า',
          position: 'ยานุยการ',
          lossType: 'major',
          benefitLevel: '3'
        }
      ],
      timeline: [
        {
          step: 1,
          action: 'received',
          actionLabel: 'ส่งคำขอ',
          date: new Date(2026, 1, 14),
          reviewer: '',
          comment: ''
        },
        {
          step: 2,
          action: 'review',
          actionLabel: 'อยู่ระหว่างการตรวจสอบ',
          date: new Date(2026, 1, 15),
          reviewer: 'ผู้บัญชาการ',
          comment: 'ตรวจสอบเอกสารเรียบร้อย'
        },
        {
          step: 3,
          action: 'approved',
          actionLabel: 'อนุมัติแล้ว',
          date: new Date(2026, 1, 16),
          reviewer: 'รองผู้บัญชาการ',
          comment: 'อนุมัติให้เสนอบำเหน็จ 4 ขั้น และ 3 ขั้น'
        }
      ]
    }
  },
  computed: {
    requestIdFromRoute() {
      return this.$route.params.id
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
    getLossTypeLabel(type) {
      const labels = {
        disabled: 'พิการทุพพลภาพ (สีเทา)',
        severe: 'บาดเจ็บสาหัส (สีแดง)',
        major: 'บาดเจ็บมาก (ส้ม)',
        minor: 'บาดเจ็บน้อย (เหลือง)'
      }
      return labels[type] || type
    },
    editRequest() {
      this.$router.push(`/requests/${this.requestId}?edit=true`)
    },
    submitRequest() {
      if (confirm('ยืนยันการส่งคำขอ?')) {
        alert('ส่งคำขอสำเร็จ')
        this.currentRequest.status = 'pending'
        this.timeline.push({
          step: 1,
          action: 'received',
          actionLabel: 'ส่งคำขอ',
          date: new Date(),
          reviewer: '',
          comment: ''
        })
      }
    },
    deleteRequest() {
      if (confirm('ยืนยันการลบคำขอ?')) {
        this.$router.push('/requests')
      }
    }
  }
}
</script>

<style scoped>
.request-detail-page {
  max-width: 1200px;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.status-draft { color: #6c757d; }
.status-pending { color: #ffc107; }
.status-approved { color: #28a745; }
.status-rejected { color: #dc3545; }

.beneficiaries-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background: #fafafa;
}

.loss-type-disabled { color: #999; }
.loss-type-severe { color: #dc3545; }
.loss-type-major { color: #fd7e14; }
.loss-type-minor { color: #ffc107; }

.empty {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-section,
.actions-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-section h2,
.actions-section h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ddd;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -10px;
  top: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #667eea;
}

.timeline-content {
  padding-left: 1rem;
}

.timeline-action {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.timeline-date {
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.timeline-reviewer {
  color: #666;
  font-size: 0.85rem;
}

.timeline-comment {
  color: #666;
  font-size: 0.85rem;
  background: #f9f9f9;
  padding: 0.5rem;
  border-radius: 3px;
  margin-top: 0.25rem;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-action {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: block;
  text-align: center;
  transition: opacity 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-action:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}
</style>
