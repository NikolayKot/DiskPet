<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CloseIcon } from '@/assets/icons'
import BaseInput from './BaseInput.vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'AuthModal',
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
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')

    const emailError = ref('')
    const passwordError = ref('')
    const passwordConfirmError = ref('')
    const isLoginMode = ref(true)

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const validateForm = () => {
      let isValid = true
      emailError.value = ''
      passwordError.value = ''
      passwordConfirmError.value = ''

      if (!email.value) {
        emailError.value = 'E-Mail не может быть пустым'
        isValid = false
      } else if (!validateEmail(email.value)) {
        emailError.value = 'Невалидный адрес электронной почты'
        isValid = false
      }

      if (!password.value) {
        passwordError.value = 'Пароль не может быть пустым'
        isValid = false
      } else if (password.value.length < 4) {
        passwordError.value = 'Пароль не может быть короче 4 символов'
        isValid = false
      } else if (password.value.length > 12) {
        passwordError.value = 'Пароль не может быть длинее 12 символов'
        isValid = false
      }

      if (!isLoginMode.value) {
        if (password.value !== passwordConfirm.value) {
          passwordConfirmError.value = 'Пароли не совпадают'
          isValid = false
        }
      }

      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        if (isLoginMode.value) {
          const response = await authStore.login(email.value, password.value)
          if (response) {
            await authStore.fetchUserData()
            emit('close')
          }
        } else {
          const response = await authStore.register(
            email.value,
            password.value,
            passwordConfirm.value,
          )
          if (response) {
            emit('close')
          }
        }
      } catch (error: any) {
        if (error.status === 409) {
          emailError.value = 'Пользователь с таким e-mail уже зарегистрирован'
        } else if (error.message) {
          if (error.message.includes('email')) {
            emailError.value = error.message
          } else if (error.message.includes('password')) {
            passwordError.value = error.message
          } else {
            console.error(error)
          }
        }
      }
    }

    const handleClose = () => {
      emit('close')
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        handleClose()
      }
    }

    const toggleMode = () => {
      isLoginMode.value = !isLoginMode.value
    }

    return {
      email,
      password,
      passwordConfirm,
      emailError,
      passwordError,
      passwordConfirmError,
      isLoginMode,
      handleClose,
      handleOutsideClick,
      toggleMode,
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

        <h2 class="modal__title">
          {{ isLoginMode ? 'Вход в ваш аккаунт' : 'Регистрация' }}
        </h2>

        <form class="modal__form" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="email"
            label="Email"
            type="text"
            placeholder="Введите email"
            :error="emailError"
            required
          />

          <BaseInput
            v-model="password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            :error="passwordError"
            required
          />

          <BaseInput
            v-if="!isLoginMode"
            v-model="passwordConfirm"
            label="Пароль ещё раз"
            type="password"
            placeholder="Повторите пароль"
            :error="passwordConfirmError"
            required
          />

          <div class="modal__bottom">
            <p class="modal__switch">
              {{ isLoginMode ? 'У вас нет аккаунта?' : 'Уже есть аккаунт?' }}
              <button type="button" @click="toggleMode">
                {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
              </button>
            </p>

            <button type="submit" class="modal__submit">
              {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
            </button>
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
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      @include text-normal;
      color: var(--white);
    }

    input {
      padding: 12px 16px;
      border-radius: 16px;
      border: 1px solid var(--gray);
      background-color: transparent;
      color: var(--white);
      @include text-normal;

      &:focus {
        outline: none;
        border-color: var(--green-light);
      }

      &::placeholder {
        color: var(--gray);
      }
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    @media (max-width: $mobile-width) {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
    }
  }

  &__submit {
    background-color: var(--green-light);
    color: var(--white);
    border: none;
    @include text-normal;
    border-radius: 32px;
    padding: 12px 24px;
    cursor: pointer;
    @include text-normal;
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

  &__switch {
    text-align: center;
    @include text-small;
    color: var(--gray);

    @media (max-width: $desktop-width) {
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    @media (max-width: $tablet-width) {
      display: flex;
      align-items: start;
      flex-direction: row;
    }
    @media (max-width: $mobile-width) {
      margin-top: 12px;
      font-size: 14px;
    }

    button {
      background: none;
      border: none;
      color: var(--green-light);
      cursor: pointer;
      @include text-small-bold;
      margin-left: 4px;

      @media (max-width: $desktop-width) {
        margin-left: 0px;
      }
      @media (max-width: $tablet-width) {
        margin-left: 4px;
      }
      @media (max-width: $mobile-width) {
        font-size: 14px;
      }

      &:hover {
        color: var(--white);
      }
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
