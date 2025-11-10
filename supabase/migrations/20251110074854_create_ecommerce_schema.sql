/*
  # E-commerce Database Schema

  ## Overview
  Complete database schema for e-commerce application with products, categories, orders, and user management.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (e.g., Kitchen, Personal Care, Household)
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category image URL
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product identifier
  - `description` (text) - Product description
  - `price` (numeric) - Product price
  - `image_url` (text) - Main product image URL
  - `stock_quantity` (integer) - Available stock quantity
  - `is_active` (boolean) - Product availability status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `product_images`
  - `id` (uuid, primary key) - Unique image identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `image_url` (text) - Image URL
  - `display_order` (integer) - Order for displaying images
  - `created_at` (timestamptz) - Record creation timestamp

  ### `orders`
  - `id` (uuid, primary key) - Unique order identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `status` (text) - Order status (pending, processing, shipped, delivered, cancelled)
  - `total_amount` (numeric) - Total order amount
  - `shipping_address` (jsonb) - Shipping address details
  - `contact_info` (jsonb) - Contact information
  - `notes` (text) - Order notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `order_items`
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid, foreign key) - Reference to orders table
  - `product_id` (uuid, foreign key) - Reference to products table
  - `quantity` (integer) - Quantity ordered
  - `price_at_purchase` (numeric) - Price at time of purchase
  - `created_at` (timestamptz) - Record creation timestamp

  ### `cart_items`
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid, foreign key) - Reference to auth.users (nullable for guest users)
  - `session_id` (text) - Session identifier for guest users
  - `product_id` (uuid, foreign key) - Reference to products table
  - `quantity` (integer) - Quantity in cart
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for categories and products
  - Authenticated users can manage their own cart items and orders
  - Orders are read-only after creation
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) DEFAULT 0,
  shipping_address jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_purchase numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT cart_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for products (public read for active products)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for product_images (public read)
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Guest cart policies (using session_id)
CREATE POLICY "Anyone can view cart by session"
  ON cart_items FOR SELECT
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anyone can insert cart by session"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anyone can update cart by session"
  ON cart_items FOR UPDATE
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL)
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Anyone can delete cart by session"
  ON cart_items FOR DELETE
  TO public
  USING (session_id IS NOT NULL AND user_id IS NULL);

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Kitchen', 'kitchen', 'Kitchen essentials and groceries', '/images/ki.jpg'),
  ('Personal Care', 'personal-care', 'Personal care and beauty products', '/images/ba.jpg'),
  ('Household', 'household', 'Household items and cleaning supplies', '/images/co.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, price, image_url, stock_quantity) 
SELECT 
  c.id,
  'Moong Dal',
  'moong-dal',
  'Premium quality moong dal, rich in protein and fiber',
  12.00,
  '/images/of.png',
  100
FROM categories c WHERE c.slug = 'kitchen'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, image_url, stock_quantity) 
SELECT 
  c.id,
  'Sunflower Oil',
  'sunflower-oil',
  'Pure sunflower oil for healthy cooking',
  70.00,
  '/images/of1.png',
  50
FROM categories c WHERE c.slug = 'kitchen'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, image_url, stock_quantity) 
SELECT 
  c.id,
  'Kabuli Chana (1 kg)',
  'kabuli-chana',
  'Premium kabuli chana, perfect for various dishes',
  80.00,
  '/images/of2.png',
  75
FROM categories c WHERE c.slug = 'kitchen'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, price, image_url, stock_quantity) 
SELECT 
  c.id,
  'Soya Chunks (1 kg)',
  'soya-chunks',
  'High protein soya chunks for healthy meals',
  90.00,
  '/images/of3.png',
  60
FROM categories c WHERE c.slug = 'kitchen'
ON CONFLICT (slug) DO NOTHING;