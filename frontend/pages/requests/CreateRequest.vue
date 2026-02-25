<template>
  <div class="create-request-page">
    <h1>สร้างคำขอบำเหน็จความชอบ (พ.ส.ร.)</h1>

    <div class="form-container">
      <!-- Request Header Section -->
      <section class="form-section">
        <h2>ข้อมูลคำขอ</h2>
        
        <div class="form-row">
          <div class="form-group">
            <label>สังกัด:</label>
            <input
              v-model="form.affiliation"
              type="text"
              class="form-input"
              placeholder="กรอกหรือเลือกสังกัด"
              @focus="showAffiliationDropdown = true"
            />
            <div v-if="showAffiliationDropdown" class="dropdown">
              <div
                v-for="item in affiliations"
                :key="item"
                @click="selectAffiliation(item)"
                class="dropdown-item"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>ประเภทภารกิจ:</label>
            <select v-model="form.missionType" class="form-input">
              <option value="">-- เลือกประเภท --</option>
              <option value="maintenance">รักษาความสงบ</option>
              <option value="defense">แผนป้องกันประเทศ</option>
              <option value="special">จชต.</option>
              <option value="border">ป้องกันชายแดน</option>
              <option value="disaster">บรรเทาสาธารณภัย</option>
              <option value="normal">ปกติ</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>ยุทธการ:</label>
            <select v-model="form.operation" class="form-input">
              <option value="">-- เลือกยุทธการ --</option>
              <option value="border">ยุทธบดินทร์</option>
              <option value="century">ศตวรรษ</option>
            </select>
          </div>

          <div class="form-group">
            <label>พื้นที่:</label>
            <select v-model="form.area" class="form-input">
              <option value="">-- เลือกพื้นที่ --</option>
              <option value="thakoou">ช่องสายตะกู</option>
              <option value="pra">ปราสาทตาเมือน</option>
              <option value="krang">ช่องกร่าง</option>
              <option value="kwaai">ปราสาทตาควาย</option>
              <option value="jom">ช่องจอม</option>
              <option value="sangam">ช่องสะงำ</option>
              <option value="phumi">ภูมะเขือ</option>
              <option value="viharn">พระวิหาร</option>
              <option value="sattha">สัตตะโสม-ซำแต</option>
              <option value="anma">ช่องอ้านม้า</option>
              <option value="bok">ช่องบก</option>
              <option value="kao">ช่องตาเฒ่า</option>
              <option value="other">อื่นๆกรอกเอง</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>จังหวัด:</label>
            <input
              v-model="form.province"
              type="text"
              class="form-input"
              placeholder="กรอกหรือเลือกจังหวัด"
              @focus="showProvinceDropdown = true"
            />
            <div v-if="showProvinceDropdown" class="dropdown">
              <div
                v-for="item in provinces"
                :key="item"
                @click="selectProvince(item)"
                class="dropdown-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Beneficiaries Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>รายชื่อบุคคลที่ขอสิทธิ</h2>
          <button @click="addBeneficiary" class="btn-add">+ เพิ่มบุคคล</button>
        </div>

        <div v-if="beneficiaries.length === 0" class="empty-beneficiaries">
          <p>ยังไม่มีบุคคลที่เพิ่มเข้ามา กรุณากดปุ่ม "เพิ่มบุคคล"</p>
        </div>

        <div v-else class="beneficiaries-list">
          <div
            v-for="(beneficiary, index) in beneficiaries"
            :key="index"
            class="beneficiary-card"
          >
            <div class="beneficiary-header">
              <h3>บุคคลที่ {{ index + 1 }}</h3>
              <div class="beneficiary-actions">
                <button @click="editBeneficiary(index)" class="btn-icon">✎</button>
                <button @click="removeBeneficiary(index)" class="btn-icon btn-delete">✕</button>
              </div>
            </div>

            <div class="beneficiary-info">
              <div class="info-row">
                <span class="label">ยศ:</span>
                <span class="value">{{ beneficiary.rank }}</span>
              </div>
              <div class="info-row">
                <span class="label">ชื่อ-สกุล:</span>
                <span class="value">{{ beneficiary.firstName }} {{ beneficiary.lastName }}</span>
              </div>
              <div class="info-row">
                <span class="label">ตำแหน่ง:</span>
                <span class="value">{{ beneficiary.position }}</span>
              </div>
              <div class="info-row">
                <span class="label">ประเภทสูญเสีย:</span>
                <span class="value" :class="'loss-type-' + beneficiary.lossType">
                  {{ getLossTypeLabel(beneficiary.lossType) }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">เสนอบำเหน็จ:</span>
                <span class="value">{{ beneficiary.benefitLevel }} ขั้น</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal for Beneficiary Details -->
      <div v-if="showBeneficiaryModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ editingIndex !== null ? 'แก้ไขบุคคล' : 'เพิ่มบุคคลใหม่' }}</h2>
            <button @click="closeModal" class="btn-close">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>ยศ:</label>
                <input
                  v-model="currentBeneficiary.rank"
                  type="text"
                  class="form-input"
                  placeholder="กรอกหรือเลือกยศ"
                  @focus="showRankDropdown = true"
                />
                <div v-if="showRankDropdown" class="dropdown">
                  <div
                    v-for="item in ranks"
                    :key="item"
                    @click="selectRank(item)"
                    class="dropdown-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ชื่อจริง:</label>
                <input
                  v-model="currentBeneficiary.firstName"
                  type="text"
                  class="form-input"
                  placeholder="ชื่อจริง"
                />
              </div>
              <div class="form-group">
                <label>สกุล:</label>
                <input
                  v-model="currentBeneficiary.lastName"
                  type="text"
                  class="form-input"
                  placeholder="สกุล"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ตำแหน่ง:</label>
                <input
                  v-model="currentBeneficiary.position"
                  type="text"
                  class="form-input"
                  placeholder="กรอกหรือเลือกตำแหน่ง"
                  @focus="showPositionDropdown = true"
                />
                <div v-if="showPositionDropdown" class="dropdown">
                  <div
                    v-for="item in positions"
                    :key="item"
                    @click="selectPosition(item)"
                    class="dropdown-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ประเภทสูญเสีย:</label>
                <select v-model="currentBeneficiary.lossType" class="form-input">
                  <option value="">-- เลือกประเภท --</option>
                  <option value="disabled">พิการทุพพลภาพ (สีเทา)</option>
                  <option value="severe">บาดเจ็บสาหัส (สีแดง)</option>
                  <option value="major">บาดเจ็บมาก (ส้ม)</option>
                  <option value="minor">บาดเจ็บน้อย (เหลือง)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>เสนอบำเหน็จ:</label>
                <select v-model="currentBeneficiary.benefitLevel" class="form-input">
                  <option value="">-- เลือกขั้น --</option>
                  <option value="4">4 ขั้น</option>
                  <option value="3">3 ขั้น</option>
                  <option value="2">2 ขั้น</option>
                  <option value="1">1 ขั้น</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ปัจจุบันรับ พ.ส.ร. (เดือนละ):</label>
                <input
                  v-model="currentBeneficiary.currentBenefit"
                  type="number"
                  class="form-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>คำสั่งปฏิบัติหน้าที่:</label>
                <input
                  v-model="currentBeneficiary.orders"
                  type="text"
                  class="form-input"
                  placeholder="หมายเลขคำสั่ง"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ลงวันที่:</label>
                <input
                  v-model="currentBeneficiary.orderDate"
                  type="date"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>ออกโดย:</label>
                <input
                  v-model="currentBeneficiary.issuedBy"
                  type="text"
                  class="form-input"
                  placeholder="ชื่อผู้ออกคำสั่ง"
                  @focus="showIssuedByDropdown = true"
                />
                <div v-if="showIssuedByDropdown" class="dropdown">
                  <div
                    v-for="item in issuedByOptions"
                    :key="item"
                    @click="selectIssuedBy(item)"
                    class="dropdown-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>พฤติกรรมโดยย่อ:</label>
                <textarea
                  v-model="currentBeneficiary.behavior"
                  class="form-input"
                  placeholder="บรรยายเหตุการณ์โดยสังเขป"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">ยกเลิก</button>
            <button @click="saveBeneficiary" class="btn-save">บันทึก</button>
          </div>
        </div>
      </div>

      <!-- Submit Section -->
      <section class="form-section">
        <div class="form-actions">
          <button @click="saveDraft" class="btn-secondary">บันทึกเป็นร่างค่า</button>
          <button @click="submitRequest" class="btn-primary">ส่งคำขอ</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateRequest',
  data() {
    return {
      form: {
        affiliation: '',
        missionType: '',
        operation: '',
        area: '',
        province: ''
      },
      beneficiaries: [],
      currentBeneficiary: {
        rank: '',
        firstName: '',
        lastName: '',
        position: '',
        lossType: '',
        benefitLevel: '',
        currentBenefit: '',
        orders: '',
        orderDate: '',
        issuedBy: '',
        behavior: ''
      },
      showBeneficiaryModal: false,
      editingIndex: null,
      showAffiliationDropdown: false,
      showProvinceDropdown: false,
      showRankDropdown: false,
      showPositionDropdown: false,
      showIssuedByDropdown: false,
      affiliations: [
        'สถานีทหารประจำจังหวัด',
        'บังเหียน',
        'กำแพงเพชร',
        'สระแก้ว'
      ],
      provinces: [
        'ตราด',
        'สระแก้ว',
        'อุบลราชธานี',
        'สิรินธร',
        'ศรีสะเกษ',
        'ยโสธร'
      ],
      ranks: [
        'พ.ตท.',
        'พ.ต.',
        'นาย',
        'จ่าสิบ',
        'จ่าอ่วม',
        'ทหารชั้นโท',
        'ทหารชั้นเอก'
      ],
      positions: [
        'ผู้บัญชาการ',
        'หัวหน้าสายการณ์ยุทธวิธี',
        'หัวหน้าสายการณ์บริหาร',
        'นักรบ',
        'ยานุยการ'
      ],
      issuedByOptions: [
        'ผู้บัญชาการ',
        'รองผู้บัญชาการ',
        'หัวหน้าสายการณ์',
        'หัวหน้าแผนกบุคคล'
      ]
    }
  },
  methods: {
    selectAffiliation(item) {
      this.form.affiliation = item
      this.showAffiliationDropdown = false
    },
    selectProvince(item) {
      this.form.province = item
      this.showProvinceDropdown = false
    },
    selectRank(item) {
      this.currentBeneficiary.rank = item
      this.showRankDropdown = false
    },
    selectPosition(item) {
      this.currentBeneficiary.position = item
      this.showPositionDropdown = false
    },
    selectIssuedBy(item) {
      this.currentBeneficiary.issuedBy = item
      this.showIssuedByDropdown = false
    },
    addBeneficiary() {
      this.currentBeneficiary = {
        rank: '',
        firstName: '',
        lastName: '',
        position: '',
        lossType: '',
        benefitLevel: '',
        currentBenefit: '',
        orders: '',
        orderDate: '',
        issuedBy: '',
        behavior: ''
      }
      this.editingIndex = null
      this.showBeneficiaryModal = true
    },
    editBeneficiary(index) {
      this.currentBeneficiary = { ...this.beneficiaries[index] }
      this.editingIndex = index
      this.showBeneficiaryModal = true
    },
    saveBeneficiary() {
      if (!this.currentBeneficiary.firstName || !this.currentBeneficiary.lastName) {
        alert('กรุณากรอกชื่อและสกุล')
        return
      }

      if (this.editingIndex !== null) {
        this.beneficiaries[this.editingIndex] = { ...this.currentBeneficiary }
      } else {
        this.beneficiaries.push({ ...this.currentBeneficiary })
      }

      this.closeModal()
    },
    removeBeneficiary(index) {
      if (confirm('ยืนยันการลบบุคคลนี้?')) {
        this.beneficiaries.splice(index, 1)
      }
    },
    closeModal() {
      this.showBeneficiaryModal = false
      this.editingIndex = null
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
    saveDraft() {
      alert('บันทึกเป็นร่างค่าสำเร็จ')
      // Save to backend
    },
    submitRequest() {
      if (this.beneficiaries.length === 0) {
        alert('กรุณาเพิ่มบุคคลก่อนส่งคำขอ')
        return
      }

      if (!this.form.affiliation || !this.form.missionType || !this.form.province) {
        alert('กรุณากรอกข้อมูลคำขอให้ครบถ้วน')
        return
      }

      alert('ส่งคำขอสำเร็จ')
      this.$router.push('/requests')
    }
  }
}
</script>

<style scoped>
.create-request-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: -0.5rem;
}

.dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f0f0f0;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.3s;
}

.btn-add:hover {
  opacity: 0.9;
}

.empty-beneficiaries {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #666;
}

.beneficiaries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.beneficiary-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1.5rem;
  background: #fafafa;
  transition: box-shadow 0.3s;
}

.beneficiary-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.beneficiary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.beneficiary-header h3 {
  margin: 0;
  color: #333;
}

.beneficiary-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  transition: all 0.3s;
  border-radius: 4px;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.1);
}

.btn-icon.btn-delete:hover {
  background: #f8d7da;
  color: #721c24;
}

.beneficiary-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.loss-type-disabled { color: #999; }
.loss-type-severe { color: #dc3545; }
.loss-type-major { color: #fd7e14; }
.loss-type-minor { color: #ffc107; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #ddd;
}

.btn-cancel,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel:hover,
.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-save,
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.3s;
}

.btn-save:hover,
.btn-primary:hover {
  opacity: 0.9;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal {
    max-height: 95vh;
  }
}
</style>
