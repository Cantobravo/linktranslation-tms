export default {
  open(row = {}) {
    const fullName =
      row.resource_full_name ??
      row.full_name ??
      row.name ??
      [row.first_name, row.last_name].filter(Boolean).join(' ') ??
      "";

    const payload = {
      resource_id: row.resource_id,
      resource_full_name: fullName,
      resource_username: row.resource_username ?? ""
    };

    storeValue('credsRow', payload);
    resetWidget('j_creds2', true);
    showModal('Creds_Modal');
  },
  clear() { storeValue('credsRow', null); }
}
