<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        />
        <input
          v-model="formData.password"
          type="password"
          placeholder="Password"
          required
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isLoading"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="inline-block mr-2">
            <!-- Simple loading spinner -->
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p class="text-center mt-4">
        Don't have an account?
        <a href="#" @click.prevent="goToRegister" class="text-blue-500 hover:underline">Register here</a>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../../plugins/axios';

const formData = reactive({
  email: '',
  password: '',
});

const router = useRouter();
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.post('/login', formData);
    
    const token = response.data.token;
    localStorage.setItem('auth_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    alert('Login successfully!');
    router.push('/dashboard');
  } catch (error) {
    alert('Invalid creadentials!');
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>