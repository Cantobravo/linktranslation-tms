export default {
  busy: false,
  payload: {},

  async save(form) {
    if (this.busy) return;
    this.busy = true;                 // SubmitShield ON

    try {
      const d = { ...form };

      // ID coercion
      d.resource_id = d.resource_id ? Number(d.resource_id) : null;

      // Trim strings / NULL fallback examples
      d.resource_banking_bank_country =
        (d.resource_banking_bank_country && String(d.resource_banking_bank_country).trim()) || null;

      // Dates (your preferred format)
      d.resource_banking_birth = d.resource_banking_birth
        ? moment(d.resource_banking_birth).format('YYYY-MM-DD')
        : null;

      this.payload = d;

      await ins_rb.run();             // INSERT
      showAlert('Banking info added', 'success');

      await get_rb_list.run();        // REFRESH table
      await get_resource_dd.run();    // Refresh dropdown cache if needed

      closeModal('New_Banking_Modal'); // CLOSE insert modal
      resetWidget('j_new_banking', true); // Clean form for next time
    } catch (e) {
      showAlert('Insert failed: ' + (e?.message || e), 'error');
    } finally {
      this.busy = false;
    }
  }
}
