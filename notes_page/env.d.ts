/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/assets/icons' {
  export const CloseIcon: string
  export const LoginIcon: string
  export const AvatarPlaceholder: string
  export const OnPasswordIcon: string
  export const OffPasswordIcon: string
  export const AddIcon: string
}
