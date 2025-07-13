/*
  # Create ExploreEase Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `user_type` (enum: customer, shop_owner)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `places`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (enum: restaurant, show, park, movie, attraction, shop, event)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `address` (text)
      - `is_open` (boolean)
      - `opening_hours` (text, optional)
      - `owner_id` (uuid, references profiles, optional for shops)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to places
*/

-- Create enum types
CREATE TYPE user_type AS ENUM ('customer', 'shop_owner');
CREATE TYPE place_category AS ENUM ('restaurant', 'show', 'park', 'movie', 'attraction', 'shop', 'event');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  user_type user_type NOT NULL DEFAULT 'customer',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create places table
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category place_category NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  address text NOT NULL,
  is_open boolean NOT NULL DEFAULT true,
  opening_hours text,
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Places policies
CREATE POLICY "Anyone can read places"
  ON places
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Shop owners can insert places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'shop_owner'
    )
  );

CREATE POLICY "Shop owners can update own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Shop owners can delete own places"
  ON places
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_location ON places(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_places_owner ON places(owner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Insert sample data
INSERT INTO places (name, category, description, price, image_url, latitude, longitude, address, is_open, opening_hours) VALUES
('Sunset Bistro', 'restaurant', 'Cozy bistro with amazing sunset views and local cuisine', 25.00, 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg', 37.7849, -122.4094, '123 Sunset Blvd, San Francisco, CA', true, '11:00 AM - 10:00 PM'),
('Golden Gate Park', 'park', 'Beautiful park perfect for family outings and picnics', 0.00, 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg', 37.7694, -122.4862, 'Golden Gate Park, San Francisco, CA', true, '6:00 AM - 10:00 PM'),
('Cinema Palace', 'movie', 'Modern cinema with latest blockbusters and comfortable seating', 15.00, 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg', 37.7849, -122.4094, '456 Movie St, San Francisco, CA', true, '10:00 AM - 12:00 AM'),
('Art Gallery Downtown', 'attraction', 'Contemporary art gallery featuring local and international artists', 12.00, 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg', 37.7849, -122.4094, '789 Art Ave, San Francisco, CA', true, '9:00 AM - 6:00 PM'),
('Jazz Night at Blue Moon', 'show', 'Live jazz performances every Friday night', 30.00, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 37.7849, -122.4094, '321 Music Ln, San Francisco, CA', true, '7:00 PM - 2:00 AM');