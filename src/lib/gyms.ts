import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import GeoJSON from 'ol/format/GeoJSON'

const GYM_ICON = '🎯'

export async function createGymsLayer(_language: 'da' | 'en'): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/gyms.geojson')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gyms data: ${response.status}`)
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

    // Create style function - just show icon, no labels
    const styleFunction = (_feature: any) => {
      return new Style({
        text: new Text({
          text: GYM_ICON,
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
    console.error('Error loading gyms layer:', error)
    throw error
  }
}
