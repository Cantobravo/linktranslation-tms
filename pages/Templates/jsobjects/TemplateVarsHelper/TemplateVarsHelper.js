export default {
 commonVars: [
  // Project / PO / Invoice
  "project_name","project_total","project_currency","project_start_date","project_end_date",
  "service_name","unit_name","volume","rate","total",
  "purchase_order_id","purchase_order_date","due_date",
  "invoice_number","invoice_date","invoice_total","invoice_currency",

  // Customer / Resource
  "customer_name","customer_email","resource_name","resource_email",

  // Work Teams (from work_teams)
  "work_team_name","resource_alias_email","system_code","daily_capacity","po_status","rates",

  // Company (from company)
  "company_name","company_logo","company_website","company_address","company_signature",
  "company_tax_number","company_bank_account","company_payoneer_account"
],

  buildVarJson(formData) {
    try { return JSON.stringify(Array.isArray(formData.template_vars) ? formData.template_vars : []); }
    catch { return "[]"; }
  },

  scanVarsFromBody(body) {
    try {
      const matches = [...String(body || "").matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
      return _.uniq(matches);
    } catch { return []; }
  },

  insertPickedVarIntoBody(mode) {
    const picker = mode === 'ins' ? i_tpl_var_picker : u_tpl_var_picker;
    const form   = mode === 'ins' ? j_tpl_ins_form   : j_tpl_upd_form;
    const v = picker.selectedOptionValue;
    if (!v) { showAlert('Pick a placeholder first', 'warning'); return; }

    const type = String(form.formData.template_type || "");
    const token = `{{${v}}}`;

    if (type.includes("email")) {
      const current = form.formData.template_email_body_html || "";
      form.setFieldValue("template_email_body_html", current + token);
    } else if (type.includes("pdf")) {
      const current = form.formData.template_header_html || "";
      form.setFieldValue("template_header_html", current + token);
    } else {
      showAlert('Set template type first (Email or PDF).', 'warning');
    }
  }
}
