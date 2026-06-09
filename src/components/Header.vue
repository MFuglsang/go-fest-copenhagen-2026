<template>
  <header class="header">
    <div class="header__container">
      <div class="header__brand">
        <h1 class="header__title">{{ translations.header.title }}</h1>
        <p class="header__subtitle">{{ translations.header.subtitle }}</p>
      </div>
      <select
        class="location-select"
        @change="handleLocationChange"
        :aria-label="translations.header.selectLocation"
      >
        <option value="">{{ translations.header.selectLocation }}</option>
        <option v-for="location in locations" :key="location.id" :value="location.id">
          {{ location.name[language] }}
        </option>
      </select>
      <div class="language-switcher">
        <button
          class="language-btn"
          :class="{ active: language === 'da' }"
          @click="emit('change-language', 'da')"
          :aria-label="'Dansk'"
        >
          DA
        </button>
        <button
          class="language-btn"
          :class="{ active: language === 'en' }"
          @click="emit('change-language', 'en')"
          :aria-label="'English'"
        >
          EN
        </button>
      </div>
      <button class="info-btn" @click="showDisclaimer = true" aria-label="Info">
        ℹ️
      </button>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showDisclaimer" class="disclaimer-overlay" @click.self="showDisclaimer = false">
      <div class="disclaimer-modal">
        <p>{{ translations.disclaimer }}</p>
        <button class="disclaimer-close" @click="showDisclaimer = false">✕</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LOCATIONS } from '@/lib/locations'
import { type Location } from '@/lib/locations'
import { type Language, getTranslations } from '@/lib/i18n'

const showDisclaimer = ref(false)

interface Props {
  language: Language
}

const props = defineProps<Props>()

const translations = computed(() => getTranslations(props.language))

const locations = LOCATIONS

const emit = defineEmits<{
  'navigate-to-location': [location: Location]
  'change-language': [language: Language]
}>()

const handleLocationChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const locationId = target.value

  if (locationId) {
    const location = locations.find((loc) => loc.id === locationId)
    if (location) {
      emit('navigate-to-location', location)
      // Reset select
      target.value = ''
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-dark-red) 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(138, 0, 0, 0.3);
  position: relative;
  z-index: 100;
  border-bottom: 3px solid var(--pokemon-black);
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
}

.header__brand {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  white-space: nowrap;
}

.header__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  color: white;
}

.header__subtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.95;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.location-select {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 2px solid white;
  background-color: rgba(255, 255, 255, 0.95);
  color: var(--pokemon-black);
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
  flex: 1;
}

.location-select:hover {
  background-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.location-select:focus {
  outline: none;
  background-color: white;
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.location-select option {
  background-color: white;
  color: var(--pokemon-black);
  padding: 0.5rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.language-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 2px solid white;
  background-color: transparent;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.language-btn.active {
  background-color: white;
  color: var(--primary-red);
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

@media (max-width: 1024px) {
  .header__container {
    gap: 1rem;
  }

  .location-select {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .header__container {
    flex-wrap: wrap;
  }

  .header__brand {
    width: 100%;
  }

  .location-select {
    flex: 1;
    min-width: 150px;
  }

  .language-switcher {
    margin-left: 0;
  }
}

.info-btn {
  background: transparent;
  border: 2px solid white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.info-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.disclaimer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.disclaimer-modal {
  background: white;
  color: var(--pokemon-black);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  line-height: 1.6;
}

.disclaimer-close {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--pokemon-black);
  line-height: 1;
  padding: 0.25rem;
}

.disclaimer-close:hover {
  opacity: 0.7;
}

@media (max-width: 640px) {
  .header {
    padding: 0.75rem 0;
  }

  .header__container {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .header__brand {
    flex: 0 1 auto;
    gap: 0.5rem;
  }

  .header__title {
    font-size: 1rem;
  }

  .header__subtitle {
    display: none;
  }

  .location-select {
    flex: 1;
    min-width: 120px;
    padding: 0.35rem 0.5rem;
    font-size: 0.8rem;
    border: 2px solid white;
  }

  .language-switcher {
    display: flex;
    gap: 0.25rem;
    margin: 0;
    flex-shrink: 0;
  }

  .language-btn {
    padding: 0.35rem 0.5rem;
    font-size: 0.7rem;
    flex: unset;
  }
}
</style>
