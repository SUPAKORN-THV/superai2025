<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-6" v-html="message"></p>
        
        <div v-if="requiresInput" class="mb-6">
          <input
            v-model="inputValue"
            type="text"
            :placeholder="inputPlaceholder"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="cancel"
            class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>
          <button
            @click="confirm"
            :disabled="requiresInput && !isInputValid"
            class="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition duration-300"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  requiresInput: Boolean,
  inputPlaceholder: String,
  expectedInput: String
})

const emit = defineEmits(['confirm', 'cancel'])

const inputValue = ref('')

const isInputValid = computed(() => {
  if (!props.requiresInput) return true
  return inputValue.value === props.expectedInput
})

const confirm = () => {
  if (props.requiresInput && !isInputValid.value) return
  emit('confirm')
  inputValue.value = ''
}

const cancel = () => {
  emit('cancel')
  inputValue.value = ''
}
</script>