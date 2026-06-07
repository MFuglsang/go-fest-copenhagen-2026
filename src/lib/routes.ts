import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import GeoJSON from 'ol/format/GeoJSON'

const ROUTE_STROKE_COLOR = '#CC1111' // Pokemon red
const ROUTE_SELECTED_COLOR = '#0066FF' // Blue
const ROUTE_STROKE_WIDTH = 2.5

export async function createRoutesLayer(): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/routes.geojson')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch routes data: ${response.status}`)
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

    // Track selected routes
    const selectedRoutes = new Set<any>()

    // Create style function
    const styleFunction = (feature: any) => {
      const isSelected = selectedRoutes.has(feature)
      const color = isSelected ? ROUTE_SELECTED_COLOR : ROUTE_STROKE_COLOR

      return new Style({
        stroke: new Stroke({
          color: color,
          width: ROUTE_STROKE_WIDTH,
          lineDash: [4, 4], // Dashed line
        }),
      })
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: true,
      zIndex: 50,
    })

    // Expose methods for managing selected routes
    ;(layer as any).toggleRouteSelection = (feature: any) => {
      if (selectedRoutes.has(feature)) {
        selectedRoutes.delete(feature)
      } else {
        // Clear all other selections and select only this one
        selectedRoutes.clear()
        selectedRoutes.add(feature)
      }
      layer.setStyle(styleFunction)
    }

    ;(layer as any).getSelectedRoutes = () => selectedRoutes

    ;(layer as any).clearSelection = () => {
      selectedRoutes.clear()
      layer.setStyle(styleFunction)
    }

    return layer
  } catch (error) {
    console.error('Error loading routes layer:', error)
    throw error
  }
}
