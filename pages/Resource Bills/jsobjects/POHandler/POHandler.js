export default {
  addSelectedPOsToNewBill() {
    const existingPOs = appsmith.store.selectedNewPOs || [];
    const newlySelectedPOs = unbilled_po_table_new.selectedRows.filter(po => po.purchase_order_id);

    const uniquePOs = [
      ...existingPOs,
      ...newlySelectedPOs.filter(
        newPO => !existingPOs.some(existing => existing.purchase_order_id === newPO.purchase_order_id)
      )
    ];

    storeValue('selectedNewPOs', uniquePOs);

    update_selected_pos_is_billed.run(() => {
      storeValue('unbilledPOSelectedIndices', []);
      closeModal('Add_Purchase_Order_Modal');
      showModal('New_Modal');
    });
  }
}
