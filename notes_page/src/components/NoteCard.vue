<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { CloseIcon } from '@/assets/icons'
import type { Note } from '@/types/note'

export default defineComponent({
  name: 'NoteCard',
  props: {
    note: {
      type: Object as PropType<Note>,
      required: true,
    },
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const handleDelete = () => {
      emit('delete', props.note.id)
    }

    return {
      CloseIcon,
      handleDelete,
    }
  },
})
</script>

<template>
  <article class="note-card">
    <h2 class="note-card__title">{{ note.title }}</h2>
    <p class="note-card__content">{{ note.content }}</p>
    <div class="note-card__footer">
      <button class="note-card__delete" @click="handleDelete">
        <img :src="CloseIcon" alt="Delete note" />
        <span class="note-card__delete-text">Удалить</span>
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.note-card {
  background-color: var(--green-light);
  border-radius: 12px 0px 12px 12px;
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 100;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent var(--dark) transparent transparent;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(225deg, transparent 50%, rgba(0, 0, 0, 0.2) 50%);
    border-radius: 0 12px 0 12px;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-4px);
  }

  &__title {
    color: var(--white);
    margin-bottom: 20px;
    @include h4;

    &::after {
      content: '';
      display: block;
      width: calc(100% + 56px);
      height: 1px;
      background-color: var(--green-dark);
      margin: 12px -28px 0;
    }
  }

  &__content {
    color: var(--white);
    margin-bottom: 36px;
    @include text-normal;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__delete {
    background: none;
    border: none;
    padding: 0px 8px;
    cursor: pointer;
    border-radius: 12px;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;

    &-text {
      @include text-normal;
      color: var(--white);
      margin-left: 12px;
    }

    &:hover {
      background-color: var(--green-dark);
    }

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
