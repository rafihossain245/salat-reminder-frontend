<template>
  <div class="p-6 bg-gray-100 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">SALAT TIMES</h2>

    <!-- Display City, Area, Current Time, Date, and Remaining Time -->
    <div class="mb-6">
      <p>{{ upazilaName }}, {{ districtName }}</p>
      <p>{{ currentTime }} - {{ currentDate }}</p>
      <p>Time Remaining: {{ timeRemaining }}</p>
      <p>Next Prayer: {{ nextPrayer }}</p>
    </div>

    <table class="w-full border-collapse mb-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2 text-left">Prayer Name</th>
          <th class="border p-2 text-left">Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, schedule) in schedules" class="hover:bg-gray-100">
          <td class="border p-2">{{ schedule }}</td>
          <td class="border p-2">{{ time }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../../plugins/axios";

const schedules = ref({});
const isEditModalOpen = ref(false);
const editableSchedule = ref({
  id: null,
  prayer_name: '',
  time: '',
  notification_method: '',
});

const districtName = ref('');
const upazilaName = ref('');
const currentTime = ref('');
const currentDate = ref('');
const timeRemaining = ref('');
const nextPrayer = ref('');

let intervalId = null;

onMounted(async () => {
  try {
    const response = await apiClient.get("/salat-schedules");
    schedules.value = response.data.schedules;

    // Fetch city and area information
    districtName.value = response.data.user.districts.name;
    upazilaName.value = response.data.user.upazilas.name;

    // Set current time and date
    const now = new Date();
    currentTime.value = now.toLocaleTimeString();
    currentDate.value = now.toLocaleDateString();

    // Calculate remaining time
    calculateTimeRemaining();

    // Set interval to update remaining time every second
    intervalId = setInterval(() => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString();
      calculateTimeRemaining();
    }, 1000);

  } catch (error) {
    console.error("Error fetching prayer times:", error);
  }
});

const calculateTimeRemaining = () => {
  const scheduleKeys = Object.keys(schedules.value);
  
  if (scheduleKeys.length > 0) {
    const now = new Date();
    let nextPrayerName = '';
    let nextPrayerTime = null;

    // Find the next prayer time
    for (const prayer of scheduleKeys) {
      const prayerTime = new Date(`${currentDate.value} ${schedules.value[prayer]}`);
      if (prayerTime > now) {
        nextPrayerName = prayer;
        nextPrayerTime = prayerTime;
        break;
      }
    }

    // If no next prayer found today, use the first prayer of the next day
    if (!nextPrayerTime) {
      nextPrayerName = scheduleKeys[0];
      nextPrayerTime = new Date(`${currentDate.value} ${schedules.value[scheduleKeys[0]]}`);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    const diff = nextPrayerTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timeRemaining.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    nextPrayer.value = nextPrayerName;
  } else {
    timeRemaining.value = 'No prayer times available';
    nextPrayer.value = '';
  }
};

// Open Edit Modal
const openEditModal = (schedule) => {
  editableSchedule.value = { ...schedule };
  isEditModalOpen.value = true;
};

// Close Edit Modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Update a schedule
const updateSchedule = async () => {
  try {
    const formattedTime = editableSchedule.value.time.slice(0, 5);

    const payload = {
      prayer_name: editableSchedule.value.prayer_name,
      time: formattedTime,
      notification_method: editableSchedule.value.notification_method,
    };

    await apiClient.put(`/salat-schedules/${editableSchedule.value.id}`, payload);
    // Update the schedule in the list
    const index = schedules.value.findIndex((s) => s.id === editableSchedule.value.id);
    if (index !== -1) {
      schedules.value[index] = { ...editableSchedule.value };
    }
    closeEditModal();
    alert('Schedule updated successfully.');
  } catch (error) {
    alert('Failed to update schedule.');
  }
};
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>