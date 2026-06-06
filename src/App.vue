<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import MapView from '@/components/MapView.vue'
import { type Location } from '@/lib/locations'
import { type Language } from '@/lib/i18n'

const language = ref<Language>('da')
const selectedLocation = ref<Location | null>(null)

const handleLanguageChange = (newLanguage: Language) => {
  language.value = newLanguage
}

const handleNavigateToLocation = (location: Location) => {
  selectedLocation.value = location
}
</script>

<template>
  <div class="app">
    <Header
      :language="language"
      @change-language="handleLanguageChange"
      @navigate-to-location="handleNavigateToLocation"
    />
    <main class="app__main">
      <MapView :selected-location="selectedLocation" :language="language" />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.app__main {
  flex: 1;
  overflow: hidden;
}
</style>
