<template>
  <div class="flex flex-col w-screen h-screen font-sans">
    <!-- Header -->
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl">Dashboard</h1>
      <img src="" alt="User Logo" class="h-10 w-10 rounded-full" />
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside :class="['bg-gray-800 text-white p-5 shadow-lg transition-all duration-300 overflow-hidden', isSidebarCollapsed ? 'w-16' : 'w-64', 'hidden lg:block']">
        <ul class="list-none p-0 m-0"> <!-- Hide on small screens -->
          <li @click="setActivePage('profile')" :class="['p-2 cursor-pointer rounded transition-colors', activePage === 'profile' ? 'bg-teal-500' : 'hover:bg-gray-700']">Profile</li>
          <li @click="setActivePage('schedules')" :class="['p-2 cursor-pointer rounded transition-colors', activePage === 'schedules' ? 'bg-teal-500' : 'hover:bg-gray-700']">Schedules</li>
          <li @click="setActivePage('settings')" :class="['p-2 cursor-pointer rounded transition-colors', activePage === 'settings' ? 'bg-teal-500' : 'hover:bg-gray-700']">Settings</li>
          <li @click="logout" class="mt-5 text-red-500 cursor-pointer hover:bg-red-700 p-2 rounded">Logout</li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-5 overflow-y-auto">
        <h1 class="mb-5">{{ pageTitle }}</h1>
        <component :is="activeComponent" />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center flex justify-around block lg:hidden"> <!-- Show on small screens -->
      <button @click="setActivePage('profile')" class="p-2">Profile</button>
      <button @click="setActivePage('schedules')" class="p-2">Schedules</button>
      <button @click="setActivePage('settings')" class="p-2">Settings</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Profile from './Profile.vue';
import Schedules from './Schedules.vue';
import AdminSettings from './AdminSettings.vue';
import { useRouter } from 'vue-router';
import apiClient from '../../plugins/axios';

const router = useRouter();

// Active page state
const activePage = ref('profile');

// Components mapping
const components = {
  profile: Profile,
  schedules: Schedules,
  settings: AdminSettings,
};

// Computed property to dynamically load the active component
const activeComponent = computed(() => components[activePage.value]);

// Computed property for the page title
const pageTitle = computed(() => {
  switch (activePage.value) {
    case 'profile':
      return 'Profile';
    case 'schedules':
      return 'Schedules';
    case 'settings':
      return 'AdminSettings';
    default:
      return '';
  }
});

// Set the active page
const setActivePage = (page) => {
  activePage.value = page;
};

// Logout functionality
const logout = async () => {
  try {
    await apiClient.post('/logout'); // Call logout endpoint
    localStorage.removeItem('token'); // Clear token from local storage
    delete apiClient.defaults.headers.common['Authorization']; // Remove Authorization header

    router.push('/login'); // Redirect to login page
  } catch (error) {
    alert('Failed to logout.');
  }
};

// Sidebar collapse state
const isSidebarCollapsed = ref(false);

// Toggle sidebar collapse
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>