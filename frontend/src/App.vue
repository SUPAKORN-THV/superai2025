<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="!isAuthPage" />
    <main :class="{ 'pt-16': !isAuthPage }">
      <router-view />
    </main>
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return ['Login', 'Register'].includes(route.name)
})

onMounted(() => {
  authStore.checkAuth()
})
</script>
