import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Note } from '@/types/note'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const authStore = useAuthStore()

  const api = axios.create({
    baseURL: 'https://dist.nd.ru',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  api.interceptors.request.use((config) => {
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  const fetchNotes = async () => {
    try {
      const response = await api.get('/api/notes')
      notes.value = response.data
    } catch (error) {
      console.error('Ошибка при получении заметок:', error)
      throw error
    }
  }

  const addNote = async (noteData: { title: string; content: string }) => {
    try {
      const response = await api.post('/api/notes', noteData)
      await fetchNotes()
      return response.data
    } catch (error) {
      console.error('Ошибка при добавлении заметки:', error)
      throw error
    }
  }

  const deleteNote = async (id: number) => {
    try {
      await api.delete(`/api/notes/${id}`)
      await fetchNotes()
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error)
      throw error
    }
  }

  return {
    notes,
    fetchNotes,
    addNote,
    deleteNote,
  }
})
