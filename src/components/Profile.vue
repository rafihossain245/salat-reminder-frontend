<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Update Profile</h2>
    <form @submit.prevent="updateProfile">
      <div class="mb-4 flex items-center">
        <label for="name" class="w-1/5 text-right pr-4">Name</label>
        <div class="w-4/5">
          <input type="text" class="w-full p-2 border border-gray-300 rounded" id="name" v-model="profile.name" placeholder="Name" required />
        </div>
      </div>
      <div class="mb-4 flex items-center">
        <label for="email" class="w-1/5 text-right pr-4">Email</label>
        <div class="w-4/5">
          <input type="email" class="w-full p-2 border border-gray-300 rounded" id="email" v-model="profile.email" placeholder="Email" required />
        </div>
      </div>
      <div class="mb-4 flex items-center">
        <label for="phone" class="w-1/5 text-right pr-4">Phone (WhatsApp)</label>
        <div class="w-4/5">
          <input type="text" class="w-full p-2 border border-gray-300 rounded" id="phone" v-model="profile.phone" placeholder="Phone (WhatsApp)" />
        </div>
      </div>
      <div class="mb-4 flex items-center">
        <label for="district" class="w-1/5 text-right pr-4">Districts</label>
        <div class="w-4/5">
          <select class="w-full p-2 border border-gray-300 rounded" id="district" v-model="profile.district_id" required>
            <option value="">Select Districts</option>
            <option v-for="(district, districtId) in locations" :key="districtId" :value="districtId">{{ district.name }}</option>
          </select>
        </div>
      </div>
      <div class="mb-4 flex items-center">
        <label for="upazila" class="w-1/5 text-right pr-4">Upazila</label>
        <div class="w-4/5">
          <select class="w-full p-2 border border-gray-300 rounded" id="upazila" v-model="profile.upazila_id" required>
            <option value="">Select Upazila</option>
            <option v-for="(upazila, upazilaId) in filteredUpazilas" :key="upazilaId" :value="upazilaId">{{ upazila.name }}</option>
          </select>
        </div>
      </div>

      <div class="mb-4 flex items-center">
        <label for="notification_method" class="w-1/5 text-right pr-4">Notification Method</label>
        <div class="w-4/5">
          <select class="w-full p-2 border border-gray-300 rounded" id="notification_method" v-model="profile.notification_method" required>
            <option value="slack">Slack</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../../plugins/axios';

const profile = ref({
  name: '',
  email: '',
  phone: '',
  district_id: null,
  upazila_id: null,
});

const locations = ref({});

// Dynamically compute districts based on locations
const districts = computed(() => locations.value);

// Filter upazila based on selected district
const filteredUpazilas = computed(() => {
  const selectedDistrict = locations.value[profile.value.district_id];
  return selectedDistrict ? selectedDistrict.upazilas : {};
});

onMounted(async () => {
  try {
    const response = await apiClient.get('/profile');
    const userData = response.data.user;
    locations.value = response.data.locations; // Store locations data

    // Populate the profile fields with fetched data
    profile.value = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      district_id: userData.district_id || null,
      upazila_id: userData.upazila_id || null,
      notification_method: userData.notification_method,
    };

  } catch (error) {
    alert('Failed to load user data.');
  }
});

const updateProfile = async () => {
  try {
    const payload = {
      name: profile.value.name,
      email: profile.value.email,
      phone: profile.value.phone,
      district_id: profile.value.district_id,
      upazila_id: profile.value.upazila_id,
      notification_method: profile.value.notification_method,
    };
    await apiClient.put('/profile', payload); // Update user data
    alert('Profile updated successfully!');
  } catch (error) {
    alert('Failed to update profile.');
  }
};
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>