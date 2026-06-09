<template>
  <div class="map-container">
    <div v-if="status === 'error'" class="map-overlay map-overlay--error">
      {{ errorMessage }}
    </div>
    <div ref="mapEl" class="map" @click="handleMapClick" />
    <LayerSwitcher 
      v-model:showPoi="showPoi" 
      v-model:showZones="showZones"
      v-model:showGyms="showGyms"
      v-model:showRoutes="showRoutes"
      v-model:showEventPlaces="showEventPlaces"
      v-model:showEventZones="showEventZones"
      v-model:showCphSprint="showCphSprint"
      :language="props.language"
    />
    <LinksPanel :language="props.language" />
    <button
      class="basemap-toggle-button"
      @click="useOrtofoto = !useOrtofoto"
      :title="useOrtofoto ? 'Skærmkort' : 'Flyfoto'"
    >
      {{ useOrtofoto ? (props.language === 'da' ? 'Skærmkort' : 'Map') : (props.language === 'da' ? 'Flyfoto' : 'Orthophoto') }}
    </button>
    <button
      class="location-button"
      :disabled="locationLoading"
      @click="centerToUserLocation"
      :title="locationLoading ? translations.map.findingLocation : translations.map.findMyLocation"
    >
      <span v-if="locationLoading" class="spinner"></span>
      <span v-else class="icon">⊕</span>
    </button>
    <div v-if="selectedPoi" class="poi-popup">
      <button class="poi-popup__close" @click="selectedPoi = null">✕</button>
      <h3 class="poi-popup__title">{{ selectedPoiName }}</h3>
      <p v-if="selectedPoiType" class="poi-popup__type">{{ selectedPoiType }}</p>
      <p v-if="selectedPoiDescription" class="poi-popup__description">{{ selectedPoiDescription }}</p>
    </div>
    <div v-if="selectedZone" class="zone-popup">
      <button class="zone-popup__close" @click="selectedZone = null">✕</button>
      <h3 class="zone-popup__title">{{ selectedZoneName }}</h3>
      <p v-if="selectedZoneType" class="zone-popup__type">{{ selectedZoneType }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import { get as getProjection, transform } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import { DAF_RESOLUTIONS, MAP_MAX_ZOOM } from '@/lib/resolutions'
import { createSkaermkortGraaLayer } from '@/lib/wms/skaermkortGraa'
import { createOrtoLayer } from '@/lib/wms/ortoLayer'
import { type Location } from '@/lib/locations'
import { type Language, getTranslations } from '@/lib/i18n'
import { createPoiLayer } from '@/lib/poi'
import { createZonesLayer } from '@/lib/zones'
import { createGymsLayer } from '@/lib/gyms'
import { createRoutesLayer } from '@/lib/routes'
import { createEventPlacesLayer } from '@/lib/eventPlaces'
import { createEventZonesLayer } from '@/lib/eventZones'
import { createCphSprintLayer } from '@/lib/cphSprint'
import LayerSwitcher from './LayerSwitcher.vue'
import LinksPanel from './LinksPanel.vue'
import '@/lib/projection'

interface Props {
  selectedLocation?: Location | null
  language: Language
}

const props = withDefaults(defineProps<Props>(), {
  selectedLocation: null,
  language: 'da',
})

const translations = computed(() => getTranslations(props.language))

const COPENHAGEN_CENTER: [number, number] = [724492, 6176908]

const mapEl = ref<HTMLElement | null>(null)
const status = ref<'ready' | 'error'>('ready')
const errorMessage = ref('')
const locationLoading = ref(false)
const showPoi = ref(false)
const showZones = ref(true)
const showGyms = ref(false)
const showRoutes = ref(false)
const showEventPlaces = ref(true)
const showEventZones = ref(true)
const showCphSprint = ref(false)
const useOrtofoto = ref(false)
const selectedPoi = ref<Feature | null>(null)
const selectedZone = ref<Feature | null>(null)

const selectedPoiName = computed(() => {
  if (!selectedPoi.value) return ''
  const name = props.language === 'da' 
    ? selectedPoi.value.get('text') 
    : selectedPoi.value.get('text_en')
  return name || 'Ukendt'
})

const selectedPoiType = computed(() => {
  if (!selectedPoi.value) return ''
  return selectedPoi.value.get('type') || ''
})

const selectedPoiDescription = computed(() => {
  if (!selectedPoi.value) return ''
  const description = props.language === 'da'
    ? selectedPoi.value.get('beskrivelse')
    : selectedPoi.value.get('description')
  return description || ''
})

const selectedZoneName = computed(() => {
  if (!selectedZone.value) return ''
  const name = props.language === 'da' 
    ? selectedZone.value.get('name_da') || selectedZone.value.get('name') || selectedZone.value.get('text')
    : selectedZone.value.get('name_en') || selectedZone.value.get('name') || selectedZone.value.get('text_en')
  return name || 'Ukendt'
})

const selectedZoneType = computed(() => {
  if (!selectedZone.value) return ''
  return selectedZone.value.get('type') || ''
})

let map: Map | null = null
let userLocationSource: VectorSource | null = null
let poiLayer: VectorLayer | null = null
let zonesLayer: VectorLayer | null = null
let gymsLayer: VectorLayer | null = null
let routesLayer: VectorLayer | null = null
let eventPlacesLayer: VectorLayer | null = null
let eventZonesLayer: VectorLayer | null = null
let cphSprintLayer: VectorLayer | null = null
let geolocationWatch: number | null = null
let baseLayerSkaermkort: any = null
let baseLayerOrto: any = null

const createUserLocationLayer = () => {
  userLocationSource = new VectorSource()
  const userLocationLayer = new VectorLayer({
    source: userLocationSource,
    style: new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: 'rgba(0, 122, 204, 0.8)',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }),
  })
  return userLocationLayer
}

