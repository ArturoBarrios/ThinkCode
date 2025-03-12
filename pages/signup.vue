<script setup lang="ts">
import { ref } from "vue";
import { SIGNUP_MUTATION } from "~/graphql-server/mutations"; // Updated import path
import { useRouter } from "vue-router";

const apollo = useNuxtApp().$apollo as any;
const router = useRouter();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const handleSignup = async (event: Event) => {
  event.preventDefault();
  errorMessage.value = "";
  successMessage.value = "";

  if (!username.value || !password.value) {
    errorMessage.value = "Please fill in all fields.";
    return;
  }

  try {
    const { data } = await apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username: username.value, password: password.value },
    });

    if (data.signup) {
      successMessage.value = "Signup successful! Redirecting...";
      setTimeout(() => router.push("/login"), 2000);
    }
  } catch (error: any) {
    errorMessage.value = "Signup failed: " + error.message;
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Sign Up</h2>
      <form @submit="handleSignup">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full p-2 border rounded mb-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-2 border rounded mb-4"
        />
        <button type="submit" class="bg-blue-500 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
  </div>
</template>
