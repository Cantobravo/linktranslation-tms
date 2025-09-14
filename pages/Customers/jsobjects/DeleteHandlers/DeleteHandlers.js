export default {
  async openCustomer(row) {
    await storeValue('customerRow', row);
    showModal('modal_customer_soft_delete'); // your confirm modal
  },

  async confirmCustomer() {
    const row = appsmith.store.customerRow;

    // 0) Basic guardrails + visibility of current settings
    if (!row || !row.customer_id) {
      showAlert('Missing customer id', 'warning');
      return;
    }
    const id = Number(row.customer_id);
    const toggleOn = !!toggle_show_inactive_customers.isSwitchedOn;

    try {
      // 1) Run the soft delete
      await del_customer_soft.run({ customer_id: id });

      // 2) Verify directly in DB what the status is now
      const dbg = await get_customer_debug_by_id.run({ customer_id: id });
      const after = dbg?.[0];

      // 3) Refresh the main list
      await get_customers_list.run();

      // 4) Helpful messages so we see exactly what happened
      if (after) {
        showAlert(
          `Updated customer_id=${after.customer_id} → status=${after.customer_status}. ` +
          (toggleOn
            ? 'Note: "Show inactive" is ON, so the row will remain visible.'
            : 'With "Show inactive" OFF, it should disappear from the list.'
          ),
          (after.customer_status === 'Inactive' ? 'success' : 'warning')
        );
      } else {
        showAlert('Could not reload this customer after update (no row returned).', 'warning');
      }
    } catch (e) {
      showAlert('Could not set Inactive: ' + (e?.message || e), 'error');
    } finally {
      closeModal('modal_customer_soft_delete');
      await storeValue('customerRow', null);

      // Optional: clear selection if your table supports it
      if (typeof tbl_customers?.clearSelection === 'function') {
        tbl_customers.clearSelection();
      }
    }
  }
};
