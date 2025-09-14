export default {
  field() { return appsmith.store.f_field || null; },
  text()  { return String(appsmith.store.f_text ?? '').trim(); },
  hasText() { return this.text().length > 0; },

  // returns a SQL-quoted string literal, e.g. 'abc' or ''
  q(v) { const t = String(v ?? ''); return "'" + t.replace(/'/g, "''") + "'"; },

  // quoted base for LIKE '<text>%'
  likeStartQuoted() { return this.q(this.text()); },

  langId() { return proj_filter_lang_id.selectedOptionValue ?? null; },
  wtId()   { return proj_filter_wt_id.selectedOptionValue ?? null; }
};
