export default {
  async saveBill() {
    try {
      // Step 1: Insert New Bill
      await insert_resource_bill.run();

      // Step 2: Retrieve Last Inserted Bill ID
      await get_last_inserted_bill_id.run();
      const billID = get_last_inserted_bill_id.data[0].last_bill_id;
      await storeValue('newBillID', billID);

      console.log("DEBUG — newBillID (from DB):", billID);

      // Step 2.5: Small Delay to Ensure DB Commit (Optional)
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // Step 3: Validate Selected Purchase Orders
      const selectedPOs = appsmith.store.selectedNewPOs;
      if (!selectedPOs || selectedPOs.length === 0) {
        showAlert("No Purchase Orders selected.", "warning");
        return;
      }

      // Step 4: Extract PO IDs as Array of Numbers
      const poIDArray = selectedPOs.map(po => po.purchase_order_id);

      console.log("DEBUG — selected_po_ids Array:", poIDArray);

      // Step 5: Assign Purchase Orders to the Bill (pass array to query param)
      await assign_pos_to_bill.run({
        selected_po_ids: poIDArray
      });

      // Step 6: Refresh the Billing Table
      await get_resource_bills.run({ refresh_key: Date.now() });

      // Step 7: Reset State & Close Modal
      await storeValue('selectedNewPOs', []);
      closeModal('New_Modal');

      showAlert('Bill Saved Successfully', 'success');

    } catch (e) {
      console.error("ERROR Saving Bill:", e);
      showAlert('Error Saving Bill: ' + (e.message || e), 'error');
    }
  }
};
