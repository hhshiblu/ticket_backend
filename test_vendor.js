const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCreateVendor() {
  const vendorData = {
    name: "Test Vendor",
    email: "test@vendor.com",
    phone: "+8801234567890",
    address: "Dhaka, Bangladesh",
    company_name: "Test Company Ltd",
    business_type: "Event Management",
    event_types: ["Music", "Sports", "Corporate"],
    experience: "5+ years",
    description: "Professional event management company with 5+ years of experience"
  };

  try {
    console.log('Testing createVendor...');
    console.log('Vendor data:', JSON.stringify(vendorData, null, 2));

    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Vendor created successfully!');
    } else {
      console.log('❌ Failed to create vendor:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing createVendor:', error.message);
  }
}

// Run the test
testCreateVendor();
