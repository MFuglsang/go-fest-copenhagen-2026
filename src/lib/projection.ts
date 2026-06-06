import proj4 from 'proj4'
import { get as getProjection } from 'ol/proj'
import { register } from 'ol/proj/proj4'

proj4.defs(
  'EPSG:25832',
  '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
)

register(proj4)

getProjection('EPSG:25832')?.setExtent([
  120000, 5661139.2, 1378291.2, 6500000,
])
