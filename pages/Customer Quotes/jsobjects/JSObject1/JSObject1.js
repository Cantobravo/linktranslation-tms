export default {
  formData: {},
  async open() {
    await storeValue('cquoteRow', null);
    resetWidget('j_cquote_insert_form', true);
    this.formData = {
      customer_quote_name: '',
      customer_id: null,
      customer_contact_id: null,
      currency_id: null,
      quote_amount: null,
      customer_quote_start_date: null,
      customer_quote_last_contact_date: null,
      customer_quote_next_contact_date: null,
      quote_notes: '',
      customer_quote_status: 'Open',
      quote_is_active: 1
    };
    j_cquote_insert_form.setSourceData(this.formData);
    showModal('Insert_Modal');
  },
  async submit() {
    await SubmitShield.runOnce(async () => {
      await ins_cquote.run(
        () => {
          closeModal('Insert_Modal');
          get_cquote_active.run();
          showAlert('Quote inserted', 'success');
        },
        (e) => showAlert('Error: ' + JSON.stringify(e), 'error')
      );
    });
  }
}
