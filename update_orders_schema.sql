-- Update orders table to add missing columns
USE ticket;

-- Add customer_info and payment_method columns to orders table
ALTER TABLE orders 
ADD COLUMN customer_info JSON AFTER status,
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash_on_delivery' AFTER customer_info;

-- Update existing orders to have default values
UPDATE orders SET 
customer_info = '{}',
payment_method = 'cash_on_delivery'
WHERE customer_info IS NULL OR payment_method IS NULL;
