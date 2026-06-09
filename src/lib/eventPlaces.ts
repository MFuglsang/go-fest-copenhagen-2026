import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import GeoJSON from 'ol/format/GeoJSON'

const ICON_MAP: Record<string, string> = {
  entrance: '⭐',
  meeting_point: '🤝',
  info: 'ℹ️',
  shop: '🎪',
  tech: '🛠️',
  hub: '🟠',
  rocket: '🚀',
  aid: '🚑',
  hydration: '🫗',
  power: '🪫',
  battle: '⚔️',
  lounge: '🛖',
  wayfarer: '❗',
  greet: '👋',
  broadcast: '📺',
  toilet: '🚻',
}

const getIconForType = (type: string): string => {
  return ICON_MAP[type?.toLowerCase()] || '📍'
}

export async function createEventPlacesLayer(language: 'da' | 'en'): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/event%20places.geojson')

    if (!response.ok) {
      throw new Error(`Failed to fetch event places data: ${response.status}`)
    }

    const geojson = await response.json()

    // Create GeoJSON format and read features
    const format = new GeoJSON()
    const features = format.readFeatures(geojson, {
      featureProjection: 'EPSG:25832',
    })

    // Create vector source
    const source = new VectorSource({
      features: features,
    })

    // Create style function with zoom and language awareness
    let currentZoom = 8
    let currentLanguage = language

    const styleFunction = (feature: any) => {
      const type = feature.get('type')?.toLowerCase() || ''
      const icon = getIconForType(type)
      const text = currentLanguage === 'da' ? feature.get('text') : feature.get('text_en')

      const styles = [
        new Style({
          text: new Text({
            text: icon,
            font: 'bold 20px Arial',
            offsetY: -12,
          }),
        }),
      ]

      // Add label text when zoomed in to level 10 or closer
      if (currentZoom >= 10 && text) {
        styles.push(
          new Style({
            text: new Text({
              text: text,
              font: 'bold 12px Arial',
              fill: new Fill({ color: '#ffffff' }),
              stroke: new Stroke({ color: '#000000', width: 2 }),
              offsetY: 8,
            }),
          })
        )
      }

      return styles
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: true,
      zIndex: 100,
    })

    // Expose setCurrentZoom for external zoom updates
    ;(layer as any).setCurrentZoom = (zoom: number) => {
      currentZoom = zoom
      layer.setStyle(styleFunction)
    }

    // Expose setCurrentLanguage for external language updates
    ;(layer as any).setCurrentLanguage = (lang: 'da' | 'en') => {
      currentLanguage = lang
      layer.setStyle(styleFunction)
    }

    return layer
  } catch (error) {
    console.error('Error loading event places layer:', error)
    throw error
  }
}
