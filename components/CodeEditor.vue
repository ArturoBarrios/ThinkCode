<template>
    <div>
      <h2 class="text-xl font-bold mb-2">Pseudocode</h2>
      <textarea
        v-model="localValue"
        placeholder="Write your pseudocode here..."
        class="w-full h-72 p-2 border rounded font-mono resize-y"
      ></textarea>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from "vue";
  
  const props = defineProps<{ modelValue: string }>();
  const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
  
  const localValue = ref(props.modelValue);
  watch(localValue, (newVal) => {
    emit("update:modelValue", newVal);
  });
  </script>
  