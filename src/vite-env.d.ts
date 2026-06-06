/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATAFORDELER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
