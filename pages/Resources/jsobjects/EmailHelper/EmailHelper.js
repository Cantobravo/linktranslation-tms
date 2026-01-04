// JSObject: EmailHelper
export default {
  _render(tpl, row) {
    return String(tpl || "").replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => {
      if (row && Object.prototype.hasOwnProperty.call(row, k)) {
        return String(row[k] ?? "");
      }
      return m;
    });
  },

  _cleanEmailList(list) {
    return (list || [])
      .map(e => String(e || "").trim())
      .filter(Boolean)
      .map(e => e.replace(/[\s,;]+/g, "")); // normalize
  },

  _getTplRow() {
    const ds = get_email_templates_dd_res.data || [];
    const val = String(i_email_template_res.selectedOptionValue ?? "");
    return ds.find(x => String(x.value) === val) || null;
  },

  // TEMPLATE -> opens Outlook using template fields + placeholder replacement using one resource row
  sendTplRow(row) {
    const r = row || tbl_resources.triggeredRow || tbl_resources.selectedRow;
    if (!r) {
      showAlert("Select a resource row.", "warning");
      return;
    }

    const tpl = this._getTplRow();
    if (!tpl) {
      showAlert("Select a template first.", "warning");
      return;
    }

    const toRaw = this._render(tpl.to_field, r);
    const ccRaw = this._render(tpl.cc_field, r);
    const bccRaw = this._render(tpl.bcc_field, r);
    const subj = this._render(tpl.subject_field, r);
    const body = this._render(tpl.body_field, r);

    // Outlook tolerates empty values; keep params only when non-empty
    const params = [];

    const to = String(toRaw || "").trim(); // "mailto:" target
    const cc = this._cleanEmailList(String(ccRaw || "").split(/[;,]+/)).join(";");
    const bcc = this._cleanEmailList(String(bccRaw || "").split(/[;,]+/)).join(";");

    if (cc) params.push("cc=" + encodeURIComponent(cc));
    if (bcc) params.push("bcc=" + encodeURIComponent(bcc));
    if (subj) params.push("subject=" + encodeURIComponent(subj));

    // BODY MUST BE LAST (prevents it sticking to bcc/subject in some shells)
    params.push("body=" + encodeURIComponent(body || "\n"));

    const url = "mailto:" + encodeURIComponent(to) + "?" + params.join("&");
    navigateTo(url, "NEW_WINDOW");
  },

  // BULK BCC ONLY (no template): selected rows -> BCC
  sendBulkBccOnly() {
    const rows = tbl_resources.selectedRows || [];
    if (!rows.length) {
      showAlert("Select at least one resource.", "warning");
      return;
    }

    const emails = this._cleanEmailList(rows.map(r => r.resource_email));
    const uniq = [...new Set(emails)];
    if (!uniq.length) {
      showAlert("No emails found in selected rows.", "warning");
      return;
    }

    const bcc = uniq.join(";");
    const params = [];
    params.push("bcc=" + encodeURIComponent(bcc));
    params.push("body=" + encodeURIComponent("\n")); // LAST

    const url = "mailto:?" + params.join("&");
    navigateTo(url, "NEW_WINDOW");
  },

  // COPY selected emails
  copySelEmails() {
    const rows = tbl_resources.selectedRows || [];
    if (!rows.length) {
      showAlert("Select at least one resource.", "warning");
      return;
    }

    const emails = this._cleanEmailList(rows.map(r => r.resource_email));
    const uniq = [...new Set(emails)];
    if (!uniq.length) {
      showAlert("No emails found in selected rows.", "warning");
      return;
    }

    copyToClipboard(uniq.join(";"));
    showAlert(`Copied ${uniq.length} emails.`, "success");
  }
};
