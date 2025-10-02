export interface ShopStatus {
  isOpen: boolean;
  clientsInShop: number;
  clientsComing: number;
  waitingTime: number; // in minutes
  manualOverride?: {
    isOpen: boolean;
    lastUpdated: string; // ISO date string
    reason?: string; // Optional reason for override
  };
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Service {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  price: number;
  image: string;
  description?: {
    ar: string;
    en: string;
  };
}

export interface Testimonial {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  rating: number;
  comment: {
    ar: string;
    en: string;
  };
  avatar?: string;
}

export interface ShopData {
  status: ShopStatus;
  workingHours: WorkingHours[];
  services: Service[];
  testimonials: Testimonial[];
  location: {
    address: {
      ar: string;
      en: string;
    };
    mapsUrl: string;
  };
}
