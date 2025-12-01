export default {
  // Minimal HTML preview from the table row (currency hard-coded to USD)
  previewQuick() {
    try {
      const row =
        update_purchase_order_table.triggeredRow ||
        update_purchase_order_table.selectedRow;

      if (!row) {
        showAlert("Select a row or click the inline button.", "warning");
        return;
      }

      const CURRENCY = "USD"; // <-- fixed currency for all POs
      const fmtMoney = (n) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY }).format(Number(n || 0));

      const vol  = Number(row.volume ?? 0);
      const rate = Number(row.rate ?? 0);
      const tot  = row.total != null ? Number(row.total) : vol * rate;

      const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>PO Preview ${row.purchase_order_id || ""}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
  h1 { margin: 0 0 8px 0; color: #0f766e; font-size: 20px; }
  .meta, .party { font-size: 12px; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; }
  th { background: #0f766e; color: #fff; text-align: left; }
  td.num { text-align: right; white-space: nowrap; }
  .footer { margin-top: 12px; font-size: 11px; color: #475569; }
</style>
</head>
<body>
  <h1>PURCHASE ORDER • LINK TRANSLATION</h1>
  <div class="meta">
    <div><b>PO No:</b> ${row.purchase_order_id || ""}</div>
    <div><b>Date:</b> ${moment(row.date || undefined).format("YYYY-MM-DD")}</div>
    <div><b>Currency:</b> ${CURRENCY}</div>
    <div><b>Project:</b> ${row.project_name || ""}</div>
  </div>

  <div class="party">
    <div><b>Resource:</b> ${row.resource_name || ""}</div>
    <div><b>Email:</b> ${row.resource_email || ""}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Unit</th>
        <th>Source</th>
        <th>Target</th>
        <th class="num">Volume</th>
        <th class="num">Rate</th>
        <th class="num">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${row.service_name || ""}</td>
        <td>${row.unit_name || ""}</td>
        <td>${row.source_language_name || ""}</td>
        <td>${row.target_language_name || ""}</td>
        <td class="num">${vol.toLocaleString("en-US")}</td>
        <td class="num">${fmtMoney(rate)}</td>
        <td class="num">${fmtMoney(tot)}</td>
      </tr>
    </tbody>
  </table>

  ${row.note ? `<div class="footer"><b>Note:</b> ${row.note}</div>` : ""}
</body>
</html>`.trim();

      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      navigateTo(url, {}, "NEW_WINDOW"); // allow popups for your Appsmith domain
    } catch (e) {
      console.error("POPreviewTest.previewQuick error:", e);
      showAlert(`Preview error: ${e.message}`, "error");
    }
  }
};
