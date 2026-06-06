<template>
  <div class="layer-switcher">
    <div class="layer-toggle-group">
      <button
        class="layer-toggle"
        :class="{ active: showPoi }"
        @click="togglePoi"
        :title="showPoi ? 'POI Tændt' : 'POI Slukket'"
      >
        <span class="toggle-text">{{ showPoi ? 'POI' : 'POI' }}</span>
        <span class="toggle-indicator" :class="{ on: !showPoi }"></span>
      </button>
    </div>
    <div class="layer-toggle-group">
      <button
        class="layer-toggle"
        :class="{ active: showZones }"
        @click="toggleZones"
        :title="showZones ? 'Zoner Tændt' : 'Zoner Slukket'"
      >
        <span class="toggle-text">{{ showZones ? 'Zoner' : 'Zoner' }}</span>
        <span class="toggle-indicator" :class="{ on: !showZones }"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const showPoi = defineModel<boolean>('showPoi', { default: true })
const showZones = defineModel<boolean>('showZones', { default: true })

const emit = defineEmits<{
  'togglePoi': [show: boolean]
  'toggleZones': [show: boolean]
}>()

const togglePoi = () => {
  showPoi.value = !showPoi.value
  emit('togglePoi', showPoi.value)
}

const toggleZones = () => {
  showZones.value = !showZones.value
  emit('toggleZones', showZones.value)
}
</script>

<style scoped>
.layer-switcher {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 15;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.layer-toggle-group {
  display: flex;
  align-items: center;
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
    gap: 0.5rem;
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
