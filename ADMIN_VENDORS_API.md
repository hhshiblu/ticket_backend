# Admin Vendors API Documentation

## Overview

This document describes the Admin Vendors functionality that allows administrators to manage vendors, view their statistics, and update their statuses.

## Backend API Endpoints

### 1. Get All Vendors

**Endpoint**: `GET /api/admin/vendors`

**Description**: Retrieves all vendors with their statistics and event information.

**Response**:

```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": 1,
        "name": "Event Pro",
        "email": "contact@eventpro.com",
        "phone": "+1122334455",
        "address": "123 Event Street",
        "company_name": "Event Pro Ltd",
        "business_type": "Event Management",
        "event_types": ["sports", "music", "corporate"],
        "experience": "5 years",
        "description": "Professional event management company",
        "status": "approved",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "total_events": 5,
        "total_capacity": 1000,
        "total_tickets_sold": 500
      }
    ],
    "total": 1
  },
  "message": "Vendors retrieved successfully"
}
```

### 2. Get Dashboard Statistics

**Endpoint**: `GET /api/admin/dashboard/stats`

**Description**: Retrieves comprehensive dashboard statistics including vendor counts by status.

**Response**:

```json
{
  "success": true,
  "data": {
    "total_vendors": 10,
    "active_vendors": 5,
    "pending_vendors": 3,
    "suspended_vendors": 2,
    "total_events": 25,
    "total_tickets": 1500,
    "total_revenue": 75000.00,
    "pending_events": 5,
    "active_events": 15,
    "recent_orders": [...],
    "recent_events": [...]
  },
  "message": "Dashboard statistics retrieved successfully"
}
```

### 3. Update Vendor Status

**Endpoint**: `PUT /api/admin/vendors/:vendorId/status`

**Description**: Updates a vendor's status to pending, approved, or suspended.

**Request Body**:

```json
{
  "status": "approved"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Vendor status updated to approved successfully"
}
```

## Frontend Implementation

### 1. Admin Vendors Page

**Location**: `ticket/src/app/(root_page)/admin/vendors/page.jsx`

**Features**:

- Dynamic data fetching from backend API
- Real-time search and filtering
- Status-based filtering
- Loading states and error handling
- Responsive design
- Vendor status update modal integration

**Key Components**:

- Search functionality
- Status filter dropdown
- Vendor cards with statistics
- Settings button for status updates
- Statistics summary cards

### 2. Vendor Status Modal

**Location**: `ticket/src/components/VendorStatusModal.jsx`

**Features**:

- Status selection dropdown
- Real-time validation
- Loading states
- Success/error messaging
- Direct backend API integration

## Database Schema

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
  event_types JSON,
  experience VARCHAR(50),
  description TEXT,
  status ENUM('pending', 'approved', 'suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Status Values

### 1. Pending

- **Description**: Vendor has registered but not yet approved
- **Color**: Yellow
- **Icon**: Clock
- **Permissions**: Limited access

### 2. Approved

- **Description**: Vendor is fully approved and can create events
- **Color**: Green
- **Icon**: UserCheck
- **Permissions**: Full access

### 3. Suspended

- **Description**: Vendor is temporarily suspended
- **Color**: Red
- **Icon**: UserX
- **Permissions**: No access

## Backend Architecture

### 1. AdminController

**Location**: `ticket_backend/controllers/AdminController.js`

**Methods**:

- `getAllVendors(req, res)` - Get all vendors
- `getDashboardStats(req, res)` - Get dashboard statistics
- `updateVendorStatus(req, res)` - Update vendor status

### 2. AdminService

**Location**: `ticket_backend/services/AdminService.js`

**Methods**:

- `getAllVendors()` - Business logic for getting vendors
- `getDashboardStats()` - Business logic for dashboard stats
- `updateVendorStatus(vendorId, status)` - Business logic for status updates

### 3. AdminQueries

**Location**: `ticket_backend/mysqlquery/AdminQueries.js`

**Methods**:

- `getAllVendors()` - Database query for vendors with statistics
- `getDashboardStats()` - Database query for comprehensive stats
- `updateVendorStatus(vendorId, status)` - Database update query

## API Routes

### Backend Routes

**Location**: `ticket_backend/routes/admin.js`

```javascript
// Vendor Management
router.get("/vendors", adminController.getAllVendors.bind(adminController));
router.put(
  "/vendors/:vendorId/status",
  adminController.updateVendorStatus.bind(adminController)
);

// Dashboard
router.get(
  "/dashboard/stats",
  adminController.getDashboardStats.bind(adminController)
);
```

## Testing

### Backend Test

**Location**: `ticket_backend/test_admin_vendors.js`

**Features**:

- Tests all vendor endpoints
- Validates API responses
- Tests status updates
- Checks database operations

**Run Test**:

```bash
cd ticket_backend
node test_admin_vendors.js
```

### Frontend Testing

1. Navigate to `/admin/vendors`
2. Verify data loading and display
3. Test search functionality
4. Test status filtering
5. Test vendor status updates
6. Verify real-time data refresh

## Error Handling

### Backend Errors

- **Invalid Status**: Returns 400 with validation message
- **Vendor Not Found**: Returns 404
- **Database Error**: Returns 500 with error details

### Frontend Errors

- **Network Error**: Displays error message with retry button
- **Loading State**: Shows spinner during data fetch
- **Empty State**: Shows message when no vendors found

## Security Considerations

- **Authentication**: Admin routes should require admin authentication
- **Authorization**: Only admins can update vendor statuses
- **Input Validation**: All status values are validated
- **SQL Injection**: Uses parameterized queries
- **Rate Limiting**: API endpoints are rate limited

## Usage Examples

### Update Vendor Status

```javascript
// Frontend API call
const response = await fetch(
  "http://localhost:5000/api/admin/vendors/1/status",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "approved",
    }),
  }
);

const result = await response.json();
console.log(result.message); // "Vendor status updated to approved successfully"
```

### Get All Vendors

```javascript
// Frontend API call
const response = await fetch("http://localhost:5000/api/admin/vendors");
const result = await response.json();
console.log(`Total vendors: ${result.data.total}`);
```

### Get Dashboard Stats

```javascript
// Frontend API call
const response = await fetch("http://localhost:5000/api/admin/dashboard/stats");
const result = await response.json();
console.log(`Active vendors: ${result.data.active_vendors}`);
```

## Performance Considerations

- **Database Indexing**: Indexes on `email`, `status`, `created_at`
- **Query Optimization**: Efficient JOINs for vendor statistics
- **Caching**: Consider caching dashboard stats
- **Pagination**: Implement pagination for large vendor lists

## Future Enhancements

1. **Bulk Operations**: Update multiple vendor statuses at once
2. **Advanced Filtering**: Filter by date range, event types, etc.
3. **Export Functionality**: Export vendor data to CSV/Excel
4. **Audit Trail**: Track status change history
5. **Email Notifications**: Notify vendors of status changes
6. **Analytics Dashboard**: Detailed vendor performance metrics
