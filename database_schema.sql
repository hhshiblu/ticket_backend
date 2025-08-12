-- Ticket System Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS ticket;
USE ticket;




-- Events table
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  event_date DATE,
  start_time TIME,
  end_time TIME,
  price DECIMAL(10,2),
  capacity INT,
  vendor_id INT,
  image_url VARCHAR(500),
  status ENUM('pending', 'active', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  event_id INT,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Withdrawals table
CREATE TABLE withdrawals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT,
  amount DECIMAL(10,2),
  bank_details TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  processed_by INT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Favorites table
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  event_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, event_id)
);

-- Orders table (for ticket purchases)
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  event_id INT,
  quantity INT DEFAULT 1,
  total_amount DECIMAL(10,2),
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Ticket types table (for event ticket pricing)
CREATE TABLE ticket_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Purchased tickets table
CREATE TABLE tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT,
  user_id INT,
  order_id INT,
  ticket_type_id INT,
  ticket_number VARCHAR(50) UNIQUE,
  status ENUM('active', 'used', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_events_vendor_id ON events(vendor_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_event_id ON payments(event_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_withdrawals_vendor_id ON withdrawals(vendor_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);

-- Insert sample data



INSERT INTO events (title, description, category, location, event_date, start_time, end_time, price, capacity, vendor_id, status) VALUES
('Summer Music Festival', 'A fantastic summer music festival with live bands', 'Music', 'Central Park, City', '2024-07-15', '18:00:00', '23:00:00', 50.00, 1000, 1, 'active'),
('Tech Conference 2024', 'Annual technology conference with industry experts', 'Technology', 'Convention Center, Town', '2024-08-20', '09:00:00', '17:00:00', 150.00, 500, 1, 'active'),
('Food & Wine Festival', 'Celebrate the best of local cuisine and wines', 'Food & Drink', 'Downtown Plaza, City', '2024-09-10', '12:00:00', '20:00:00', 75.00, 300, 2, 'pending');

-- Insert sample ticket types
INSERT INTO ticket_types (event_id, type, price, quantity, features) VALUES
(1, 'General Admission', 50.00, 800, '["Access to all music stages", "Food and drink vendors", "General seating area"]'),
(1, 'VIP Pass', 150.00, 200, '["Access to all music stages", "VIP seating area", "Complimentary food and drinks", "Meet & Greet with artists"]'),
(2, 'Standard Pass', 150.00, 400, '["Access to all conference sessions", "Lunch included", "Conference materials"]'),
(2, 'Premium Pass', 250.00, 100, '["Access to all conference sessions", "Lunch and dinner included", "Conference materials", "Networking event access"]'),
(3, 'General Entry', 75.00, 250, '["Access to all food stalls", "Wine tasting samples", "Live entertainment"]'),
(3, 'Premium Experience', 120.00, 50, '["Access to all food stalls", "Unlimited wine tasting", "Live entertainment", "Chef meet & greet"]');

-- Insert sample withdrawal/payout data
INSERT INTO withdrawals (vendor_id, amount, bank_details, status, processed_at) VALUES
(1, 2500.00, '{"bank_name": "City Bank", "account_number": "1234567890", "routing_number": "987654321"}', 'approved', '2024-01-15 10:30:00'),
(1, 1800.00, '{"bank_name": "City Bank", "account_number": "1234567890", "routing_number": "987654321"}', 'approved', '2024-02-01 14:20:00'),
(1, 3200.00, '{"bank_name": "City Bank", "account_number": "1234567890", "routing_number": "987654321"}', 'pending', NULL),
(2, 1200.00, '{"bank_name": "Town Bank", "account_number": "0987654321", "routing_number": "123456789"}', 'approved', '2024-01-20 09:15:00'),
(2, 950.00, '{"bank_name": "Town Bank", "account_number": "0987654321", "routing_number": "123456789"}', 'rejected', '2024-02-05 16:45:00');

-- Insert sample orders
INSERT INTO orders (user_id, event_id, quantity, total_amount, status, created_at) VALUES
(1, 1, 2, 100.00, 'confirmed', '2024-01-10 14:30:00'),
(1, 1, 1, 150.00, 'confirmed', '2024-01-12 09:15:00'),
(2, 1, 3, 150.00, 'confirmed', '2024-01-15 16:45:00'),
(1, 2, 1, 150.00, 'confirmed', '2024-01-20 11:20:00'),
(2, 2, 2, 500.00, 'confirmed', '2024-01-25 13:10:00'),
(1, 3, 1, 75.00, 'pending', '2024-02-01 10:30:00'),
(2, 3, 2, 240.00, 'confirmed', '2024-02-05 15:45:00');

-- Insert sample purchased tickets
INSERT INTO tickets (event_id, user_id, order_id, ticket_type_id, ticket_number, status, created_at) VALUES
(1, 1, 1, 1, 'TKT-001-001', 'active', '2024-01-10 14:30:00'),
(1, 1, 1, 1, 'TKT-001-002', 'active', '2024-01-10 14:30:00'),
(1, 1, 2, 2, 'TKT-002-001', 'active', '2024-01-12 09:15:00'),
(1, 2, 3, 1, 'TKT-003-001', 'active', '2024-01-15 16:45:00'),
(1, 2, 3, 1, 'TKT-003-002', 'active', '2024-01-15 16:45:00'),
(1, 2, 3, 1, 'TKT-003-003', 'used', '2024-01-15 16:45:00'),
(2, 1, 4, 3, 'TKT-004-001', 'active', '2024-01-20 11:20:00'),
(2, 2, 5, 4, 'TKT-005-001', 'active', '2024-01-25 13:10:00'),
(2, 2, 5, 4, 'TKT-005-002', 'active', '2024-01-25 13:10:00'),
(3, 1, 6, 5, 'TKT-006-001', 'active', '2024-02-01 10:30:00'),
(3, 2, 7, 6, 'TKT-007-001', 'active', '2024-02-05 15:45:00'),
(3, 2, 7, 6, 'TKT-007-002', 'active', '2024-02-05 15:45:00');

-- System settings table
CREATE TABLE system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  platform_name VARCHAR(255) NOT NULL DEFAULT 'E-Ticketing Platform',
  platform_description TEXT,
  support_email VARCHAR(255) NOT NULL DEFAULT 'support@etickets.com',
  default_currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  max_tickets_per_order INT NOT NULL DEFAULT 10,
  auto_approve_events BOOLEAN NOT NULL DEFAULT FALSE,
  require_vendor_verification BOOLEAN NOT NULL DEFAULT TRUE,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (platform_name, platform_description, support_email, default_currency, commission_rate, max_tickets_per_order, auto_approve_events, require_vendor_verification, maintenance_mode) VALUES
('E-Ticketing Platform', 'Multi-vendor e-ticketing platform for sports events', 'support@etickets.com', 'BDT', 5.00, 10, FALSE, TRUE, FALSE);
