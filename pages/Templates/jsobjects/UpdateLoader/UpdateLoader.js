export default {
  normalize(row = {}) {
    // Parse template_vars to an array safely
    let vars = [];
    try {
      if (Array.isArray(row.template_vars)) vars = row.template_vars;
      else if (typeof row.template_vars === "string") vars = JSON.parse(row.template_vars || "[]");
    } catch (_) { vars = []; }

    const active = (row.template_is_active ?? 1) == 1;

    return {
      template_id: row.template_id,
      template_name: row.template_name || "",
      template_type: row.template_type || "",
      template_description: row.template_description || "",
      template_is_active: active,
      template_version: row.template_version ?? 1,

      // Email fields
      template_from_field: row.template_from_field || "",
      template_email_to_field: row.template_email_to_field || "",
      template_email_bcc_field: row.template_email_bcc_field || "",
      template_email_subject: row.template_email_subject || "",
      template_email_body_html: row.template_email_body_html || "",
      template_signature_field: row.template_signature_field || "",

      // PDF fields
      template_header_html: row.template_header_html || "",
      template_footer_html: row.template_footer_html || "",

      // Declared placeholders
      template_vars: vars
    };
  },

  async open() {
    // 1) Try to fetch fresh row from DB (falls back to stored row)
    try { await get_template_by_id.run(); } catch(_) {}

    const dbRow = (get_template_by_id.data && get_template_by_id.data[0]) || appsmith.store.templateRow || {};
    const normalized = this.normalize(dbRow);

    // 2) Put normalized row into store for the form
    await storeValue('tpl_upd_data', normalized);

    // 3) Open modal
    showModal('j_tpl_upd_m');
  }
};
