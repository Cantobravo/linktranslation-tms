export default {
  build(po, items) {
    const cur = (po.currency || "USD").toUpperCase();
    const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: cur });

    const rows = (items || []).map((row, idx) => {
      const vol = Number(row.volume || 0);
      const rate = Number(row.rate || 0);
      const total = vol * rate;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${this.escape(row.service)}</td>
          <td>${this.escape(row.unit)}</td>
          <td>${this.escape(row.source_language)}</td>
          <td>${this.escape(row.target_language)}</td>
          <td class="num">${vol.toLocaleString("en-US")}</td>
          <td class="num">${fmt.format(rate)}</td>
          <td class="num">${fmt.format(total)}</td>
        </tr>`;
    }).join("");

    const grandTotal = (items || []).reduce((s, r) => s + Number(r.volume || 0) * Number(r.rate || 0), 0);

    const brand = {
      primary: "#0f766e",      // teal 700
      primaryLight: "#14b8a6", // teal 500
      accent: "#0ea5e9",       // sky 500
      ink: "#0f172a",          // slate 900
      gray: "#334155",         // slate 700
      soft: "#f1f5f9"          // slate 100
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Purchase Order ${this.escape(po.po_number || "")}</title>
<style>
  @page { size: A4; margin: 24mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, Arial, sans-serif; color: ${brand.ink}; }
  .wrap { }

  /* Header */
  .header { display: flex; align-items: center; gap: 16px; }
  .logo { height: 48px; }
  .titleblock { flex: 1; }
  h1 { margin: 0; font-size: 22px; color: ${brand.primary}; letter-spacing: .3px; }
  .subtitle { color: ${brand.gray}; font-size: 12px; margin-top: 2px; }

  .meta {
    margin-top: 10px; padding: 10px 12px; background: ${brand.soft}; border: 1px solid #e2e8f0; border-radius: 8px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 12px;
  }
  .meta div b { color: ${brand.gray}; font-weight: 600; }

  /* Party block */
  .party {
    margin-top: 14px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; font-size: 12px;
  }
  .party h3 { margin: 0 0 6px 0; font-size: 13px; color: ${brand.primary}; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-top: 14px; }
  thead th {
    text-align: left; font-size: 12px; padding: 10px 8px; color: white; background: ${brand.primary};
  }
  tbody td {
    font-size: 12px; padding: 8px; border-bottom: 1px solid #e2e8f0;
  }
  tbody tr:nth-child(even) td { background: #f8fafc; }
  td.num { text-align: right; white-space: nowrap; }
  td:first-child { color: ${brand.gray}; width: 26px; }

  .totals {
    margin-top: 8px; display: flex; justify-content: flex-end;
  }
  .totals .box {
    min-width: 260px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;
  }
  .totals .row {
    display: flex; justify-content: space-between; padding: 10px 12px; font-size: 12px;
    border-bottom: 1px solid #e2e8f0; background: white;
  }
  .totals .row.total {
    background: ${brand.primaryLight}; color: white; font-weight: 700; border: none;
  }

  /* Notes */
  .notes {
    margin-top: 14px; padding: 12px; border-left: 4px solid ${brand.accent}; background: #f0f9ff; font-size: 12px;
  }

  /* Signature & Footer */
  .sign {
    margin-top: 20px; display: flex; align-items: center; gap: 16px;
  }
  .sign img { height: 42px; }
  .footer {
    margin-top: 24px; font-size: 11px; color: ${brand.gray};
    padding-top: 10px; border-top: 1px dashed #cbd5e1;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      ${po.logo_url ? `<img class="logo" src="${this.escape(po.logo_url)}" alt="Logo"/>` : ``}
      <div class="titleblock">
        <h1>PURCHASE ORDER • LINK TRANSLATION</h1>
        <div class="subtitle">Official Purchase Order for contracted language services</div>
      </div>
    </div>

    <div class="meta">
      <div><b>PO No:</b> <span class="mono">${this.escape(po.po_number || "")}</span></div>
      <div><b>Date:</b> ${this.escape(po.date_iso || "")}</div>
      <div><b>Currency:</b> ${this.escape(cur)}</div>
      <div><b>Email for queries:</b> ops@linktranslation.com</div>
    </div>

    <div class="party">
      <div>
        <h3>Resource</h3>
        <div>${this.escape(po.resource_full_name || "")}</div>
        <div>${this.escape(po.resource_email || "")}</div>
      </div>
      <div>
        <h3>Issued by</h3>
        <div>Link Translation</div>
        <div>www.linktranslation.com</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
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
        ${rows || ""}
      </tbody>
    </table>

    <div class="totals">
      <div class="box">
        <div class="row">
          <div>Subtotal</div>
          <div class="mono">${fmt.format(grandTotal)}</div>
        </div>
        <div class="row total">
          <div>PO Total</div>
          <div class="mono">${fmt.format(grandTotal)}</div>
        </div>
      </div>
    </div>

    ${po.note ? `<div class="notes"><b>Note:</b> ${this.escape(po.note)}</div>` : ``}

    <div class="sign">
      ${po.signature_url ? `<img src="${this.escape(po.signature_url)}" alt="Signature"/>` : ``}
      <div>
        <div><b>Authorized by:</b> Link Translation</div>
        <div>Date: ${this.escape(po.date_iso || "")}</div>
      </div>
    </div>

    <div class="footer">
      Note with instructions to send us the invoice to be added.
      Please include the PO number on your invoice and send to billing@linktranslation.com.
    </div>
  </div>
</body>
</html>`;

    return html;
  },

  // tiny helper to sanitize injected strings
  escape(v) {
    const s = String(v ?? "");
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
};
