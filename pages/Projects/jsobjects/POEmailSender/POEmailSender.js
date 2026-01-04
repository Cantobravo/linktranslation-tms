export default {
  sendSinglePO: (row) => {
    const template = get_po_email_template.data[0];

    if (!template) {
      showAlert("Email template not found", "error");
      return;
    }

    const resFullName =
      row.resource_full_name ||
      row.resource_name ||
      "";

    const replacements = {
      "{{purchase_order_id}}": row.purchase_order_id || "",
      "{{resource_full_name}}": resFullName,
      "{{resource_name}}": resFullName,
      "{{resource_email}}": row.resource_email || "",
      "{{project_name}}": row.project_name || "",
      "{{currency_name}}": row.currency_name || "",
      "{{source_language}}": row.source_language_name || "",
      "{{target_language}}": row.target_language_name || "",
      "{{service_name}}": row.service_name || "",
      "{{unit_name}}": row.unit_name || "",
      "{{volume}}": row.volume || "",
      "{{rate}}": row.rate || "",
      "{{total}}": row.total || "",
      "{{date}}": row.date ? moment(row.date).format("YYYY-MM-DD") : "",
      "{{due_date}}": row.due_date ? moment(row.due_date).format("YYYY-MM-DD") : "",
      "{{note}}": row.note || ""
    };

    let subject = template.template_email_subject || "";
    let bodyHtml = template.template_email_body_html || "";

    for (const key in replacements) {
      subject = subject.replaceAll(key, replacements[key]);
      bodyHtml = bodyHtml.replaceAll(key, replacements[key]);
    }

    const plainTextBody = bodyHtml
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/&nbsp;/gi, " ")
      .replace(/<\/?[^>]+(>|$)/g, "");

    const mailtoLink = `mailto:${row.resource_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainTextBody)}`;

    navigateTo(mailtoLink, {}, "NEW_WINDOW");
  }
}
