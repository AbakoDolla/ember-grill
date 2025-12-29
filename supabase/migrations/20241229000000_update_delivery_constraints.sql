-- Update orders table with new delivery constraints
-- Migration: 20241229000000_update_delivery_constraints.sql

-- Add new columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS requested_delivery_date DATE,
ADD COLUMN IF NOT EXISTS estimated_delivery_time TIME;

-- Add constraints for delivery dates
ALTER TABLE orders
ADD CONSTRAINT valid_delivery_day CHECK (
  EXTRACT(DOW FROM requested_delivery_date) IN (5, 6, 0) -- 5=Friday, 6=Saturday, 0=Sunday
),
ADD CONSTRAINT minimum_advance_booking CHECK (
  requested_delivery_date >= (CURRENT_DATE + INTERVAL '7 days')
);

-- Update existing orders to have a default delivery date (next Friday)
UPDATE orders
SET requested_delivery_date = CASE
  WHEN EXTRACT(DOW FROM CURRENT_DATE) <= 5
  THEN CURRENT_DATE + INTERVAL '7 days' + (5 - EXTRACT(DOW FROM CURRENT_DATE)) * INTERVAL '1 day'
  ELSE CURRENT_DATE + INTERVAL '7 days' + (12 - EXTRACT(DOW FROM CURRENT_DATE)) * INTERVAL '1 day'
END
WHERE requested_delivery_date IS NULL;

-- Make requested_delivery_date NOT NULL after setting defaults
ALTER TABLE orders
ALTER COLUMN requested_delivery_date SET NOT NULL;

-- Update indexes for better performance with new date fields
CREATE INDEX IF NOT EXISTS idx_orders_requested_delivery_date ON orders(requested_delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_day ON orders(EXTRACT(DOW FROM requested_delivery_date));

-- Update RLS policies to include new constraints
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR customer_id IS NOT NULL
  );

-- Add comment to document the new delivery system
COMMENT ON TABLE orders IS 'Orders table with week-ahead booking system. Deliveries only on Friday, Saturday, Sunday. Payment collected immediately after order confirmation.';