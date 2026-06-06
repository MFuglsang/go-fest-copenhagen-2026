import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'

const ICON_MAP: Record<string, string> = {
  metro: '🚇',
  station: '🚂',
  sightseeing: '🏛️',
  shop: '🛒',
}

const getIconForType = (type: string): string => {
  return ICON_MAP[type?.toLowerCase()] || '📍'
}

export async function createPoiLayer(language: 'da' | 'en'): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const response = await fetch('/data/poi.geojson')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch POI data: ${response.status}`)
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

    // Create style function
    const styleFunction = (feature: Feature) => {
      const type = feature.get('type')?.toLowerCase() || ''
      const icon = getIconForType(type)

      return new Style({
        text: new Text({
          text: icon,
          font: 'bold 20px Arial',
          offsetY: -12,
        }),
      })
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: true,
      zIndex: 100,
    })

    return layer
  } catch (error) {
    console.error('Error loading POI layer:', error)
    throw error
  }
}
