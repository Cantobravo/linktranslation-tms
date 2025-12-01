export default {
  nullIfEmpty(v) {
    return (v === "" || v === undefined) ? null : v;
  },

  pickLabel(arr, val) {
    try { return (arr || []).find(o => String(o.value) === String(val))?.label || ""; }
    catch { return ""; }
  },

  teamName(acc, srv, unit, src, tgt) {
    const parts = [acc, srv, unit, (src && tgt) ? `${src} → ${tgt}` : ""].filter(Boolean);
    return parts.join(" · ");
  },

  joinEmails(rows) {
    const set = new Set((rows || [])
      .map(r => r.email_to || r.alias_email || r.resource_email)
      .filter(Boolean)
      .map(s => String(s).trim()));
    return Array.from(set).join("; ");
  },

  isUrl(u) {
    try { const x = new URL(u); return !!x.protocol && !!x.host; } catch { return false; }
  }
}
