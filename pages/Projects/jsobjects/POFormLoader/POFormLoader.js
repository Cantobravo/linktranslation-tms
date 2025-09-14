export default {
  opt(list, value) {
    const arr = Array.isArray(list) ? list : [];
    const v = value == null ? "" : String(value);
    const hit = arr.find(o => String(o?.value) === v);
    return hit ? { label: hit.label, value: hit.value } : null;
  },

  setEmail(email) {
    // target your widget name(s)
    try { edit_resource_email.setValue(email || ""); } catch (e) {}
    try { up_resource_email.setValue(email || ""); }   catch (e) {} // optional alias
  },

  async fillUpdate(rowIn) {
    const row = rowIn || (get_rpo_by_id.data && get_rpo_by_id.data[0]) || {};

    // Use cached options (loaded once by OptionsCache)
    const resources = appsmith.store.opt_resources || [];
    const services  = appsmith.store.opt_services  || [];
    const units     = appsmith.store.opt_units     || [];
    const langs     = appsmith.store.opt_langs     || [];

    // Dropdowns
    try { const o = this.opt(resources, row.resource_id);        o && up_resource_id.setSelectedOption(o); } catch (_) {}
    try { const o = this.opt(services,  row.service_id);         o && up_service_id.setSelectedOption(o); } catch (_) {}
    try { const o = this.opt(units,     row.unit_id);            o && up_unit_id.setSelectedOption(o); }   catch (_) {}
    try { const o = this.opt(langs,     row.source_language_id); o && up_source_language_id.setSelectedOption(o); } catch (_) {}
    try { const o = this.opt(langs,     row.target_language_id); o && up_target_language_id.setSelectedOption(o); } catch (_) {}

    // Hidden/input
    try { typeof up_project_id?.setValue === "function" && up_project_id.setValue(row.project_id ?? ""); } catch (_) {}

    // Currency lock
    try {
      if (typeof up_currency_id?.setSelectedOption === "function") {
        up_currency_id.setSelectedOption({ label: "US Dollar", value: 1 });
        up_currency_id.setDisabled(true);
      }
    } catch (_) {}

    // Numbers / text
    try { up_volume.setValue(row.volume ?? ""); } catch (_) {}
    try { up_rate.setValue(row.rate ?? ""); }     catch (_) {}
    try { up_total.setValue(row.total ?? ""); }   catch (_) {}
    try { up_note.setValue(row.note ?? ""); }     catch (_) {}

    // Dates
    try { up_date.setValue(row.date ? moment(row.date).format("YYYY-MM-DD") : ""); }             catch (_) {}
    try { up_due_date.setValue(row.due_date ? moment(row.due_date).format("YYYY-MM-DD") : ""); } catch (_) {}

    // Email: prefer DB join, fallback to cached resources
    let email = row.resource_email || "";
    if (!email) {
      const r = resources.find(o => String(o.value) === String(row.resource_id));
      email = r?.resource_email || "";
    }
    this.setEmail(email);

    return true;
  }
};
