export default {
  payload: {},

  save(form) {
    const d = { ...form };

    // FK to number
    d.currency_id =
      d.currency_id !== '' && d.currency_id != null ? Number(d.currency_id) : null;

    // Trim strings
    [
      'company_name','logo','website','signature',
      'address','tax_number','bank_account','payoneer_account'
    ].forEach(k => {
      if (k in d && typeof d[k] === 'string') d[k] = d[k].trim();
    });

    this.payload = d;

    return upd_company.run(
      () => {
        showAlert('Company information updated', 'success');
        // Refresh table/query and refresh the stored row
        get_company.run(() => {
          const fresh = get_company.data?.[0] || null;
          if (fresh) CompanyStore.setRow(fresh);
        });
        closeModal('Edit_Company_Modal');
      },
      (e) => showAlert('Update failed: ' + (e?.message || e), 'error')
    );
  }
}
