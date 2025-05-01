<template>
  <div class="text-center mt-10">
    <h2 class="text-2xl font-bold mb-4">Qibla Compass</h2>
    <div class="relative w-48 h-48 mx-auto border-4 border-gray-300 rounded-full">
      <div
        class="absolute w-1 h-24 bg-red-500 top-1/2 left-1/2 transform origin-bottom"
        :style="{ transform: `rotate(${qiblaDirection - compassHeading}deg)` }"
      ></div>
    </div>
    <p class="mt-4">Qibla Direction: {{ qiblaDirection.toFixed(2) }}°</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const compassHeading = ref(0);
    const qiblaDirection = ref(0);

    const calculateQiblaDirection = (latitude, longitude) => {
      const kaabaLatitude = 21.4225;
      const kaabaLongitude = 39.8262;
      const phiK = (kaabaLatitude * Math.PI) / 180.0;
      const lambdaK = (kaabaLongitude * Math.PI) / 180.0;
      const phi = (latitude * Math.PI) / 180.0;
      const lambda = (longitude * Math.PI) / 180.0;

      const qibla = Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );

      return (qibla * 180.0) / Math.PI;
    };

    const updateCompass = (event) => {
      compassHeading.value = event.alpha || 0;
    };

    const getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          qiblaDirection.value = calculateQiblaDirection(latitude, longitude);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    onMounted(() => {
      window.addEventListener('deviceorientation', updateCompass, true);
      getGeolocation();
    });

    return {
      compassHeading,
      qiblaDirection,
    };
  },
};
</script>

<style scoped>
/* Removed custom styles as Tailwind CSS is used */
</style>
