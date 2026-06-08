import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import GeoJSON from 'ol/format/GeoJSON'

export async function createCphSprintLayer(): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/cph_sprint.geojson')

    if (!response.ok) {
      throw new Error(`Failed to fetch CPH Sprint data: ${response.status}`)
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

    // Create style for sprint areas
    const styleFunction = (_feature: any) => {
      return [
        new Style({
          fill: new Fill({
            color: 'rgba(255, 200, 0, 0.2)', // Semi-transparent yellow
          }),
          stroke: new Stroke({
            color: '#FFC800',
            width: 2,
          }),
        }),
      ]
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: false, // Hidden by default
      zIndex: 50,
    })

    return layer
  } catch (error) {
    console.error('Error loading CPH Sprint layer:', error)
    throw error
  }
}
