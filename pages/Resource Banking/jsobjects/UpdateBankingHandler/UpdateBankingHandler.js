export default {
  busy: false,
  payload: {},

  async save(form) {
    if (this.busy) return;
    this.busy = true;                 // SubmitShield ON

    try {
      const d = { ...form };

      // Required for WHERE clause
      d.resource_banking_id = Number(d.resource_banking_id);

      // Only IDs coerced
      d.resource_id = d.resource_id ? Number(d.resource_id) : null;

      // Trim / NULL fallback examples
      d.resource_banking_bank_country =
        (d.resource_banking_bank_country && String(d.resource_banking_bank_country).trim()) || null;

      // Date normalization
      d.resource_banking_birth = d.resource_banking_birth
        ? moment(d.resource_banking_birth).format('YYYY-MM-DD')
        : null;

      this.payload = d;

      await upd_rb.run();             // UPDATE
      showAlert('Banking info updated', 'success');

      await get_rb_list.run();        // REFRESH table
      await get_resource_dd.run();    // keep dropdowns fresh

      closeModal('Edit_Banking_Modal'); // CLOSE edit modal
    } catch (e) {
      showAlert('Update failed: ' + (e?.message || e), 'error');
    } finally {
      this.busy = false;
    }
  }
}
