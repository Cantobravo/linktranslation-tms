export default {
  async insertNewBillAndAssignPOs () {
    try {
      await insert_resource_bill.run();
      await get_last_resource_bill_id.run();

      const billId = get_last_resource_bill_id.data[0].last_id;
      const selectedPOs = appsmith.store.selectedNewPOs;

      for (let po of selectedPOs) {
        await assign_po_to_bill.run({
          bill_id: billId,
          purchase_order_id: po.purchase_order_id
        });
      }

      showAlert("Bill created successfully", "success");
      closeModal("New_Modal");
      get_resource_bills.run();
    } catch (e) {
      showAlert("Error creating bill: " + e.message, "error");
    }
  }
}
