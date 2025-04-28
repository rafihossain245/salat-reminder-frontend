import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';
import apiClient from '../../plugins/axios';

const routes = [
  { path: '/', redirect: '/login' },
  // { path: '/login', component: Login },
  { path: '/login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', component: Register },
  // { path: '/dashboard', component: Dashboard },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  try {
    // Check if the user is authenticated by calling /api/user
    await apiClient.get('/user');

    // If authenticated and trying to access login page, redirect to dashboard
    if (to.meta.requiresGuest) {
      next('/dashboard'); // Redirect authenticated users away from /login
    } else {
      next(); // Proceed to the route
    }
  } catch (error) {
    // If the error is due to unauthenticated access (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // If trying to access a protected route, redirect to login
      if (to.meta.requiresAuth) {
        next('/login'); // Redirect unauthenticated users to /login
      } else {
        next(); // Allow access to public routes like /login or /register
      }
    } else {
      // For other errors, show an alert or log the error
      console.error('Error during authentication check:', error);
      alert('An unexpected error occurred. Please try again.');
      next(false); // Prevent navigation
    }
  }
});

export default router;