const centerToUserLocation = () => {
  if (!map) return

  locationLoading.value = true

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const wgs84Coords: [number, number] = [longitude, latitude]
        const projection = getProjection('EPSG:25832')

        if (projection) {
          const epsg25832Coords = transform(wgs84Coords, 'EPSG:4326', 'EPSG:25832')

          // Dodaj/update marker
          if (userLocationSource) {
            userLocationSource.clear()
            const userPoint = new Feature({
              geometry: new Point(epsg25832Coords),
            })
            userLocationSource.addFeature(userPoint)
          }

          // Animér kort til brugerens lokation
          map?.getView().animate(
            {
              center: epsg25832Coords as [number, number],
              zoom: 12,
              duration: 1000,
            },
            () => {
              locationLoading.value = false
            }
          )
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        locationLoading.value = false
        alert(translations.value.map.locationError)
      }
    )
  } else {
    locationLoading.value = false
    alert(translations.value.map.locationNotSupported)
  }
}

const navigateToLocation = (location: Location) => {
  if (!map) return

  map.getView().animate({
    center: location.coordinates as [number, number],
    zoom: location.zoom,
    duration: 1000,
  })
}

watch(
  () => props.selectedLocation,
  (newLocation) => {
    if (newLocation && map) {
      navigateToLocation(newLocation)
    }
  }
)

watch(showPoi, (show) => {
  if (poiLayer) poiLayer.setVisible(show)
})

watch(showZones, (show) => {
  if (zonesLayer) zonesLayer.setVisible(show)
})

watch(showGyms, (show) => {
  if (gymsLayer) gymsLayer.setVisible(show)
})

watch(showRoutes, (show) => {
  if (routesLayer) routesLayer.setVisible(show)
})

watch(showEventPlaces, (show) => {
  if (eventPlacesLayer) eventPlacesLayer.setVisible(show)
})

watch(showEventZones, (show) => {
  if (eventZonesLayer) eventZonesLayer.setVisible(show)
})

watch(showCphSprint, (show) => {
  if (cphSprintLayer) cphSprintLayer.setVisible(show)
})

watch(useOrtofoto, (use) => {
  if (baseLayerSkaermkort) baseLayerSkaermkort.setVisible(!use)
  if (baseLayerOrto) baseLayerOrto.setVisible(use)
})

watch(() => props.language, (lang) => {
  if (poiLayer) {
    ;(poiLayer as any).setCurrentLanguage(lang)
  }
  if (eventPlacesLayer) {
    ;(eventPlacesLayer as any).setCurrentLanguage(lang)
  }
  if (eventZonesLayer) {
    ;(eventZonesLayer as any).setCurrentLanguage(lang)
  }
})

