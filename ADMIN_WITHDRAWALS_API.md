# Admin Withdrawals API Documentation

## Overview

This document describes the Admin Withdrawals functionality that allows administrators to manage vendor withdrawal requests, view their statistics, and update their statuses.

## Backend API Endpoints

### 1. Get All Withdrawals

**Endpoint**: `GET /api/admin/withdrawals`

**Description**: Retrieves all withdrawal requests with vendor information.

**Response**:

```json
{
  "success": true,
  "data": {
    "withdrawals": [
      {
        "id": 1,
        "vendor_id": 1,
        "amount": 5000.0,
        "bank_details": "{\"payment_method\":\"bKash\",\"bkash_number\":\"01712345678\",\"account_holder\":\"Vendor Payout\"}",
        "status": "pending",
        "created_at": "2024-01-15T10:30:00Z",
        "processed_at": null,
        "vendor_name": "Event Pro",
        "vendor_email": "contact@eventpro.com"
      }
    ],
    "total": 1
  },
  "message": "Withdrawals retrieved successfully"
}
```

### 2. Update Withdrawal Status

**Endpoint**: `PUT /api/admin/withdrawals/:withdrawalId/status`

**Description**: Updates a withdrawal's status to pending, approved, rejected, or completed.

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
  "message": "Withdrawal approved successfully"
}
```

## Frontend Implementation

### 1. Admin Payments Page

**Location**: `ticket/src/app/(root_page)/admin/payments/page.jsx`

**Features**:

- Dynamic data fetching from backend API
- Real-time search and filtering
- Status-based filtering
- Loading states and error handling
- Responsive design
- Withdrawal status update modal integration

**Key Components**:

- Search functionality
- Status filter dropdown
- Withdrawal cards with details
- Settings button for status updates
- Statistics summary cards

### 2. Withdrawal Status Modal

**Location**: `ticket/src/components/WithdrawalStatusModal.jsx`

**Features**:

- Status selection dropdown
- Real-time validation
- Loading states
- Success/error messaging
- Direct backend API integration
- Withdrawal details display

## Database Schema

### Withdrawals Table

```sql
CREATE TABLE withdrawals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  bank_details JSON,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

## Status Values

### 1. Pending

- **Description**: Withdrawal request is under review
- **Color**: Yellow
- **Icon**: Clock
- **Action**: Admin can approve or reject

### 2. Approved

- **Description**: Withdrawal request has been approved and is ready for processing
- **Color**: Green
- **Icon**: CheckCircle
- **Action**: Admin can mark as completed

### 3. Rejected

- **Description**: Withdrawal request has been rejected
- **Color**: Red
- **Icon**: XCircle
- **Action**: No further action needed

### 4. Completed

- **Description**: Withdrawal has been processed and completed
- **Color**: Blue
- **Icon**: CheckCircle
- **Action**: No further action needed

## Backend Architecture

### 1. AdminController

**Location**: `ticket_backend/controllers/AdminController.js`

**Methods**:

- `getAllWithdrawals(req, res)` - Get all withdrawals
- `updateWithdrawalStatus(req, res)` - Update withdrawal status

### 2. AdminService

**Location**: `ticket_backend/services/AdminService.js`

**Methods**:

- `getAllWithdrawals()` - Business logic for getting withdrawals
- `updateWithdrawalStatus(withdrawalId, status)` - Business logic for status updates

### 3. AdminQueries

**Location**: `ticket_backend/mysqlquery/AdminQueries.js`

**Methods**:

- `getAllWithdrawals()` - Database query for withdrawals with vendor info
- `updateWithdrawalStatus(withdrawalId, status, processedAt)` - Database update query

## API Routes

### Backend Routes

**Location**: `ticket_backend/routes/admin.js`

```javascript
// Withdrawal Management
router.get(
  "/withdrawals",
  adminController.getAllWithdrawals.bind(adminController)
);
router.put(
  "/withdrawals/:withdrawalId/status",
  adminController.updateWithdrawalStatus.bind(adminController)
);
```

## Testing

### Backend Test

**Location**: `ticket_backend/test_admin_withdrawals.js`

**Features**:

- Tests all withdrawal endpoints
- Validates API responses
- Tests status updates
- Checks database operations

**Run Test**:

```bash
cd ticket_backend
node test_admin_withdrawals.js
```

### Frontend Testing

1. Navigate to `/admin/payments`
2. Verify data loading and display
3. Test search functionality
4. Test status filtering
5. Test withdrawal status updates
6. Verify real-time data refresh

## Error Handling

### Backend Errors

- **Invalid Status**: Returns 400 with validation message
- **Withdrawal Not Found**: Returns 404
- **Database Error**: Returns 500 with error details

### Frontend Errors

- **Network Error**: Displays error message with retry button
- **Loading State**: Shows spinner during data fetch
- **Empty State**: Shows message when no withdrawals found

## Security Considerations

- **Authentication**: Admin routes should require admin authentication
- **Authorization**: Only admins can update withdrawal statuses
- **Input Validation**: All status values are validated
- **SQL Injection**: Uses parameterized queries
- **Rate Limiting**: API endpoints are rate limited

## Usage Examples

### Update Withdrawal Status

```javascript
// Frontend API call
const response = await fetch(
  "http://localhost:5000/api/admin/withdrawals/1/status",
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
console.log(result.message); // "Withdrawal approved successfully"
```

### Get All Withdrawals

```javascript
// Frontend API call
const response = await fetch("http://localhost:5000/api/admin/withdrawals");
const result = await response.json();
console.log(`Total withdrawals: ${result.data.total}`);
```

## Performance Considerations

- **Database Indexing**: Indexes on `vendor_id`, `status`, `created_at`
- **Query Optimization**: Efficient JOINs for vendor information
- **Caching**: Consider caching withdrawal statistics
- **Pagination**: Implement pagination for large withdrawal lists

## Future Enhancements

1. **Bulk Operations**: Update multiple withdrawal statuses at once
2. **Advanced Filtering**: Filter by date range, amount range, etc.
3. **Export Functionality**: Export withdrawal data to CSV/Excel
4. **Audit Trail**: Track status change history
5. **Email Notifications**: Notify vendors of status changes
6. **Analytics Dashboard**: Detailed withdrawal performance metrics
7. **Payment Integration**: Direct integration with payment gateways
8. **Automated Processing**: Auto-approve withdrawals under certain conditions
