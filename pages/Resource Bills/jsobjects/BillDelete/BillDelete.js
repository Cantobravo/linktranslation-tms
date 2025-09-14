export default {
  async run() {
    if (appsmith.store.billDelBusy) return;
    if (!appsmith.store.billRow?.resource_bill_id) {
      showAlert('No bill selected to delete.', 'warning');
      return;
    }

    await storeValue('billDelBusy', true);
    try {
      await del_bill_po_link_all.run();
      await upd_pos_unbill_by_bill.run();
      await del_resource_bill.run();

      closeModal('Delete_Bill_Modal');
      showAlert('Bill deleted successfully.', 'success');

      await get_resource_bills.run();
      await get_unbilled_purchase_orders_n.run();

      await storeValue('billRow', undefined);
    } catch (e) {
      showAlert('Delete error: ' + (e?.message || e), 'error');
    } finally {
      await storeValue('billDelBusy', false);
    }
  }
}
