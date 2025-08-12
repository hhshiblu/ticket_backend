const fetch = require("node-fetch");

const API_BASE_URL = "http://localhost:5000/api";

async function testVendorStatusUpdate() {
  const vendorId = 1; // Test vendor ID
  const testStatuses = ["pending", "approved", "suspended"];

  try {
    console.log("Testing vendor status update functionality...\n");

    for (const status of testStatuses) {
      console.log(`Testing status update to: ${status}`);

      const response = await fetch(
        `${API_BASE_URL}/admin/vendors/${vendorId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const result = await response.json();

      console.log(`Response status: ${response.status}`);
      console.log(`Response:`, JSON.stringify(result, null, 2));

      if (result.success) {
        console.log(`✅ Vendor status updated to ${status} successfully!\n`);
      } else {
        console.log(
          `❌ Failed to update vendor status to ${status}:`,
          result.message,
          "\n"
        );
      }

      // Wait a bit between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Test getting all vendors to see the updated status
    console.log("Testing get all vendors...");
    const getVendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`);
    const vendorsResult = await getVendorsResponse.json();

    console.log("Vendors response:", JSON.stringify(vendorsResult, null, 2));
  } catch (error) {
    console.error("❌ Error testing vendor status update:", error.message);
  }
}

// Run the test
testVendorStatusUpdate();
