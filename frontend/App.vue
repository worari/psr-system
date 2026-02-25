<template>
  <div id="app" class="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.)</h1>
        <div class="navbar-menu">
          <router-link to="/dashboard" class="nav-link">หน้าหลัก</router-link>
          <router-link to="/requests" class="nav-link">คำขอ</router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-link admin-link">ผู้ดูแลระบบ</router-link>
          <button @click="logout" class="nav-link logout-btn">ออกจากระบบ</button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2026 ระบบเสนอขอบำเหน็จความชอบ (พ.ส.ร.) | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin'])
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.navbar-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

.admin-link {
  background: rgba(255, 195, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.logout-btn {
  background: rgba(255, 59, 48, 0.3);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.logout-btn:hover {
  background: rgba(255, 59, 48, 0.5);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.footer {
  background: #f5f5f5;
  text-align: center;
  padding: 2rem;
  border-top: 1px solid #ddd;
  color: #666;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-menu {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-link {
    display: block;
    text-align: center;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
