<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CloseIcon } from '@/assets/icons'
import BaseInput from './BaseInput.vue'
import { useNotesStore } from '@/stores/notes'

export default defineComponent({
  name: 'AddNoteModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    BaseInput,
  },
  emits: ['close'],
  setup(_, { emit }) {
    const notesStore = useNotesStore()
    const title = ref('')
    const content = ref('')
    const titleError = ref('')
    const contentError = ref('')

    const validateForm = () => {
      let isValid = true
      titleError.value = ''
      contentError.value = ''

      if (!title.value) {
        titleError.value = 'Название заметки не может быть пустым'
        isValid = false
      }

      if (!content.value) {
        contentError.value = 'Текст заметки не может быть пустым'
        isValid = false
      }

      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        await notesStore.addNote({
          title: title.value,
          content: content.value,
        })

        title.value = ''
        content.value = ''
        emit('close')
      } catch (error) {
        console.error('Ошибка при добавлении заметки:', error)
      }
    }

    const handleClose = () => {
      title.value = ''
      content.value = ''
      titleError.value = ''
      contentError.value = ''
      emit('close')
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        handleClose()
      }
    }

    return {
      title,
      content,
      titleError,
      contentError,
      handleClose,
      handleOutsideClick,
      handleSubmit,
      CloseIcon,
    }
  },
})
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="handleOutsideClick">
      <div class="modal">
        <button class="modal__close" @click="handleClose">
          <img :src="CloseIcon" alt="Close" />
        </button>

        <h2 class="modal__title">Добавление заметки</h2>

        <form class="modal__form" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="title"
            label="Название заметки"
            type="name"
            placeholder="Введите название"
            :error="titleError"
            required
          />

          <BaseInput
            v-model="content"
            label="Текст заметки"
            type="textarea"
            placeholder="Введите текст"
            :error="contentError"
            required
          />

          <div class="modal__bottom">
            <button type="submit" class="modal__submit">Добавить заметку</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: var(--dark);
  border-radius: 40px;
  padding: 80px;
  width: 100%;
  max-width: 780px;
  position: relative;

  @media (max-width: $desktop-width) {
    padding: 56px;
    max-width: 594px;
  }

  @media (max-width: $tablet-width) {
    padding: 56px;
    max-width: 688px;
  }

  @media (max-width: $mobile-width) {
    padding: 90px 16px;
    max-width: 352px;
  }

  &__close {
    width: 56px;
    height: 56px;
    position: absolute;
    top: 24px;
    right: 24px;
    background: var(--green-light);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: var(--green-middle);
    }
    &:active {
      background-color: var(--green-dark);
    }
  }

  &__title {
    @include h2;
    margin-bottom: 40px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  &__submit {
    background-color: var(--green-light);
    color: var(--white);
    border: none;
    @include text-normal;
    border-radius: 32px;
    padding: 12px 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--green-middle);
    }

    &:active {
      background-color: var(--green-dark);
    }

    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
