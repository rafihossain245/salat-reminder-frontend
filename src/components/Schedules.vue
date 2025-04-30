<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md">
      <div class="bg-green-100 p-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold">Current Time</span>
          <span class="text-lg font-bold">{{ currentTime }}</span>
        </div>
      </div>
      <div class="p-4">
        <div v-if="nextPrayer" class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Next Prayer</p>
            <p class="text-xl font-semibold text-green-700">{{ nextPrayer }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Time Remaining</p>
            <p class="flex items-center text-xl font-semibold text-green-700">
              <span class="mr-1">⏰</span>
              {{ timeRemaining }}
            </p>
          </div>
        </div>
        <p v-else class="text-center text-gray-500">All prayers for today have passed</p>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-green-800">Today's Prayer Times</h2>

      <div v-for="(time, schedule) in schedules" :key="schedule" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="mr-3 w-3 h-3 rounded-full" :class="time <= currentTime ? 'bg-green-500' : 'bg-gray-300'"></div>
              <div>
                <span class="font-medium">{{ schedule }}</span>
              </div>
            </div>
            <span class="text-gray-500">{{ time }}</span>
          </div>
        </div>
      </div>
    </div>
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