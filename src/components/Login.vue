<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="formData.email" placeholder="Email" required />
        <input v-model="formData.password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="#" @click="goToRegister">Register here</a>.
      </p>
    </div>
</template>
  
<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import apiClient from '../../plugins/axios';
  
  const formData = reactive({
    email: '',
    password: '',
  });
  
  const router = useRouter();
  
  const login = async () => {
    try{
        const response = await apiClient.post('/login', formData);

        const token = response.data.token;
        localStorage.setItem('auth_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        alert(response.data.message);
        router.push('/dashboard');
    }catch(error){
        alert('Invalid login creadentials!');
    }
  };
  
  const goToRegister = async () => {
    try{
        router.push('/register');
    }catch(error){
        alert('Error registering user!');
    }
  };
</script>
  
<style scoped>
    .login-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
        text-align: center;
        margin-bottom: 20px;
    }
    
    input {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    button {
        display: block;
        width: 100%;
        padding: 10px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:hover {
        background-color: #369f6e;
    }
    
    p {
        text-align: center;
        margin-top: 15px;
    }
    
    a {
        color: #42b983;
        text-decoration: none;
    }
    
    a:hover {
        text-decoration: underline;
    }
</style>