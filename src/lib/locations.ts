export interface Location {
  id: string
  name: {
    da: string
    en: string
  }
  coordinates: [number, number]
  zoom: number
}

export const LOCATIONS: Location[] = [
  {
    id: 'rådhuspladsen',
    name: {
      da: 'Rådhuspladsen',
      en: 'City Hall Square',
    },
    coordinates: [724390.22, 6175789.88],
    zoom: 11,
  },
  {
    id: 'ørstedsparken',
    name: {
      da: 'Ørstedsparken',
      en: 'Ørsteds Park',
    },
    coordinates: [724192.62, 6176356.25],
    zoom: 11,
  },
  {
    id: 'kongenshave',
    name: {
      da: 'Kongens Have',
      en: 'King\'s Garden',
    },
    coordinates: [725019.58, 6176792.34],
    zoom: 11,
  },
  {
    id: 'faelledparken',
    name: {
      da: 'Fælledparken',
      en: 'Fælledparken',
    },
    coordinates: [724269.23, 6178446.89],
    zoom: 10,
  },
  {
    id: 'vestrekirkegaard',
    name: {
      da: 'Vestre Kirkegård',
      en: 'Vestre Cemetery',
    },
    coordinates: [721930.04, 6174011.71],
    zoom: 10,
  }

]
