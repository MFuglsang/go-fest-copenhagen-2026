import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import GeoJSON from 'ol/format/GeoJSON'

export async function createZonesLayer(_language: 'da' | 'en'): Promise<VectorLayer> {
  try {
    // Fetch GeoJSON file
    const response = await fetch('/data/zones.geojson')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch zones data: ${response.status}`)
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
    const styleFunction = (feature: any) => {
      const type = feature.get('type')?.toLowerCase() || ''

      // Parks with green outline and no fill
      if (type === 'park') {
        return new Style({
          stroke: new Stroke({
            color: '#22BB33',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(34, 187, 51, 0)',
          }),
        })
      }

      // Default style for other zones
      return new Style({
        stroke: new Stroke({
          color: '#CC1111',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(204, 17, 17, 0.1)',
        }),
      })
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: true,
      zIndex: 99,
    })

    return layer
  } catch (error) {
    console.error('Error loading zones layer:', error)
    throw error
  }
}
