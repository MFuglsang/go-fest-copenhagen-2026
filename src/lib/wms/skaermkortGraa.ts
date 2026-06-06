import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'

const WMS_LAYER = 'dtk_skaermkort_daempet'
const ATTRIBUTION =
  '© <a href="https://datafordeler.dk" target="_blank" rel="noopener">Datafordeler</a> / Klimadatastyrelsen'

function getWmsUrl(apiKey: string): string {
  const params = new URLSearchParams({ apikey: apiKey })
  return `https://wms.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?${params}`
}

export function createSkaermkortGraaLayer(): TileLayer<TileWMS> {
  const apiKey = import.meta.env.VITE_DATAFORDELER_API_KEY
  if (!apiKey) {
    throw new Error('VITE_DATAFORDELER_API_KEY is not set')
  }

  return new TileLayer({
    source: new TileWMS({
      url: getWmsUrl(apiKey),
      attributions: ATTRIBUTION,
      params: {
        LAYERS: WMS_LAYER,
        VERSION: '1.1.1',
        TRANSPARENT: 'FALSE',
        FORMAT: 'image/jpeg',
        STYLES: '',
      },
    }),
  })
}
