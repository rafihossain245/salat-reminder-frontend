<template>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Admin Settings</h2>
      <form @submit.prevent="updateSettings">
        <!-- SMTP Settings -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">SMTP Host</label>
          <input type="text" v-model="settings.smtp_host" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">SMTP Port</label>
          <input type="text" v-model="settings.smtp_port" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">SMTP Username</label>
          <input type="text" v-model="settings.smtp_username" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">SMTP Password</label>
          <input type="password" v-model="settings.smtp_password" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <!-- Slack Webhook -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Slack Webhook URL</label>
          <input type="text" v-model="settings.slack_webhook_url" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <!-- WhatsApp Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">WhatsApp Number</label>
          <input type="text" v-model="settings.whatsapp_number" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <!-- Telegram Bot Token -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Telegram Bot Token</label>
          <input type="text" v-model="settings.telegram_bot_token" class="mt-1 block w-full p-2 border border-gray-300 rounded" />
        </div>
  
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Save Settings</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import apiClient from '../../plugins/axios';
  
  const settings = ref({
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    slack_webhook_url: '',
    whatsapp_number: '',
    telegram_bot_token: '',
  });
  
  onMounted(async () => {
    try {
      const response = await apiClient.get('/settings');
      settings.value = response.data.settings;
    } catch (error) {
      alert('Failed to load settings.');
    }
  });
  
  const updateSettings = async () => {
    try {
      await apiClient.put('/settings', settings.value);
      alert('Settings updated successfully.');
    } catch (error) {
      alert('Failed to update settings.');
    }
  };
  </script>
  
  <style scoped>
  /* No additional styles needed as Tailwind CSS is used */
  </style>