const handleMapClick = (event: MouseEvent) => {
  if (!map) return

  const pixel = map.getEventPixel(event)
  const poiFeatures: Feature[] = []
  const zoneFeatures: Feature[] = []
  const routeFeatures: Feature[] = []

  map.forEachFeatureAtPixel(pixel, (feature: any) => {
    // Check if it's a route feature (LineString geometry)
    const geom = feature.getGeometry()
    if (geom?.getType() === 'LineString') {
      routeFeatures.push(feature)
    }
    // Check if it's a POI feature (Point geometry with 'text' attribute)
    else if (geom?.getType() === 'Point' && (feature.get('text') !== undefined || feature.get('text_en') !== undefined)) {
      poiFeatures.push(feature)
    }
    // Check if it's an event zone feature (Polygon with 'text' or 'text_en' attribute)
    else if (geom?.getType() === 'Polygon' && (feature.get('text') !== undefined || feature.get('text_en') !== undefined)) {
      zoneFeatures.push(feature)
    }
  })

  // Prioritize routes - toggle selection instead of showing popup
  if (routeFeatures.length > 0) {
    ;(routesLayer as any).toggleRouteSelection(routeFeatures[0])
    selectedPoi.value = null
    selectedZone.value = null
  }
  // Then POI over zones if both are clicked
  else if (poiFeatures.length > 0) {
    selectedPoi.value = poiFeatures[0]
    selectedZone.value = null
  } else if (zoneFeatures.length > 0) {
    selectedZone.value = zoneFeatures[0]
    selectedPoi.value = null
  } else {
    selectedPoi.value = null
    selectedZone.value = null
  }
}

onMounted(async () => {
  if (!mapEl.value) return

  try {
    baseLayerSkaermkort = createSkaermkortGraaLayer()
    baseLayerOrto = createOrtoLayer()
    const userLocationLayer = createUserLocationLayer()
    const projection = getProjection('EPSG:25832')

    if (!projection) {
      throw new Error('EPSG:25832 projection is not registered')
    }

    // Set initial base layer visibility
    baseLayerSkaermkort.setVisible(!useOrtofoto.value)
    baseLayerOrto.setVisible(useOrtofoto.value)

    // Load POI layer
    try {
      poiLayer = await createPoiLayer(props.language)
      poiLayer.setVisible(showPoi.value)
    } catch (error) {
      console.warn('Could not load POI layer:', error)
    }

    // Load zones layer
    try {
      zonesLayer = await createZonesLayer(props.language)
      zonesLayer.setVisible(showZones.value)
    } catch (error) {
      console.warn('Could not load zones layer:', error)
    }

    // Load gyms layer
    try {
      gymsLayer = await createGymsLayer(props.language)
      gymsLayer.setVisible(showGyms.value)
    } catch (error) {
      console.warn('Could not load gyms layer:', error)
    }

    // Load routes layer
    try {
      routesLayer = await createRoutesLayer()
      routesLayer.setVisible(showRoutes.value)
    } catch (error) {
      console.warn('Could not load routes layer:', error)
    }

    // Load event places layer
    try {
      eventPlacesLayer = await createEventPlacesLayer(props.language)
      eventPlacesLayer.setVisible(showEventPlaces.value)
    } catch (error) {
      console.warn('Could not load event places layer:', error)
    }

    // Load event zones layer
    try {
      eventZonesLayer = await createEventZonesLayer(props.language)
      eventZonesLayer.setVisible(showEventZones.value)
    } catch (error) {
      console.warn('Could not load event zones layer:', error)
    }

    // Load CPH Sprint layer
    try {
      cphSprintLayer = await createCphSprintLayer()
      cphSprintLayer.setVisible(showCphSprint.value)
    } catch (error) {
      console.warn('Could not load CPH Sprint layer:', error)
    }

    const layers = [baseLayerSkaermkort, baseLayerOrto, userLocationLayer]
    if (zonesLayer) {
      layers.push(zonesLayer)
    }
    if (routesLayer) {
      layers.push(routesLayer)
    }
    if (gymsLayer) {
      layers.push(gymsLayer)
    }
    if (poiLayer) {
      layers.push(poiLayer)
    }
    if (eventPlacesLayer) {
      layers.push(eventPlacesLayer)
    }
    if (eventZonesLayer) {
      layers.push(eventZonesLayer)
    }
    if (cphSprintLayer) {
      layers.push(cphSprintLayer)
    }

    map = new Map({
      target: mapEl.value,
      layers: layers,
      controls: defaultControls().extend([
        new ScaleLine({ units: 'metric' }),
      ]),
      view: new View({
        projection,
        center: COPENHAGEN_CENTER,
        zoom: 8,
        minZoom: 0,
        maxZoom: MAP_MAX_ZOOM,
        resolutions: [...DAF_RESOLUTIONS],
        enableRotation: false,
      }),
    })

    // Update POI layer zoom level for label rendering
    if ((poiLayer || eventPlacesLayer || eventZonesLayer || zonesLayer) && map?.getView()) {
      const updateLayersZoom = () => {
        const zoom = map?.getView().getZoom()
        if (zoom !== undefined) {
          if (poiLayer) {
            ;(poiLayer as any).setCurrentZoom(zoom)
          }
          if (eventPlacesLayer) {
            ;(eventPlacesLayer as any).setCurrentZoom(zoom)
          }
          if (eventZonesLayer) {
            ;(eventZonesLayer as any).setCurrentZoom(zoom)
          }
          if (zonesLayer) {
            ;(zonesLayer as any).setCurrentZoom(zoom)
          }
        }
      }
      map.getView().on('change:resolution', updateLayersZoom)
    }
  } catch (error) {
    status.value = 'error'
    errorMessage.value =
      error instanceof Error ? error.message : translations.value.map.mapError
  }
})

