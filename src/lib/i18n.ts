export type Language = 'da' | 'en'

export interface Translations {
  header: {
    title: string
    subtitle: string
    selectLocation: string
  }
  disclaimer: string
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
    disclaimer:
      'Alle data i denne app er manuelt indsamlet - der er ingen garanti for at de er rigtige, og der tages ikke ansvar for deres rigtighed.',
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
    disclaimer:
      'All data in this app has been collected manually - there is no guarantee that it is correct, and no responsibility is taken for its accuracy.',
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
