import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'

export function createOrtoLayer() {
  const apiKey = import.meta.env.VITE_DATAFORDELER_API_KEY
  const url = `https://wms.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/wms?apikey=${apiKey}`

  const source = new TileWMS({
    url: url,
    params: {
      LAYERS: 'orto_foraar',
      TILED: true,
    },
    serverType: 'geoserver',
  })

  const layer = new TileLayer({
    source: source,
    visible: false,
    zIndex: 0,
  })

  return layer
}
