export default {
  // -------- Insert defaults --------
  defaultIns() {
    return {
      template_name: "",
      template_type: "",
      template_description: "",
      template_is_active: true,
      template_version: 1,

      // Email fields
      template_from_field: "",
      template_email_to_field: "",
      template_email_bcc_field: "",
      template_email_subject: "",
      template_email_body_html: "",
      template_signature_field: "",

      // PDF fields
      template_header_html: "",
      template_footer_html: "",

      // Declared placeholders
      template_vars: []
    };
  },

  // Reset insert state (used when opening the insert modal)
  async reset(mode) {
    if (mode === "ins") {
      await storeValue("tpl_ins_data", this.defaultIns());
    }
  },

  // ✅ The getter your handler relies on
  get(mode) {
    const key = mode === "ins" ? "tpl_ins_data" : "tpl_upd_data";
    return appsmith.store[key] || {};
  },

  // Set a single field
  async set(mode, field, value) {
    const key = mode === "ins" ? "tpl_ins_data" : "tpl_upd_data";
    const cur = this.get(mode);
    const next = { ...cur, [field]: value };
    await storeValue(key, next);
  },

  // Append a {{token}} to the appropriate body field
  async appendToken(mode, token) {
    const cur = this.get(mode);
    const type = String(cur.template_type || "");
    if (type.includes("email")) {
      a
