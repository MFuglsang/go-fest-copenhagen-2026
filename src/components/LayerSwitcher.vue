<template>
  <div class="layer-switcher">
    <button
      class="layer-switcher-header"
      @click="isExpanded = !isExpanded"
    >
      <span class="header-text">{{ language === 'da' ? 'Lag' : 'Layers' }}</span>
      <span class="chevron" :class="{ expanded: isExpanded }">▼</span>
    </button>
    
    <div v-show="isExpanded" class="layer-toggles">
      <button
        class="layer-toggle"
        :class="{ active: showEventZones }"
        @click="$emit('update:showEventZones', !showEventZones)"
      >
        <span class="toggle-indicator" :class="{ on: showEventZones }"></span>
        <span class="toggle-text">{{ language === 'da' ? 'Event Zoner' : 'Event Zones' }}</span>
      </button>
      <button
        class="layer-toggle"
        :class="{ active: showEventPlaces }"
        @click="$emit('update:showEventPlaces', !showEventPlaces)"
      >
        <span class="toggle-indicator" :class="{ on: showEventPlaces }"></span>
        <span class="toggle-text">{{ language === 'da' ? 'Event Steder' : 'Event Places' }}</span>
      </button>
      <button
        class="layer-toggle"
        :class="{ active: showGyms }"
        @click="$emit('update:showGyms', !showGyms)"
      >
        <span class="toggle-indicator" :class="{ on: showGyms }"></span>
        <span class="toggle-text">Gyms</span>
      </button>
      <button
        class="layer-toggle"
        :class="{ active: showRoutes }"
        @click="$emit('update:showRoutes', !showRoutes)"
      >
        <span class="toggle-indicator" :class="{ on: showRoutes }"></span>
        <span class="toggle-text">Routes</span>
      </button>
      <button
        class="layer-toggle"
        :class="{ active: showPoi }"
        @click="$emit('update:showPoi', !showPoi)"
      >
        <span class="toggle-indicator" :class="{ on: showPoi }"></span>
        <span class="toggle-text">POI</span>
      </button>
      <button
        class="layer-toggle"
        :class="{ active: showCphSprint }"
        @click="$emit('update:showCphSprint', !showCphSprint)"
      >
        <span class="toggle-indicator" :class="{ on: showCphSprint }"></span>
        <span class="toggle-text">{{ language === 'da' ? 'Cph sprint' : 'Cph sprint' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Language } from '@/lib/i18n'

const isExpanded = ref(false)

defineProps<{
  showPoi: boolean
  showGyms: boolean
  showRoutes: boolean
  showEventPlaces: boolean
  showEventZones: boolean
  showCphSprint: boolean
  language: Language
}>()

defineEmits<{
  'update:showPoi': [value: boolean]
  'update:showGyms': [value: boolean]
  'update:showRoutes': [value: boolean]
  'update:showEventPlaces': [value: boolean]
  'update:showEventZones': [value: boolean]
  'update:showCphSprint': [value: boolean]
}>()
</script>

<style scoped>
.layer-switcher {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 15;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer-switcher-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--pokemon-black);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.layer-switcher-header:active {
  transform: scale(0.95);
}

.header-text {
  flex: 1;
}

.chevron {
  font-size: 0.7rem;
  transition: transform 0.2s ease;
  display: inline-block;
}

.chevron.expanded {
  transform: rotate(180deg);
}

.layer-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--pokemon-black);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.layer-toggle:active {
  transform: scale(0.95);
}

.toggle-text {
  flex: 1;
  text-align: center;
}

.toggle-indicator {
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background-color: #ccc;
  position: relative;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.toggle-indicator::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: left 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-indicator.on {
  background-color: var(--primary-red);
}

.toggle-indicator.on::after {
  left: 16px;
}

@media (max-width: 640px) {
  .layer-switcher {
    top: 0.75rem;
    right: 0.75rem;
  }

  .layer-switcher-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .layer-toggle {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }

  .toggle-indicator {
    width: 28px;
    height: 16px;
  }

  .toggle-indicator::after {
    width: 12px;
    height: 12px;
  }

  .toggle-indicator.on::after {
    left: 14px;
  }
}
</style>
