-- Create tables for Ember Grill restaurant application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_cron for scheduled tasks (optional)
-- CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('fish', 'beef', 'braise', 'sides')),
  spice_level INTEGER DEFAULT 1 CHECK (spice_level >= 1 AND spice_level <= 3),
  popular BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  preparation_time INTEGER DEFAULT 15, -- minutes
  allergens TEXT[], -- array of allergens
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (for guest orders)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES auth.users(id),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  special_instructions TEXT,
  requested_delivery_date DATE NOT NULL, -- Date de livraison souhaitée (vendredi, samedi ou dimanche)
  estimated_delivery_time TIME, -- Heure de livraison estimée
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Contrainte : livraison seulement vendredi, samedi, dimanche
  CONSTRAINT valid_delivery_day CHECK (
    EXTRACT(DOW FROM requested_delivery_date) IN (5, 6, 0) -- 5=Friday, 6=Saturday, 0=Sunday
  ),
  -- Contrainte : commande doit être faite au moins 7 jours à l'avance
  CONSTRAINT minimum_advance_booking CHECK (
    requested_delivery_date >= (CURRENT_DATE + INTERVAL '7 days')
  )
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES auth.users(id),
  customer_id UUID REFERENCES customers(id),
  menu_item_id UUID REFERENCES menu_items(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_promotions table
CREATE TABLE IF NOT EXISTS order_promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  postal_codes TEXT[], -- array of postal codes
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  estimated_time INTEGER DEFAULT 45, -- minutes
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_id UUID REFERENCES customers(id),
  type TEXT NOT NULL, -- 'order_status', 'promotion', 'general'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB, -- additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_popular ON menu_items(popular);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_id ON reviews(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Menu items policies (public read)
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (available = true);

-- Admin policies for menu items
CREATE POLICY "Admins can manage menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can view their guest orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR customer_id IS NOT NULL);

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Order items policies
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.customer_id IN (
        SELECT id FROM customers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      ))
    )
  );

CREATE POLICY "Users can create order items with orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.customer_id IS NOT NULL)
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their orders" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = reviews.order_id
      AND (orders.user_id = auth.uid() OR orders.customer_id IN (
        SELECT id FROM customers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      ))
    )
  );

