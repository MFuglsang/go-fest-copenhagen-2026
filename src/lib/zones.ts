import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Text from 'ol/style/Text'
import GeoJSON from 'ol/format/GeoJSON'

export async function createZonesLayer(_language: 'da' | 'en'): Promise<VectorLayer> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/zones.geojson')
    
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

    // Create style function with zoom awareness
    let currentZoom = 8

    const styleFunction = (feature: any) => {
      const type = feature.get('type')?.toLowerCase() || ''
      const name = feature.get('name') || ''

      const styles = []

      // Parks with green outline and no fill
      if (type === 'park') {
        styles.push(
          new Style({
            stroke: new Stroke({
              color: '#22BB33',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(34, 187, 51, 0)',
            }),
          })
        )
      } else {
        // Default style for other zones
        styles.push(
          new Style({
            stroke: new Stroke({
              color: '#CC1111',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(204, 17, 17, 0.1)',
            }),
          })
        )
      }

      // Add label text when zoomed in to level 10 or closer
      if (currentZoom >= 10 && name) {
        styles.push(
          new Style({
            text: new Text({
              text: name,
              font: 'bold 14px Arial',
              fill: new Fill({ color: '#333333' }),
              stroke: new Stroke({ color: '#ffffff', width: 3 }),
              overflow: true,
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
      zIndex: 99,
    })

    // Expose setCurrentZoom for external zoom updates
    ;(layer as any).setCurrentZoom = (zoom: number) => {
      currentZoom = zoom
      layer.setStyle(styleFunction)
    }

    return layer
  } catch (error) {
    console.error('Error loading zones layer:', error)
    throw error
  }
}
