<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { LoginIcon, AvatarPlaceholder } from '@/assets/icons'
import { useAuthStore } from '@/stores/auth'
import AuthModal from './AuthModal.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppHeader',
  components: {
    AuthModal,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isAuthModalOpen = ref(false)
    const isDropdownOpen = ref(false)
    const dropdownRef = ref<HTMLDivElement | null>(null)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const userEmail = computed(() => authStore.userEmail)

    const handleLogin = (): void => {
      isAuthModalOpen.value = true
    }

    const handleCloseModal = async (): Promise<void> => {
      isAuthModalOpen.value = false
      if (authStore.isAuthenticated) {
        await authStore.fetchUserData()
      }
    }

    const handleLogout = async (): Promise<void> => {
      await authStore.logout()
      isDropdownOpen.value = false
      router.push({ name: 'home' })
    }

    const toggleDropdown = (): void => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isDropdownOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      LoginIcon,
      AvatarPlaceholder,
      handleLogin,
      isAuthModalOpen,
      handleCloseModal,
      handleLogout,
      isAuthenticated,
      userEmail,
      isDropdownOpen,
      toggleDropdown,
      dropdownRef,
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

      <div v-if="isAuthenticated" class="header__user" ref="dropdownRef">
        <div class="header__user-info" @click="toggleDropdown">
          <span class="header__user-email">{{ userEmail }}</span>
          <img :src="AvatarPlaceholder" alt="Avatar" class="header__user-avatar" />
        </div>

        <div v-if="isDropdownOpen" class="header__dropdown">
          <router-link to="/notes" class="header__dropdown-item"> Заметки </router-link>
          <button class="header__dropdown-item" @click="handleLogout">Выйти</button>
        </div>
      </div>
      <button v-else class="header__login-btn" @click="handleLogin">
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

  &__user {
    position: relative;
  }

  &__user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--dark-lighter);
    }
  }

  &__user-email {
    color: var(--white);
    @include text-small;
  }

  &__user-avatar {
    width: 56px;
    height: 56px;
  }

  &__dropdown {
    position: absolute;
    z-index: 99;
    top: 100%;
    right: 0;
    margin-top: 12px;
    background-color: var(--dark-middle);
    border-radius: 12px;
    min-width: 145px;
    box-shadow: 0px 15px 46px -10px #00000099;
    &::before {
      content: '';
      position: absolute;
      top: -9px;
      right: 28px;
      width: 0;
      height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid var(--dark-middle);
    }
  }

  &__dropdown-item {
    display: block;
    width: 100%;
    padding: 15px;
    color: var(--green-light);
    text-decoration: none;
    text-align: left;
    border-radius: 12px;
    background: none;
    border: none;
    cursor: pointer;
    @include text-small-bold;

    &:hover {
      background-color: var(--dark);
    }
  }
}
</style>
