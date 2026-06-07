<template>
  <div class="links-panel">
    <button class="links-button" @click="isExpanded = !isExpanded">
      {{ language === 'da' ? 'Links' : 'Links' }}
    </button>
    <div v-if="isExpanded" class="links-list">
      <a
        v-for="link in LINKS"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="links-list__item"
      >
        {{ language === 'da' ? link.name.da : link.name.en }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LOCATIONS as LINKS } from '@/lib/links'
import { type Language } from '@/lib/i18n'

defineProps<{
  language: Language
}>()

const isExpanded = ref(false)
</script>

<style scoped>
.links-panel {
  position: absolute;
  bottom: 5rem;
  left: 1.5rem;
  z-index: 10;
}

.links-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: var(--primary-red);
  border: 2px solid var(--pokemon-black);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(138, 0, 0, 0.4);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.links-button:hover {
  background: var(--primary-dark-red);
  box-shadow: 0 6px 16px rgba(138, 0, 0, 0.5);
  transform: scale(1.05);
}

.links-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chevron {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  display: inline-block;
}

.links-list {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--pokemon-black);
  border: 2px solid var(--primary-red);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.2s ease-out;
}

.links-list__item {
  display: block;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(204, 17, 17, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

.links-list__item:last-child {
  border-bottom: none;
}

.links-list__item:hover {
  background: var(--primary-red);
  padding-left: 1.25rem;
}

@media (max-width: 640px) {
  .links-panel {
    bottom: 4rem;
    left: 1rem;
  }

  .links-button {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .links-list {
    min-width: 200px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
