export type Language = 'en' | 'hi';

export interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  preferredLanguage: Language;
  location?: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  size?: string;
  cropType: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
}

export interface CropScan {
  id: string;
  ownerId: string;
  farmId?: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
  recommendation: string;
  timestamp: string;
}

export enum AgentType {
  WEATHER = 'Weather',
  MARKET = 'Market',
  PLANNING = 'Planning',
  SYSTEM = 'System'
}

export interface Alert {
  id: string;
  ownerId: string;
  agentType: AgentType;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  isRead: boolean;
}

export interface MandiPrice {
  commodity: string;
  market: string;
  price: number;
  unit: string;
  arrivalDate: string;
  trend: 'up' | 'down' | 'stable';
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  forecast: { day: string; temp: number; icon: string }[];
  risks: string[];
}
