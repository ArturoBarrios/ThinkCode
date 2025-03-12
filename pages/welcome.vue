<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-8">Welcome to Our Application, ThinkCode</h1>
    <p class="text-lg mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <div class="flex space-x-4">
      <button @click="goToSignUp" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Sign Up</button>
      <button @click="goToLogin" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">Login</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSignUp = () => {
  router.push('/signup')
}

const goToLogin = () => {
  router.push('/login')
}

</script>

<style scoped>
/* Add any additional styling here if needed */
</style>