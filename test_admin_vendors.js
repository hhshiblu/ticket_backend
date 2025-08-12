const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAdminVendors() {
  try {
    console.log('Testing Admin Vendors API...\n');

    // Test 1: Get all vendors
    console.log('1. Testing GET /admin/vendors');
    const vendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`);
    const vendorsResult = await vendorsResponse.json();
    
    console.log(`Response status: ${vendorsResponse.status}`);
    console.log(`Success: ${vendorsResult.success}`);
    console.log(`Total vendors: ${vendorsResult.data?.total || 0}`);
    console.log(`Vendors data:`, JSON.stringify(vendorsResult.data?.vendors?.slice(0, 2), null, 2));
    console.log('');

    // Test 2: Get dashboard stats
    console.log('2. Testing GET /admin/dashboard/stats');
    const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
    const statsResult = await statsResponse.json();
    
    console.log(`Response status: ${statsResponse.status}`);
    console.log(`Success: ${statsResult.success}`);
    console.log(`Stats data:`, JSON.stringify(statsResult.data, null, 2));
    console.log('');

    // Test 3: Update vendor status (if vendors exist)
    if (vendorsResult.data?.vendors?.length > 0) {
      const testVendor = vendorsResult.data.vendors[0];
      console.log(`3. Testing PUT /admin/vendors/${testVendor.id}/status`);
      
      const testStatuses = ['pending', 'approved', 'suspended'];
      
      for (const status of testStatuses) {
        console.log(`   Testing status: ${status}`);
        const updateResponse = await fetch(`${API_BASE_URL}/admin/vendors/${testVendor.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        const updateResult = await updateResponse.json();
        console.log(`   Response status: ${updateResponse.status}`);
        console.log(`   Success: ${updateResult.success}`);
        console.log(`   Message: ${updateResult.message}`);
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      console.log('3. Skipping vendor status update test - no vendors found');
    }

    console.log('\n✅ Admin Vendors API test completed!');

  } catch (error) {
    console.error('❌ Error testing Admin Vendors API:', error.message);
  }
}

// Run the test
testAdminVendors();
