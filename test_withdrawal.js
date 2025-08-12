const fetch = require("node-fetch");

const API_BASE_URL = "http://localhost:5000/api";

async function testCreateWithdrawal() {
  const withdrawalData = {
    vendor_id: 1,
    amount: 1000.0,
    bank_details: JSON.stringify({
      payment_method: "bKash",
      bkash_number: "01712345678",
      account_holder: "Test Vendor",
    }),
    status: "pending",
  };

  try {
    console.log("Testing createWithdrawal...");
    console.log("Withdrawal data:", JSON.stringify(withdrawalData, null, 2));

    const response = await fetch(`${API_BASE_URL}/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withdrawalData),
    });

    const result = await response.json();

    console.log("Response status:", response.status);
    console.log("Response:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("✅ Withdrawal created successfully!");

      // Test getting vendor withdrawals
      console.log("\nTesting getVendorWithdrawals...");
      const getResponse = await fetch(`${API_BASE_URL}/withdrawals/vendor/1`);
      const getResult = await getResponse.json();
      console.log(
        "Get withdrawals response:",
        JSON.stringify(getResult, null, 2)
      );
    } else {
      console.log("❌ Failed to create withdrawal:", result.message);
    }
  } catch (error) {
    console.error("❌ Error testing withdrawal:", error.message);
  }
}

// Run the test
testCreateWithdrawal();
