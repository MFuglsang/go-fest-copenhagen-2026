export interface Link {
  id: string
  name: {
    da: string
    en: string
  },
  url: string
}

export const LOCATIONS: Link[] = [
  {
    id: 'Weather_radar',
    name: {
      da: 'Nedbørsradar',
      en: 'Weather radar',
    },
    url: 'https://www.dmi.dk/radar/'
  },
    {
    id: 'Weather_forecast',
    name: {
      da: 'Vejrudsigt',
      en: 'Weather forecast',
    },
    url: 'https://www.dmi.dk/lokation/show/DK/6615303/%C3%98sterbro'
  },
  {
    id: 'event_website',
    name: {
      da: 'Event website',
      en: 'Event website',
    },
    url: 'https://pokemongo.com/en/gofest/copenhagen'
  },
  {
    id: 'emergency_services',
    name: {
      da: 'Nødberedskab',
      en: 'Emergency services',
    },
    url: 'https://politi.dk/om-politiet/kontakt-politiet/alarm-112'
  },
    {
    id: 'public_transport',
    name: {
      da: 'Offentlig transport',
      en: 'Public transport',
    },
    url: 'https://cphtransitmap.dk/en/'
       }



]  



