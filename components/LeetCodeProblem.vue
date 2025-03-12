<template>
    <div>
      <h2 class="text-xl font-bold mb-2">LeetCode Problem</h2>
      <template v-if="readOnly">
        <!-- Display the problem text statically -->
        <div class="p-2 border rounded whitespace-pre-wrap">
          {{ modelValue }}
        </div>
      </template>
      <template v-else>
        <!-- Editable textarea -->
        <textarea
          v-model="localValue"
          placeholder="Paste your LeetCode problem here..."
          class="w-full h-72 p-2 border rounded resize-y"
        ></textarea>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from "vue";
  
  const props = defineProps<{ modelValue: string; readOnly: boolean }>();
  const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
  
  const localValue = ref(props.modelValue);
  watch(localValue, (newVal) => {
    emit("update:modelValue", newVal);
  });
  </script>
  