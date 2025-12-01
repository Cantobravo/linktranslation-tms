export default {
  /**
   * Build PO HTML using only the row that fired the inline button.
   * Works with your table fields: purchase_order_id, resource_name, resource_email,
   * project_name, currency_name, source_language_name, target_language_name,
   * service_name, unit_name (can be null), volume, rate, total, date, due_date, note.
   */
  async buildInlinePOHtml() {
    try {
      const row =
        update_purchase_order_table.triggeredRow ||
        update_purchase_order_table.selectedRow;

      if (!row) {
        showAlert("Select a row or click the inline button.", "warning");
        return "";
      }

      // Map header
      const po = {
        po_number: String(row.purchase_order_id ?? ""),
        date_iso: moment(row.date || undefined).format("YYYY-MM-DD"),
        currency: (row.currency_name || "USD").toUpperCase(),
        note: row.note || "",
        resource_full_name: row.resource_name || "",
        resource_email: row.resource_email || "",
        logo_url: appsmith.store.logo_url || "",
        signature_url: appsmith.store.signature_url || ""
      };

      // Single line item per row (your schema stores one service per PO)
      const vol  = Number(row.volume ?? 0);
      const rate = Number(row.rate ?? 0);
      const tot  = row.total != null ? Number(row.total) : vol * rate;

      const items = [{
        service: row.service_name || "",
        unit: row.unit_name || "",
        source_language: row.source_language_name || "",
        target_language: row.target_language_name || "",
        volume: vol,
        rate: rate,
        total: tot
      }];

      const html = POTemplate.build(po, items);
      await storeValue("po_html", html);
      return html;
    } catch (e) {
      console.error("POActions.buildInlinePOHtml error:", e);
      showAlert("Failed to build PO HTML. Open console for details.", "error");
      return "";
    }
  },

  // Opens a temporary preview tab with the HTML (no PDF yet)
  async buildAndPreview() {
    const html = await this.buildInlinePOHtml();
    if (!html) return;
    try {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      navigateTo(url, {}, "NEW_WINDOW"); // preview opens in a new browser tab
    } catch (e) {
      console.error("Preview error:", e);
      showAlert("Could not open preview.", "error");
    }
  }
};
