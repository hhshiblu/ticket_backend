# Ticket Backend API

Express.js backend server for the ticket management system with MySQL database.

## Features

- **Event Management**: CRUD operations for events
- **Vendor Management**: Vendor registration, approval, and management
- **User Management**: User operations and dashboard
- **Payment Processing**: Payment and withdrawal management
- **MySQL Database**: Robust database operations with connection pooling
- **Security**: Helmet, CORS, Rate limiting
- **Class-based Architecture**: Clean, maintainable code structure

## Project Structure

```
ticket_backend/
├── controllers/          # HTTP request handlers
│   ├── EventController.js
│   └── VendorController.js
├── services/            # Business logic layer
│   ├── EventService.js
│   └── VendorService.js
├── mysqlquery/          # Database query classes
│   ├── EventQueries.js
│   ├── VendorQueries.js
│   ├── UserQueries.js
│   └── PaymentQueries.js
├── db/                  # Database connection
│   └── database.js
├── routes/              # API routes
│   ├── events.js
│   └── vendors.js
├── server.js            # Main server file
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   cd ticket_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your database credentials and other settings.

4. **Set up MySQL database**
   - Create a MySQL database named `ticket_system`
   - Update the database credentials in `.env` file

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Events
- `GET /api/events` - Get all events with filters
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/status` - Update event status (admin only)
- `GET /api/events/vendor/my-events` - Get vendor's events
- `GET /api/events/search` - Search events

### Vendors
- `GET /api/vendors` - Get all vendors with pagination
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor
- `PATCH /api/vendors/:id/approve` - Approve vendor
- `PATCH /api/vendors/:id/suspend` - Suspend vendor
- `GET /api/vendors/:vendorId/dashboard` - Get vendor dashboard
- `GET /api/vendors/status/:status` - Get vendors by status
- `GET /api/vendors/search` - Search vendors
- `GET /api/vendors/stats` - Get vendor statistics

### Health Check
- `GET /health` - Server health check

## Database Schema

The system expects the following MySQL tables:

### Events Table
```sql
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Vendors Table
```sql
CREATE TABLE vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  company_name VARCHAR(255),
  business_type VARCHAR(100),
  status ENUM('pending', 'approved', 'suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255),
  address TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  event_id INT,
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | ticket_system |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `JWT_SECRET` | JWT secret key | - |

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Structure

The application follows a layered architecture:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic and validation
3. **Queries**: Handle database operations
4. **Database**: Manages database connections

All classes are instantiated and used throughout the application for better maintainability and testability.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Request validation
- **Error Handling**: Comprehensive error handling

## Contributing

1. Follow the existing code structure
2. Use classes for all new functionality
3. Add proper error handling
4. Include input validation
5. Write clear documentation

## License

This project is licensed under the ISC License.
