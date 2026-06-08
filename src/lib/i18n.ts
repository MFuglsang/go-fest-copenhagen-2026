export type Language = 'da' | 'en'

export interface Translations {
  header: {
    title: string
    subtitle: string
    selectLocation: string
  }
  map: {
    findMyLocation: string
    findingLocation: string
    locationError: string
    locationNotSupported: string
    mapError: string
    cphSprint: string
  }
}

const translations: Record<Language, Translations> = {
  da: {
    header: {
      title: 'Go Fest Copenhagen',
      subtitle: '2026',
      selectLocation: 'Gå til lokation...',
    },
    map: {
      findMyLocation: 'Gå til min lokation',
      findingLocation: 'Finder din lokation...',
      locationError: 'Kunne ikke finde din lokation. Kontroller venligst din browser-indstilling.',
      locationNotSupported: 'Geolocation er ikke understøttet af din browser.',
      mapError: 'Kortet kunne ikke indlæses',
      cphSprint: 'Cph sprint',
    },
  },
  en: {
    header: {
      title: 'Go Fest Copenhagen',
      subtitle: '2026',
      selectLocation: 'Go to location...',
    },
    map: {
      findMyLocation: 'Go to my location',
      findingLocation: 'Finding your location...',
      locationError: 'Could not find your location. Please check your browser settings.',
      locationNotSupported: 'Geolocation is not supported by your browser.',
      mapError: 'Map could not be loaded',
      cphSprint: 'Cph sprint',
    },
  },
}

export const getTranslations = (language: Language): Translations => {
  return translations[language]
}
