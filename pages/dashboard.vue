<template>
    <div class="min-h-screen bg-gray-100 p-4">
      <!-- LeetCode Problem Section -->
      <div class="mb-4">
        <!-- LeetCodeProblem receives v-model binding and a readOnly prop -->
        <LeetCodeProblem v-model="problemText" :readOnly="problemSubmitted" />
        <!-- Show submit button only when problem not yet submitted -->
        <div v-if="!problemSubmitted" class="mt-2">
          <button @click="submitProblem" class="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Problem
          </button>
        </div>
        <!-- Show temporary analysis message -->
        <div v-if="loading" class="mt-2 text-gray-600">
          Analyzing, preparing...
        </div>
      </div>
  
      <!-- Code Editor Section (Pseudocode) -->
      <div class="mb-4">
        <CodeEditor v-model="pseudocodeText" />
      </div>
  
      <!-- Problem Guider Section -->
      <div v-if="problemSubmitted" class="mt-4">
        <ProblemGuider :analysis="analysisText" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import LeetCodeProblem from "~/components/LeetCodeProblem.vue";
  import CodeEditor from "~/components/CodeEditor.vue";
  import ProblemGuider from "~/components/ProblemGuider.vue";
  import { ANALYZE_PROBLEM_MUTATION } from "~/graphql-server/mutations";
  const apollo = useNuxtApp().$apollo as any;
  
  const problemText = ref("");
  const pseudocodeText = ref("");
  const problemSubmitted = ref(false);
  const loading = ref(false);
  const analysisText = ref("");
  
  const submitProblem = async () => {
    if (!problemText.value.trim()) return;
    loading.value = true;
    try {
      const { data } = await apollo.mutate({
        mutation: ANALYZE_PROBLEM_MUTATION,
        variables: { problemText: problemText.value },
      });
      analysisText.value = data.analyzeProblem;
    } catch (error: any) {
      analysisText.value = "Error analyzing the problem.";
      console.error("Error during analysis:", error);
    }
    loading.value = false;
    problemSubmitted.value = true;
  };
  </script>
  