<template>
    <div class="prayer-times-section">
      <h2>Prayer Times for All Districts</h2>
      <div v-for="district in prayerTimes" :key="district.district" class="district">
        <h3>{{ district.district }}</h3>
        <div v-for="subDistrict in district.sub_districts" :key="subDistrict.name" class="sub-district">
          <h4>{{ subDistrict.name }}</h4>
          <table class="prayer-table">
            <thead>
              <tr>
                <th>Prayer</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, prayer) in subDistrict.prayer_times" :key="prayer">
                <td>{{ prayer }}</td>
                <td>{{ time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import apiClient from '../plugins/axios';
  
  const prayerTimes = ref([]);
  
  onMounted(async () => {
    try {
      const response = await apiClient.get('/prayer-times');
      prayerTimes.value = response.data;
    } catch (error) {
      alert('Failed to fetch prayer times.');
    }
  });
  </script>
  
  <style scoped>
  .prayer-times-section {
    padding: 20px;
  }
  
  .district {
    margin-bottom: 30px;
  }
  
  .sub-district {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  
  .prayer-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .prayer-table th,
  .prayer-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .prayer-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  </style>