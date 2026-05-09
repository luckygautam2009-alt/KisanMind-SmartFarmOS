import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationInfo {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  error?: string;
  loading: boolean;
}

interface LocationContextType {
  location: LocationInfo;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType>({
  location: { lat: 0, lng: 0, loading: false },
  requestLocation: () => {},
});

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationInfo>({
    lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi', loading: false // Default Fallback location (Delhi)
  });

  const fetchCityName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
      const data = await res.json();
      return { city: data.city || data.locality || 'Unknown City', state: data.principalSubdivision || 'Unknown State' };
    } catch (e) {
      return { city: 'Unknown Location', state: '' };
    }
  };

  const requestLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: undefined }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const { city, state } = await fetchCityName(lat, lng);
          
          setLocation({
            lat,
            lng,
            city,
            state,
            loading: false
          });
        },
        (error) => {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Location access denied or unavailable. Using default.'
          }));
        }
      );
    } else {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported.'
      }));
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
