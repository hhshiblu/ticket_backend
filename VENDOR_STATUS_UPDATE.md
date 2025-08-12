# Vendor Status Update Functionality

## Overview

This document describes the vendor status update functionality for the admin panel, allowing administrators to change vendor statuses between 'pending', 'approved', and 'suspended'.

## Frontend Components

### 1. VendorStatusModal Component

**Location**: `ticket/src/components/VendorStatusModal.jsx`

**Features**:

- Dropdown select for status options (pending, approved, suspended)
- Real-time validation
- Loading states and error handling
- Success confirmation messages
- Visual status indicators with icons

**Props**:

- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal
- `vendor`: Vendor object with current data
- `onSuccess`: Callback function after successful update

**Usage**:

```jsx
<VendorStatusModal
  isOpen={isStatusModalOpen}
  onClose={() => setIsStatusModalOpen(false)}
  vendor={selectedVendor}
  onSuccess={() => setRefreshData((prev) => prev + 1)}
/>
```

### 2. Admin Vendors Page

**Location**: `ticket/src/app/(root_page)/admin/vendors/page.jsx`

**Features**:

- Vendor list with status badges
- Settings button for each vendor to open status modal
- Real-time status updates
- Responsive design

## Backend API

### 1. Frontend API Route

**Location**: `ticket/src/app/api/admin/vendors/[id]/status/route.js`

**Endpoint**: `PATCH /api/admin/vendors/:id/status`

**Request Body**:

```json
{
  "status": "approved" // or "pending", "suspended"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Vendor status updated to approved successfully"
}
```

### 2. Backend API Routes

**Location**: `ticket_backend/routes/admin.js`

**Endpoint**: `PUT /api/admin/vendors/:vendorId/status`

**Request Body**:

```json
{
  "status": "approved"
}
```

## Backend Implementation

### 1. AdminController

**Location**: `ticket_backend/controllers/AdminController.js`

**Method**: `updateVendorStatus(req, res)`

**Features**:

- Validates vendor ID and status
- Calls AdminService for business logic
- Returns appropriate HTTP status codes
- Error handling

### 2. AdminService

**Location**: `ticket_backend/services/AdminService.js`

**Method**: `updateVendorStatus(vendorId, status)`

**Features**:

- Validates status values (pending, approved, suspended)
- Calls AdminQueries for database operations
- Returns success/error responses

### 3. AdminQueries

**Location**: `ticket_backend/mysqlquery/AdminQueries.js`

**Method**: `updateVendorStatus(vendorId, status)`

**Features**:

- Direct database update query
- Returns boolean indicating success
- Error handling for database operations

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

## User Interface

### Status Update Button

- **Location**: Each vendor card in admin panel
- **Icon**: Settings gear
- **Color**: Blue
- **Action**: Opens VendorStatusModal

### Status Modal Features

- **Current Status Display**: Shows vendor's current status
- **Status Selection**: Dropdown with all available statuses
- **Validation**: Prevents submitting same status
- **Loading State**: Shows spinner during update
- **Success Message**: Confirms successful update
- **Error Handling**: Displays validation errors

## Testing

### Backend Test

**Location**: `ticket_backend/test_vendor_status.js`

**Features**:

- Tests all status transitions
- Validates API responses
- Checks database updates

**Run Test**:

```bash
node test_vendor_status.js
```

### Frontend Testing

1. Navigate to `/admin/vendors`
2. Click settings button on any vendor
3. Select different status from dropdown
4. Submit the form
5. Verify status updates in the list

## Error Handling

### Frontend Errors

- **Network Error**: "Network error. Please try again."
- **Validation Error**: "Please select a valid status"
- **Server Error**: Displays server error message

### Backend Errors

- **Invalid Status**: Returns 400 with validation message
- **Vendor Not Found**: Returns 404
- **Database Error**: Returns 500 with error details

## Security Considerations

- **Authentication**: Admin routes should require admin authentication
- **Authorization**: Only admins can update vendor statuses
- **Input Validation**: All status values are validated
- **SQL Injection**: Uses parameterized queries
- **Rate Limiting**: API endpoints are rate limited

## API Endpoints Summary

| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| GET    | `/api/admin/vendors`            | Get all vendors                 |
| PUT    | `/api/admin/vendors/:id/status` | Update vendor status            |
| PATCH  | `/api/admin/vendors/:id/status` | Update vendor status (frontend) |

## Usage Example

### Update Vendor Status

```javascript
// Frontend API call
const response = await fetch("/api/admin/vendors/1/status", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: "approved",
  }),
});

const result = await response.json();
console.log(result.message); // "Vendor status updated to approved successfully"
```

### Backend API call

```javascript
// Backend API call
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
