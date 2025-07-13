export interface User {
  id: string;
  email: string;
  name: string;
  type: 'customer' | 'shop_owner';
  avatar?: string;
}

export interface Place {
  id: string;
  name: string;
  category: 'restaurant' | 'show' | 'park' | 'movie' | 'attraction' | 'shop' | 'event';
  price: number;
  distance: number;
  rating: number;
  image: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  isOpen: boolean;
  openingHours?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  ownerId: string;
  isVerified: boolean;
  rating: number;
  priceRange: string;
}

export interface Filter {
  priceRange: [number, number];
  distance: number;
  members: number;
  category?: string;
}