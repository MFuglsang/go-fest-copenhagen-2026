import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Text from 'ol/style/Text'
import GeoJSON from 'ol/format/GeoJSON'

const COLOR_MAP: Record<string, { outline: string; fill: string }> = {
  recriutment: {
    outline: '#FFE680', // pastel gul
    fill: 'rgba(255, 230, 128, 0.25)', // 75% transparent
  },
  cultivation: {
    outline: '#99CCFF', // pastel blå
    fill: 'rgba(153, 204, 255, 0.25)', // 75% transparent
  },
  conservatory: {
    outline: '#FF99CC', // pastel lyserød
    fill: 'rgba(255, 153, 204, 0.25)', // 75% transparent
  },
  rocket: {
    outline: '#FF9999', // pastel rød
    fill: 'rgba(255, 153, 153, 0.25)', // 75% transparent
  },
}

export async function createEventZonesLayer(language: 'da' | 'en'): Promise<VectorLayer<VectorSource>> {
  try {
    // Fetch GeoJSON file
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(baseUrl + 'data/event%20zones.geojson')

    if (!response.ok) {
      throw new Error(`Failed to fetch event zones data: ${response.status}`)
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
      const colors = COLOR_MAP[type] || COLOR_MAP['recriutment']

      const styles = [
        new Style({
          stroke: new Stroke({
            color: colors.outline,
            width: 2,
          }),
          fill: new Fill({
            color: colors.fill,
          }),
        }),
      ]

      // Add label text when zoomed in to level 10 or closer
      if (currentZoom >= 10) {
        const text = currentLanguage === 'da' ? feature.get('text') : feature.get('text_en')
        
        if (text) {
          styles.push(
            new Style({
              text: new Text({
                text: text,
                font: 'bold 14px Arial',
                fill: new Fill({ color: '#333333' }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
                overflow: true,
              }),
            })
          )
        }
      }

      return styles
    }

    // Create vector layer
    const layer = new VectorLayer({
      source: source,
      style: styleFunction,
      visible: true,
      zIndex: 98,
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
    console.error('Error loading event zones layer:', error)
    throw error
  }
}
