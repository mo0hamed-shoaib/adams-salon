import { ShopData } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'shop-data.json');

export const defaultShopData: ShopData = {
  status: {
    isOpen: true,
    clientsInShop: 3,
    clientsComing: 2,
    waitingTime: 15,
  },
  workingHours: [
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '17:00' },
    { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '17:00' },
  ],
  services: [
    {
      id: '1',
      name: {
        ar: 'قص شعر كلاسيكي',
        en: 'Classic Haircut'
      },
      price: 25,
      image: 'https://i.postimg.cc/d3HK4pCg/haircut.jpg',
      description: {
        ar: 'قص شعر رجالي تقليدي مع تصفيف',
        en: 'Traditional men\'s haircut with styling'
      }
    },
    {
      id: '2',
      name: {
        ar: 'تشذيب اللحية',
        en: 'Beard Trim'
      },
      price: 15,
      image: 'https://i.postimg.cc/Y0qHNMvd/beard.jpg',
      description: {
        ar: 'تشذيب وتشكيل اللحية بشكل احترافي',
        en: 'Professional beard trimming and shaping'
      }
    },
    {
      id: '3',
      name: {
        ar: 'قص شعر + لحية',
        en: 'Haircut + Beard'
      },
      price: 35,
      image: 'https://i.postimg.cc/Kjv27x1g/hairandbeard.avif',
      description: {
        ar: 'باقة العناية الكاملة',
        en: 'Complete grooming package'
      }
    },
    {
      id: '4',
      name: {
        ar: 'غسيل وتصفيف الشعر',
        en: 'Hair Wash & Style'
      },
      price: 20,
      image: 'https://i.postimg.cc/5yNV5bXY/haid-dryer.jpg',
      description: {
        ar: 'غسيل وتصفيف الشعر بشكل احترافي',
        en: 'Professional hair wash and styling'
      }
    },
    {
      id: '5',
      name: {
        ar: 'تشذيب الشارب',
        en: 'Mustache Trim'
      },
      price: 10,
      image: 'https://i.postimg.cc/RhszXytR/mustach.jpg',
      description: {
        ar: 'تشذيب دقيق للشارب',
        en: 'Precise mustache trimming'
      }
    },
    {
      id: '6',
      name: {
        ar: 'حلاقة بالمنشفة الساخنة',
        en: 'Hot Towel Shave'
      },
      price: 30,
      image: 'https://i.postimg.cc/8cPSdN7j/towel.jpg',
      description: {
        ar: 'تجربة حلاقة تقليدية بالمنشفة الساخنة',
        en: 'Traditional hot towel shave experience'
      }
    },
  ],
  testimonials: [
    {
      id: '1',
      name: {
        ar: 'أحمد محمد',
        en: 'John Smith'
      },
      rating: 5,
      comment: {
        ar: 'أفضل صالون حلاقة في المدينة! آدم محترف حقيقي ويعطيني دائماً القصة المثالية.',
        en: 'Best barbershop in town! Adam is a true professional and always gives me the perfect cut.'
      },
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: {
        ar: 'محمد علي',
        en: 'Mike Johnson'
      },
      rating: 5,
      comment: {
        ar: 'جو رائع وخدمة ممتازة. وقت الانتظار معقول دائماً.',
        en: 'Great atmosphere and excellent service. The waiting time is always reasonable.'
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '3',
      name: {
        ar: 'علي حسن',
        en: 'David Wilson'
      },
      rating: 5,
      comment: {
        ar: 'خدمة احترافية مع الاهتمام بالتفاصيل. أنصح بشدة!',
        en: 'Professional service with attention to detail. Highly recommend!'
      },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
  ],
  location: {
    address: {
      ar: '123 شارع الرئيسي، وسط البلد، المدينة 12345',
      en: '123 Main Street, Downtown, City 12345'
    },
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1625764872000!5m2!1sen!2sus'
  }
};

// Initialize data with environment variables
const initializeShopData = (): ShopData => {
  const initialData = { ...defaultShopData };
  
  // Override with environment variables if available
  if (process.env.GOOGLE_MAPS_URL) {
    initialData.location.mapsUrl = process.env.GOOGLE_MAPS_URL;
  }
  
  return initialData;
};

// File-based persistence
const loadShopData = (): ShopData => {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Merge with defaults to ensure all properties exist (for backward compatibility)
      return { ...defaultShopData, ...data };
    }
  } catch (error) {
    console.error('Error loading shop data:', error);
  }
  
  // If no saved data exists, initialize with environment variables
  const initialData = initializeShopData();
  saveShopData(initialData);
  return initialData;
};

const saveShopData = (data: ShopData): void => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving shop data:', error);
  }
};

// Load data on startup
let shopData: ShopData = loadShopData();

export const getShopData = (): ShopData => {
  return shopData;
};

export const updateShopData = (newData: Partial<ShopData>): ShopData => {
  shopData = { ...shopData, ...newData };
  saveShopData(shopData);
  return shopData;
};

export const resetShopData = (): ShopData => {
  shopData = { ...defaultShopData };
  saveShopData(shopData);
  return shopData;
};
