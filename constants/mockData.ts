import { Place, Shop } from '@/types';

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Sunset Bistro',
    category: 'restaurant',
    price: 25,
    distance: 0.8,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    description: 'Cozy bistro with amazing sunset views and local cuisine',
    location: { latitude: 37.7849, longitude: -122.4094 },
    address: '123 Sunset Blvd, San Francisco, CA',
    isOpen: true,
    openingHours: '11:00 AM - 10:00 PM'
  },
  {
    id: '2',
    name: 'Golden Gate Park',
    category: 'park',
    price: 0,
    distance: 1.2,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg',
    description: 'Beautiful park perfect for family outings and picnics',
    location: { latitude: 37.7694, longitude: -122.4862 },
    address: 'Golden Gate Park, San Francisco, CA',
    isOpen: true,
    openingHours: '6:00 AM - 10:00 PM'
  },
  {
    id: '3',
    name: 'Cinema Palace',
    category: 'movie',
    price: 15,
    distance: 0.5,
    rating: 4.2,
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    description: 'Modern cinema with latest blockbusters and comfortable seating',
    location: { latitude: 37.7849, longitude: -122.4094 },
    address: '456 Movie St, San Francisco, CA',
    isOpen: true,
    openingHours: '10:00 AM - 12:00 AM'
  },
  {
    id: '4',
    name: 'Art Gallery Downtown',
    category: 'attraction',
    price: 12,
    distance: 1.8,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg',
    description: 'Contemporary art gallery featuring local and international artists',
    location: { latitude: 37.7849, longitude: -122.4094 },
    address: '789 Art Ave, San Francisco, CA',
    isOpen: true,
    openingHours: '9:00 AM - 6:00 PM'
  },
  {
    id: '5',
    name: 'Jazz Night at Blue Moon',
    category: 'show',
    price: 30,
    distance: 1.5,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    description: 'Live jazz performances every Friday night',
    location: { latitude: 37.7849, longitude: -122.4094 },
    address: '321 Music Ln, San Francisco, CA',
    isOpen: true,
    openingHours: '7:00 PM - 2:00 AM'
  }
];

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Corner Coffee Shop',
    category: 'Coffee & Tea',
    description: 'Artisan coffee and fresh pastries',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    location: { latitude: 37.7849, longitude: -122.4094 },
    address: '123 Corner St, San Francisco, CA',
    ownerId: 'owner1',
    isVerified: true,
    rating: 4.3,
    priceRange: '$'
  },
  {
    id: '2',
    name: 'Fresh Fruit Stand',
    category: 'Food & Grocery',
    description: 'Fresh local fruits and vegetables',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg',
    location: { latitude: 37.7694, longitude: -122.4862 },
    address: '456 Market St, San Francisco, CA',
    ownerId: 'owner2',
    isVerified: true,
    rating: 4.1,
    priceRange: '$'
  }
];