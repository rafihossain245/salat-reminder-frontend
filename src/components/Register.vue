<template>
  <div class="register-container max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-md">
    <h1 class="text-center text-2xl font-bold mb-6">Register</h1>
    <form @submit.prevent="register">
      <input v-model="formData.name" placeholder="Name" required class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <input v-model="formData.email" placeholder="Email" required class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <input v-model="formData.phone" placeholder="Phone (WhatsApp)" class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <input v-model="formData.slack_webhook_url" placeholder="Slack Webhook URL" class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <input v-model="formData.city" placeholder="City" required class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <input v-model="formData.country" placeholder="Country" required class="block w-full p-2 mb-4 border border-gray-300 rounded" />
      <button type="submit" class="block w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">Register</button>
    </form>
    <p class="text-center mt-4">
      Already have an account? <a href="#" @click="goToLogin" class="text-green-500 hover:underline">Login here</a>.
    </p>
  </div>
</template>
  
<script setup>
  import { reactive } from 'vue';
  import apiClient from '../../plugins/axios';
  import { useRouter } from 'vue-router';
  
  const formData = reactive({
    name: '',
    email: '',
    phone: '',
    slack_webhook_url: '',
    city: '',
    country: '',
  });
  
  const router = useRouter();
  
  const register = async () => {
    try {
      const response = await apiClient.post('/register', formData);
      alert(response.data.message);
      router.push('/login');
    } catch (error) {
      alert('Error registering user.');
    }
  };
  
  // Navigate to the login page
  const goToLogin = () => {
    router.push('/login');
  };
</script>
  
<style scoped>
  
</style>