-- Promotions policies
CREATE POLICY "Active promotions are viewable by everyone" ON promotions
  FOR SELECT USING (active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage promotions" ON promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Delivery zones policies
CREATE POLICY "Delivery zones are viewable by everyone" ON delivery_zones
  FOR SELECT USING (active = true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Restaurant settings policies
CREATE POLICY "Restaurant settings are viewable by everyone" ON restaurant_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage restaurant settings" ON restaurant_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total DECIMAL(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(quantity * unit_price), 0) INTO total
  FROM order_items
  WHERE order_items.order_id = calculate_order_total.order_id;

  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to apply promotion discount
CREATE OR REPLACE FUNCTION apply_promotion_discount(
  order_total DECIMAL(10,2),
  promotion_code TEXT
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  promotion_record RECORD;
  discount DECIMAL(10,2) := 0;
BEGIN
  SELECT * INTO promotion_record
  FROM promotions
  WHERE code = promotion_code
    AND active = true
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (max_uses IS NULL OR used_count < max_uses);

  IF FOUND THEN
    IF promotion_record.discount_type = 'percentage' THEN
      discount := order_total * (promotion_record.discount_value / 100);
    ELSE
      discount := promotion_record.discount_value;
    END IF;

    -- Ensure discount doesn't exceed order total
    discount := LEAST(discount, order_total);
  END IF;

  RETURN discount;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_user_id UUID DEFAULT NULL,
  p_customer_id UUID DEFAULT NULL,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, customer_id, type, title, message, data)
  VALUES (p_user_id, p_customer_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Update updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to create notification on order status change
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    PERFORM create_notification(
      NEW.user_id,
      NEW.customer_id,
      'order_status',
      'Order Status Updated',
      'Your order status has been updated to: ' || NEW.status,
      jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_notification
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_change();

-- Insert sample data

-- Insert sample menu data
INSERT INTO menu_items (name, description, price, image_url, category, spice_level, popular, preparation_time, allergens) VALUES
('Grilled Tilapia Royale', 'Fresh tilapia marinated in our signature African spice blend, grilled to perfection over open flames. Served with plantains and attiéké.', 24.99, '/assets/food/grilled-tilapia.jpg', 'fish', 2, true, 20, ARRAY['fish']),
('Smoked Catfish Deluxe', 'Slow-smoked catfish infused with hickory and palm wood, glazed with a tangy pepper sauce.', 22.99, '/assets/food/smoked-catfish.jpg', 'fish', 2, false, 25, ARRAY['fish']),
('Flame-Kissed Mackerel', 'Whole mackerel charred with herbs and citrus, served with spicy green pepper sauce.', 19.99, '/assets/food/grilled-mackerel.jpg', 'fish', 3, false, 18, ARRAY['fish']),
('Suya Beef', 'Tender beef skewers marinated in spicy peanut sauce, grilled over open flames.', 26.99, '/assets/food/suya-beef.jpg', 'beef', 3, true, 15, ARRAY['peanuts', 'soy']),
('Beef Brochette', 'Juicy beef cubes seasoned with African spices, grilled to perfection.', 23.99, '/assets/food/beef-brochette.jpg', 'beef', 2, false, 12, ARRAY['soy']),
('Grilled Ribeye', 'Premium ribeye steak grilled over charcoal with garlic herb butter.', 32.99, '/assets/food/grilled-ribeye.jpg', 'beef', 1, false, 20, ARRAY['dairy', 'garlic']),
('Poulet Braisé', 'Tender chicken braised in rich tomato sauce with African spices.', 21.99, '/assets/food/poulet-braise.jpg', 'braise', 2, true, 30, ARRAY['chicken']),
('Porc Braisé', 'Slow-braised pork in spicy palm oil sauce with vegetables.', 25.99, '/assets/food/porc-braise.jpg', 'braise', 3, false, 35, ARRAY['pork']),
('Plantain Fries', 'Crispy fried plantains served with spicy dipping sauce.', 8.99, '/assets/food/plantain-fries.jpg', 'sides', 2, false, 10, ARRAY['soy']),
('Attiéké', 'Steamed fermented cassava couscous, traditional West African side.', 7.99, '/assets/food/attieke.jpg', 'sides', 1, false, 8, ARRAY[]::TEXT[]),
('Jollof Rice', 'Fragrant rice cooked in rich tomato sauce with peppers and spices.', 9.99, '/assets/food/jollof-rice.jpg', 'sides', 2, true, 15, ARRAY[]::TEXT[]),
('Grilled Corn', 'Sweet corn grilled over open flames with herb butter.', 6.99, '/assets/food/grilled-corn.jpg', 'sides', 1, false, 12, ARRAY['dairy']);

-- Insert sample promotions
INSERT INTO promotions (code, description, discount_type, discount_value, minimum_order, max_uses, valid_from, valid_until) VALUES
('FIRSTFLAME', '15% off for first order', 'percentage', 15, 20, NULL, NOW(), NOW() + INTERVAL '1 year'),
('WEEKEND20', '20€ off on weekends', 'fixed', 20, 50, NULL, NOW(), NOW() + INTERVAL '6 months'),
('LOYALTY10', '10% off for loyal customers', 'percentage', 10, 30, 100, NOW(), NOW() + INTERVAL '1 year');

-- Insert sample delivery zones
INSERT INTO delivery_zones (name, postal_codes, delivery_fee, minimum_order, estimated_time) VALUES
('Brussels Center', ARRAY['1000', '1050', '1040'], 0, 25, 30),
('Brussels North', ARRAY['1020', '1030', '1120'], 2.99, 25, 35),
('Brussels South', ARRAY['1060', '1080', '1090'], 2.99, 25, 35),
('Brussels East', ARRAY['1070', '1080', '1190'], 3.99, 30, 40),
('Brussels West', ARRAY['1200', '1210', '1150'], 3.99, 30, 40);

-- Insert sample restaurant settings
INSERT INTO restaurant_settings (key, value, description) VALUES
('business_hours', '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}', 'Business hours for each day'),
('contact_info', '{"phone": "+32212345678", "email": "contact@brazzaflame.be", "address": "123 Flame Street, Brussels, Belgium"}', 'Contact information'),
('delivery_settings', '{"free_delivery_threshold": 50, "max_delivery_distance": 15, "preparation_buffer": 10}', 'Delivery configuration'),
('payment_methods', '["card", "cash", "bancontact"]', 'Accepted payment methods');