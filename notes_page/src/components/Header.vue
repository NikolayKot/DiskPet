<script lang="ts">
import { defineComponent, ref } from 'vue'
import { LoginIcon } from '@/assets/icons'
import AuthModal from './AuthModal.vue'

export default defineComponent({
  name: 'AppHeader',
  components: {
    AuthModal,
  },
  setup() {
    const isAuthModalOpen = ref(false)

    const handleLogin = (): void => {
      isAuthModalOpen.value = true
    }

    const handleCloseModal = (): void => {
      isAuthModalOpen.value = false
    }

    return {
      LoginIcon,
      handleLogin,
      isAuthModalOpen,
      handleCloseModal,
    }
  },
})
</script>

<template>
  <header class="header">
    <div class="header__container">
      <router-link to="/" class="header__logo">
        <img src="/logo.svg" alt="DiskPet Logo" />
      </router-link>

      <button class="header__login-btn" @click="handleLogin">
        <img :src="LoginIcon" alt="Login" class="header__login-icon" />
        <span class="header__login-text">Вход</span>
      </button>
    </div>
  </header>

  <AuthModal :is-open="isAuthModalOpen" @close="handleCloseModal" />
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  max-height: 136px;
  background-color: var(--dark);

  &__container {
    margin: 0px;
    padding: 40px 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: $desktop-width) {
      padding: 20px 80px;
    }
    @media (max-width: $tablet-width) {
      padding: 20px 40px;
    }
    @media (max-width: $mobile-width) {
      padding: 20px 20px;
    }
  }

  &__logo {
    height: 50px;

    img {
      height: 100%;
      width: auto;
    }

    @media (max-width: $mobile-width) {
      height: 36px;
    }
  }

  &__login-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    background-color: var(--green-light);
    border-radius: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: var(--green-middle);
    }

    &:active {
      background-color: var(--green-dark);
    }
  }

  &__login-text {
    color: var(--white);
    @include text-normal;
  }

  &__login-icon {
    width: 32px;
    height: 32px;
    color: var(--white);
  }
}
</style>