onUnmounted(() => {
  if (geolocationWatch !== null) {
    navigator.geolocation.clearWatch(geolocationWatch)
  }
  map?.setTarget(undefined)
  map = null
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-light);
  color: var(--pokemon-black);
  font-size: 1.125rem;
}

.map-overlay--error {
  padding: 1.5rem;
  text-align: center;
  color: var(--primary-red);
  font-weight: 600;
}

.basemap-toggle-button {
  position: absolute;
  bottom: 7rem;
  right: 1.5rem;
  z-index: 10;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--primary-red);
  border: 2px solid var(--pokemon-black);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(138, 0, 0, 0.4);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.basemap-toggle-button:hover {
  background: var(--primary-dark-red);
  box-shadow: 0 6px 16px rgba(138, 0, 0, 0.5);
  transform: scale(1.05);
}

.location-button {
  position: absolute;
  bottom: 2rem;
  right: 1.5rem;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-red);
  border: 3px solid var(--pokemon-black);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(138, 0, 0, 0.4);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.location-button:hover:not(:disabled) {
  background: var(--primary-dark-red);
  box-shadow: 0 6px 16px rgba(138, 0, 0, 0.5);
  transform: scale(1.1);
}

.location-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .basemap-toggle-button {
    bottom: 6rem;
    right: 1rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }

  .location-button {
    bottom: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
}

.poi-popup {
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  z-index: 20;
  background: var(--pokemon-black);
  border: 2px solid var(--primary-red);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  min-width: 300px;
  max-width: 400px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.poi-popup__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-red);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.poi-popup__close:hover {
  transform: scale(1.2);
}

.poi-popup__title {
  margin: 0 0 0.5rem 0;
  padding-right: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  word-wrap: break-word;
}

.poi-popup__type {
  margin: 0;
  font-size: 1rem;
  color: var(--gray-light);
  text-transform: capitalize;
}

.poi-popup__description {
  margin: 0.75rem 0 0 0;
  font-size: 0.9rem;
  color: var(--gray-light);
  line-height: 1.5;
}

.zone-popup {
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  z-index: 20;
  background: var(--pokemon-black);
  border: 2px solid #22BB33;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  min-width: 300px;
  max-width: 400px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.zone-popup__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #22BB33;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.zone-popup__close:hover {
  transform: scale(1.2);
}

.zone-popup__title {
  margin: 0 0 0.5rem 0;
  padding-right: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  word-wrap: break-word;
}

.zone-popup__type {
  margin: 0;
  font-size: 1rem;
  color: var(--gray-light);
  text-transform: capitalize;
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

@media (max-width: 640px) {
  .poi-popup {
    bottom: 5.5rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }

  .zone-popup {
    bottom: 5.5rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>
