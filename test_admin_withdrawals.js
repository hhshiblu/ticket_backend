const fetch = require("node-fetch");

const API_BASE_URL = "http://localhost:5000/api";

async function testAdminWithdrawals() {
  try {
    console.log("Testing Admin Withdrawals API...\n");

    // Test 1: Get all withdrawals
    console.log("1. Testing GET /admin/withdrawals");
    const withdrawalsResponse = await fetch(
      `${API_BASE_URL}/admin/withdrawals`
    );
    const withdrawalsResult = await withdrawalsResponse.json();

    console.log(`Response status: ${withdrawalsResponse.status}`);
    console.log(`Success: ${withdrawalsResult.success}`);
    console.log(`Total withdrawals: ${withdrawalsResult.data?.total || 0}`);
    console.log(
      `Withdrawals data:`,
      JSON.stringify(withdrawalsResult.data?.withdrawals?.slice(0, 2), null, 2)
    );
    console.log("");

    // Test 2: Get dashboard stats
    console.log("2. Testing GET /admin/dashboard/stats");
    const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
    const statsResult = await statsResponse.json();

    console.log(`Response status: ${statsResponse.status}`);
    console.log(`Success: ${statsResult.success}`);
    console.log(`Stats data:`, JSON.stringify(statsResult.data, null, 2));
    console.log("");

    // Test 3: Update withdrawal status (if withdrawals exist)
    if (withdrawalsResult.data?.withdrawals?.length > 0) {
      const testWithdrawal = withdrawalsResult.data.withdrawals[0];
      console.log(
        `3. Testing PUT /admin/withdrawals/${testWithdrawal.id}/status`
      );

      const testStatuses = ["pending", "approved", "rejected", "completed"];

      for (const status of testStatuses) {
        console.log(`   Testing status: ${status}`);
        const updateResponse = await fetch(
          `${API_BASE_URL}/admin/withdrawals/${testWithdrawal.id}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
          }
        );

        const updateResult = await updateResponse.json();
        console.log(`   Response status: ${updateResponse.status}`);
        console.log(`   Success: ${updateResult.success}`);
        console.log(`   Message: ${updateResult.message}`);

        // Wait a bit between requests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } else {
      console.log(
        "3. Skipping withdrawal status update test - no withdrawals found"
      );
    }

    console.log("\n✅ Admin Withdrawals API test completed!");
  } catch (error) {
    console.error("❌ Error testing Admin Withdrawals API:", error.message);
  }
}

// Run the test
testAdminWithdrawals();
