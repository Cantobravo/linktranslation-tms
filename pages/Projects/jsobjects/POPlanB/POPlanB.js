export default {
  // Pick the first non-empty value among possible field names
  pick(row, keys, fallback = "") {
    for (const k of keys) {
      const v = row?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return fallback;
  },

  // Sanitize HTML: strip BOM, normalize Unicode (fixes odd characters), strip nulls
  sanitizeHtml(raw) {
    return String(raw ?? "")
      .replace(/^\uFEFF/, "") // remove UTF-8 BOM if present
      .normalize("NFC")       // canonical unicode form
      .replace(/\u0000/g, ""); // remove stray null chars
  },

  /**
   * Build the PO HTML (via POTemplate) and compute the blob path.
   * Stores values in appsmith.store and returns a summary.
   */
  async buildHtmlAndPath() {
    try {
      const row =
        update_purchase_order_table.triggeredRow ||
        update_purchase_order_table.selectedRow;

      if (!row) {
        showAlert("Select a row or click the inline button.", "warning");
        return { ok: false, reason: "no-row" };
      }

      if (typeof POTemplate?.build !== "function") {
        showAlert("POTemplate JSObject missing.", "error");
        return { ok: false, reason: "no-template" };
      }

      // --- Resolve a reliable PO number ---
      const po_number = this.pick(row, [
        "purchase_order_id",
        "po_number",
        "purchase_order_number",
        "po_no",
        "id"
      ]);
      const safe_po = po_number || `PO-${row.project_id || "X"}-${Date.now()}`;

      // --- Header (USD fixed) ---
      const po = {
        po_number: String(safe_po),
        date_iso: moment(row.date || undefined).format("YYYY-MM-DD"),
        currency: "USD",
        note: row.note || "",
        resource_full_name: row.resource_name || "",
        resource_email: row.resource_email || "",
        logo_url: appsmith.store.logo_url || "",
        signature_url: appsmith.store.signature_url || ""
      };

      // --- Single item per row ---
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

      // Build + sanitize HTML
      const rawHtml = POTemplate.build(po, items);
      const html = this.sanitizeHtml(rawHtml);

      // Compute blob path
      const year = moment(row.date || undefined).format("YYYY") || String(new Date().getFullYear());
      const blobPath = `pos/${year}/${po.po_number}.html`;

      // Save to store for the upload query
      await storeValue("po_html", html);
      await storeValue("po_blob_html_path", blobPath);
      await storeValue("po_year", year);

      if (!po_number) {
        showAlert(`PO number missing on row. Using fallback: ${po.po_number}`, "info");
      }

      return { ok: true, year, blobPath, length: html.length };
    } catch (e) {
      console.error("POPlanB.buildHtmlAndPath error:", e);
      showAlert("Could not build PO HTML. See console.", "error");
      return { ok: false, error: e.message || "unknown" };
    }
  },

  /**
   * Helper: build + upload (no navigation). Keeps your existing two-step flow.
   */
  async buildAndUpload() {
    const res = await this.buildHtmlAndPath();
    if (!res?.ok) return res;
    return upload_po_html.run(
      () => showAlert("PO HTML uploaded.", "success"),
      (e) => showAlert("Upload failed: " + (e?.message || "Unknown"), "error")
    );
  },

  /**
   * Build + upload + open a DOWNLOAD link (forces "Save as" instead of opening).
   * Pass your SAS string (encoded) as argument `sas`.
   *
   * Example SAS (encoded):
   * "sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-08-25T05:29:25Z&st=2025-09-24T21:14:25Z&spr=https&sig=GeLXsoQAlR02yidb8TZiOzSAm15FFICRoGUY2mx%2BDWI%3D"
   */
  async buildUploadAndDownload(sas) {
    if (!sas || typeof sas !== "string") {
      showAlert("Missing SAS string in buildUploadAndDownload(sas).", "error");
      return;
    }

    const res = await this.buildHtmlAndPath();
    if (!res?.ok) return res;

    return upload_po_html.run(
      () => {
        const fileName = (appsmith.store.po_blob_html_path || "").split("/").pop() || "purchase-order.html";

        // Response header overrides to force download
        const overrides =
          "&rscd=" + encodeURIComponent("attachment; filename=" + fileName) +
          "&rsct=" + encodeURIComponent("text/html; charset=utf-8");

        const url =
          "https://linktranslationstorage.blob.core.windows.net/documents/" +
          appsmith.store.po_blob_html_path + "?" + sas + overrides;

        showAlert("PO HTML uploaded.", "success");
        navigateTo(url, {}, "SAME_WINDOW"); // browser will download the file
      },
      (e) => showAlert("Upload failed: " + (e?.message || "Unknown"), "error")
    );
  }
};
