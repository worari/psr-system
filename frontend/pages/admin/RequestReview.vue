<template>
  <div class="request-review-page">
    <div class="header">
      <router-link to="/admin" class="btn-back">← กลับ</router-link>
      <h1>พิจารณาคำขอ - {{ requestId }}</h1>
    </div>

    <div class="content-grid">
      <div class="main-content">
        <!-- Request Details -->
        <section class="section">
          <h2>ข้อมูลคำขอ</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">สถานะ:</span>
              <span :class="['value', 'status-' + request.status]">
                {{ getStatusLabel(request.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">วันที่ส่ง:</span>
              <span class="value">{{ formatDate(request.submittedDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">ผู้ยื่นคำขอ:</span>
              <span class="value">{{ request.submitterName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">สังกัด:</span>
              <span class="value">{{ request.affiliation }}</span>
            </div>
            <div class="detail-row">
              <span class="label">ประเภทภารกิจ:</span>
              <span class="value">{{ request.missionType }}</span>
            </div>
            <div class="detail-row">
              <span class="label">พื้นที่:</span>
              <span class="value">{{ request.area }}</span>
            </div>
          </div>
        </section>

        <!-- Beneficiaries -->
        <section class="section">
          <h2>รายชื่อบุคคล</h2>
          <div class="beneficiaries-table">
            <table>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ยศ-ชื่อ-สกุล</th>
                  <th>ตำแหน่ง</th>
                  <th>สูญเสีย</th>
                  <th>เสนอบำเหน็จ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(person, index) in beneficiaries" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ person.rank }} {{ person.firstName }} {{ person.lastName }}</td>
                  <td>{{ person.position }}</td>
                  <td :class="'loss-type-' + person.lossType">
                    {{ getLossTypeLabel(person.lossType) }}
                  </td>
                  <td>{{ person.benefitLevel }} ขั้น</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Review Comments -->
        <section class="section">
          <h2>ความเห็นของผู้ตรวจสอบ</h2>
          <div class="form-group">
            <label>ข้อเห็น/ข้อสังเกต:</label>
            <textarea
              v-model="reviewData.comment"
              class="form-input"
              rows="4"
              placeholder="กรุณาระบุข้อเห็นหรือข้อสังเกต"
            ></textarea>
          </div>

          <div class="form-group">
            <label>การตัดสินใจ:</label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="reviewData.decision" type="radio" value="approved" />
                <span>อนุมัติ</span>
              </label>
              <label class="radio-label">
                <input v-model="reviewData.decision" type="radio" value="request-change" />
                <span>ขอให้แก้ไข</span>
              </label>
              <label class="radio-label">
                <input v-model="reviewData.decision" type="radio" value="rejected" />
                <span>ปฏิเสธ</span>
              </label>
            </div>
          </div>

          <div v-if="reviewData.decision === 'approved'" class="form-group">
            <label>ระบุจำนวนขั้นบำเหน็จ:</label>
            <div class="benefit-selector">
              <div v-for="person in beneficiaries" :key="person.id" class="person-benefit">
                <span>{{ person.firstName }} {{ person.lastName }}:</span>
                <select v-model="person.approvedBenefitLevel" class="form-input">
                  <option value="4">4 ขั้น</option>
                  <option value="3">3 ขั้น</option>
                  <option value="2">2 ขั้น</option>
                  <option value="1">1 ขั้น</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <section class="section actions">
          <button @click="submitReview('approved')" class="btn-approve">
            ✓ อนุมัติและบันทึก
          </button>
          <button @click="submitReview('rejected')" class="btn-reject">
            ✕ ปฏิเสธและบันทึก
          </button>
          <button @click="goBack" class="btn-cancel">
            ยกเลิก
          </button>
        </section>
      </div>

      <!-- Review History Sidebar -->
      <aside class="sidebar">
        <div class="history-section">
          <h3>ประวัติการพิจารณา</h3>
          <div class="history-list">
            <div
              v-for="(entry, index) in reviewHistory"
              :key="index"
              class="history-item"
            >
              <div class="history-date">{{ formatDate(entry.date) }}</div>
              <div class="history-reviewer">{{ entry.reviewer }}</div>
              <div class="history-action">{{ entry.action }}</div>
              <div v-if="entry.comment" class="history-comment">
                {{ entry.comment }}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestReview',
  data() {
    return {
      requestId: 'PSR-2026021501',
      request: {
        id: 'PSR-2026021501',
        status: 'pending',
        submittedDate: new Date(2026, 1, 21),
        submitterName: 'สมชาย เก่งกำลัง',
        affiliation: 'สถานีทหารประจำจังหวัดตราด',
        missionType: 'ป้องกันประเทศ',
        area: 'ปราสาทตาเมือน'
      },
      beneficiaries: [
        {
          id: 1,
          rank: 'พ.ตท.',
          firstName: 'สมชาย',
          lastName: 'เก่งกำลัง',
          position: 'นักรบ',
          lossType: 'severe',
          benefitLevel: '4',
          approvedBenefitLevel: '4'
        },
        {
          id: 2,
          rank: 'พ.ต.',
          firstName: 'สมศรี',
          lastName: 'ใจกล้า',
          position: 'ยานุยการ',
          lossType: 'major',
          benefitLevel: '3',
          approvedBenefitLevel: '3'
        }
      ],
      reviewData: {
        comment: '',
        decision: 'approved'
      },
      reviewHistory: [
        {
          date: new Date(2026, 1, 21),
          reviewer: 'สมหมาย ผู้อพยพ',
          action: 'ส่งคำขอ',
          comment: ''
        },
        {
          date: new Date(2026, 1, 22),
          reviewer: 'ผู้บัญชาการ สมมติ',
          action: 'อยู่ระหว่างตรวจสอบ',
          comment: 'ตรวจสอบเอกสารเบื้องต้น'
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
        pending: 'รอการพิจารณา',
        approved: 'อนุมัติแล้ว',
        rejected: 'ปฏิเสธ',
        revision: 'ขอให้แก้ไข'
      }
      return labels[status] || status
    },
    getLossTypeLabel(type) {
      const labels = {
        disabled: 'พิการทุพพลภาพ',
        severe: 'บาดเจ็บสาหัส',
        major: 'บาดเจ็บมาก',
        minor: 'บาดเจ็บน้อย'
      }
      return labels[type] || type
    },
    submitReview(decision) {
      if (!this.reviewData.comment.trim()) {
        alert('กรุณาระบุข้อเห็น')
        return
      }

      const actionLabel = decision === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'
      if (confirm(`${actionLabel}คำขอนี้ใหม่?`)) {
        alert(actionLabel + 'สำเร็จ')
        this.$router.push('/admin')
      }
    },
    goBack() {
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
.request-review-page {
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
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
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

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.benefit-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.person-benefit {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.person-benefit span {
  flex: 1;
  color: #333;
}

.person-benefit .form-input {
  flex: 1;
  min-width: 150px;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-approve,
.btn-reject,
.btn-cancel {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.3s;
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

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.sidebar {
  display: flex;
  flex-direction: column;
}

.history-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-section h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  padding: 1rem;
  background: #f9f9f9;
  border-left: 3px solid #667eea;
  border-radius: 3px;
}

.history-date {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.history-reviewer {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.history-action {
  color: #666;
  margin-bottom: 0.25rem;
}

.history-comment {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .sidebar {
    order: -1;
  }
}
</style>
