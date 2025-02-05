<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { OnPasswordIcon, OffPasswordIcon } from '@/assets/icons'

export default defineComponent({
  name: 'BaseInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => ['text', 'password', 'name', 'textarea'].includes(value),
    },
    error: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showPassword = ref(false)
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const inputType = computed(() => {
      if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password'
      }
      return 'text'
    })

    const characterCount = computed(() => props.modelValue.length)

    const maxLength = computed(() => {
      if (props.type === 'name') return 100
      if (props.type === 'textarea') return 500
      return undefined
    })

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      emit('update:modelValue', target.value)
    }

    const resizeTextarea = () => {
      if (props.type === 'textarea' && inputRef.value) {
        const textarea = inputRef.value as HTMLTextAreaElement
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    return {
      showPassword,
      inputType,
      characterCount,
      maxLength,
      handleInput,
      togglePassword,
      OnPasswordIcon,
      OffPasswordIcon,
      inputRef,
      resizeTextarea,
    }
  },
})
</script>

<template>
  <div class="input-wrapper">
    <label class="input-label">
      {{ label }}
    </label>

    <div class="input-container">
      <textarea
        v-if="type === 'textarea'"
        ref="inputRef"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxLength"
        class="input textarea"
        @input="handleInput"
        @keyup="resizeTextarea"
      />
      <input
        v-else
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxLength"
        class="input"
        @input="handleInput"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="password-toggle"
        @click="togglePassword"
      >
        <img
          :src="showPassword ? OnPasswordIcon : OffPasswordIcon"
          :alt="showPassword ? 'Hide password' : 'Show password'"
        />
      </button>
    </div>

    <div class="input-footer">
      <span v-if="error" class="input-error">{{ error }}</span>
      <span
        v-if="['name', 'textarea'].includes(type)"
        class="character-count"
        :class="{ 'near-limit': characterCount > (maxLength || 0) * 0.9 }"
      >
        {{ characterCount }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.input-label {
  @include text-small;
  color: var(--gray);
  display: flex;
  gap: 6px;
  margin-left: 24px;
}

.input-container {
  position: relative;
  width: 100%;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 36px;
  border: 2px solid var(--white);
  background-color: var(--white);
  color: var(--dark);
  @include text-small;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--green-light);
  }

  &:hover {
    outline: none;
    border-color: var(--green-light);
  }

  &::placeholder {
    color: var(--gray);
  }

  &.textarea {
    min-height: 120px;
    resize: vertical;
    max-height: 300px;
  }
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  img {
    width: 20px;
    height: 20px;
  }
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px;
}

.input-error {
  @include text-small;
  color: var(--red);
}

.character-count {
  @include text-small;
  color: var(--gray);
  margin-left: auto;

  &.near-limit {
    color: var(--red);
  }
}
</style>
