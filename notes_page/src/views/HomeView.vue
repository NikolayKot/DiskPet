<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
})
</script>

<template>
  <main class="home">
    <div class="home__content">
      <div class="home__text">
        <h1 class="home__title">Мои заметки</h1>
        <h3 class="home__subtitle">Не забывай о важном, храни его в облаке.</h3>
      </div>
      <div class="home__image">
        <img src="/home-image.svg" alt="Home illustration" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home {
  &__content {
    margin: 0px 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 61px;
    @media (max-width: $desktop-width) {
      margin: 0px 80px;
    }
    @media (max-width: $tablet-width) {
      margin: 40px 40px 0px;
      flex-direction: column;
    }
    @media (max-width: $mobile-width) {
      margin: 20px 20px 0px;
    }
  }

  &__text {
    flex: 1;
    max-width: 725px;
    @media (max-width: $tablet-width) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__title {
    @include h1;
    color: var(--white);
    margin-bottom: 40px;
    max-width: 488px;
    @media (max-width: $tablet-width) {
      text-align: center;
    }
    @media (max-width: $mobile-width) {
      font-size: 60px;
      line-height: 64px;
    }
  }

  &__subtitle {
    @include h3;
    color: var(--gray);
    max-width: 400px;
    @media (max-width: $tablet-width) {
      text-align: center;
    }
    @media (max-width: $mobile-width) {
      font-size: 24px;
      line-height: 36px;
    }
  }

  &__image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
