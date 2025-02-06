<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { AddIcon } from '@/assets/icons'
import NoteCard from '@/components/NoteCard.vue'
import type { Note } from '@/types/note'
import AddNoteModal from '@/components/AddNoteModal.vue'
import { useNotesStore } from '@/stores/notes'

export default defineComponent({
  name: 'NotesView',
  components: {
    NoteCard,
    AddNoteModal,
  },
  setup() {
    const notesStore = useNotesStore()
    const { notes } = storeToRefs(notesStore)
    const isAddNoteModalOpen = ref(false)

    onMounted(async () => {
      await notesStore.fetchNotes()
    })

    const handleOpenModal = () => {
      isAddNoteModalOpen.value = true
    }

    const handleCloseModal = () => {
      isAddNoteModalOpen.value = false
    }

    const handleDeleteNote = async (noteId: number) => {
      try {
        await notesStore.deleteNote(noteId)
      } catch (error) {
        console.error('Ошибка при удалении заметки:', error)
      }
    }

    const handleAddNote = async (note: { title: string; content: string }) => {
      try {
        await notesStore.addNote(note)
        handleCloseModal()
      } catch (error) {
        console.error('Ошибка при добавлении заметки:', error)
      }
    }

    return {
      AddIcon,
      notes,
      isAddNoteModalOpen,
      handleOpenModal,
      handleCloseModal,
      handleDeleteNote,
      handleAddNote,
    }
  },
})
</script>

<template>
  <main class="notes">
    <div class="notes__container">
      <div class="notes__grid">
        <NoteCard v-for="note in notes" :key="note.id" :note="note" @delete="handleDeleteNote" />
      </div>

      <button class="notes__add-button" @click="handleOpenModal">
        <img :src="AddIcon" alt="Add note" />
      </button>
    </div>

    <AddNoteModal
      :is-open="isAddNoteModalOpen"
      @close="handleCloseModal"
      @add-note="handleAddNote"
    />
  </main>
</template>

<style lang="scss" scoped>
.notes {
  flex: 1;
  padding: 40px 160px;

  @media (max-width: $desktop-width) {
    padding: 32px 80px;
  }
  @media (max-width: $tablet-width) {
    padding: 24px 40px;
  }
  @media (max-width: $mobile-width) {
    padding: 16px 20px;
  }

  &__container {
    position: relative;
    min-height: 100%;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    grid-auto-rows: min-content;
    align-items: start;

    @media (max-width: $tablet-width) {
      grid-template-columns: 1fr;
    }
  }

  &__add-button {
    position: fixed;
    right: 12px;
    bottom: 40px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--green-light);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0px 15px 46px -10px #00000099;

    &:hover {
      background-color: var(--green-middle);
    }

    &:active {
      background-color: var(--green-dark);
    }

    img {
      width: 16px;
      height: 16px;
    }

    @media (max-width: $tablet-width) {
      right: 8px;
    }
  }
}
</style>
