export default {
  // ... keep your applyIns() here ...

  async applyUpd() {
    // 1) Read latest selection from the form and sync to store
    const typeNow = String(j_tpl_upd_form.formData?.template_type || '');
    const cur = appsmith.store.tpl_upd_data || {};
    await storeValue('tpl_upd_data', { ...cur, template_type: typeNow });

    const isEmail = /email/i.test(typeNow);
    const isPdf   = /pdf/i.test(typeNow);

    const set = async (patch) => {
      const c = appsmith.store.tpl_upd_data || {};
      await storeValue('tpl_upd_data', { ...c, ...patch });
    };

    if (isEmail) {
      // Clear PDF-only
      await set({ template_header_html: "", template_footer_html: "" });

      // Email defaults if empty
      if (!cur.template_email_to_field)  await set({ template_email_to_field: "{{resource_email}}" });
      if (!cur.template_email_subject)   await set({ template_email_subject: "Kickoff: {{project_name}} for {{customer_name}} — due {{due_date}}" });
      if (!cur.template_email_body_html) await set({
        template_email_body_html:
`<p>Hi {{resource_name}},</p>
<p>We're kicking off <strong>{{project_name}}</strong> for <strong>{{customer_name}}</strong>.</p>
<p>Due: {{due_date}}</p>`
      });

      // Sync vars from body
      const body = (appsmith.store.tpl_upd_data || {}).template_email_body_html || "";
      const vars = TemplateVarsHelper.scanVarsFromBody(body);
      const merged = _.uniq([...(cur.template_vars || []), ...vars]);
      await set({ template_vars: merged });
    }

    if (isPdf) {
      // Clear Email-only
      await set({
        template_from_field: "",
        template_email_to_field: "",
        template_email_bcc_field: "",
        template_email_subject: "",
        template_email_body_html: "",
        template_signature_field: ""
      });

      // PDF defaults if empty
      if (!cur.template_header_html) await set({ template_header_html: "<h1>{{customer_name}}</h1><h2>Invoice {{invoice_number}}</h2>" });
      if (!cur.template_footer_html) await set({ template_footer_html: "<p>Thank you!</p>" });

      // Sync vars from header+footer
      const h = (appsmith.store.tpl_upd_data || {}).template_header_html || "";
      const f = (appsmith.store.tpl_upd_data || {}).template_footer_html || "";
      const vars = _.uniq([
        ...TemplateVarsHelper.scanVarsFromBody(h),
        ...TemplateVarsHelper.scanVarsFromBody(f)
      ]);
      const merged = _.uniq([...(cur.template_vars || []), ...vars]);
      await set({ template_vars: merged });
    }
  }
};
