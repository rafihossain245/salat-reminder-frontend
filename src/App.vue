<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../plugins/axios';

const router = useRouter();

onMounted(async () => {
    try {
        // Check if the user is authenticated
        await apiClient.get('/user');
    } catch (error) {
        // Redirect to login if not authenticated
        router.push('/login');
    }
});
</script>
