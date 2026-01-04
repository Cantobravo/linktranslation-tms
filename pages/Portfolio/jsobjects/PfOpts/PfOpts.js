export default {
  _splitTags(s) {
    return String(s || "")
      .split(/[;,]/g)
      .map(x => x.trim())
      .filter(Boolean);
  },

  tagOptions() {
    const rows = get_pf_tags_raw.data || [];
    const all = rows.flatMap(r => this._splitTags(r.portfolio_tags));
    const uniq = Array.from(new Set(all.map(x => x.toLowerCase())))
      .map(lc => all.find(x => x.toLowerCase() === lc));

    return uniq
      .sort((a, b) => a.localeCompare(b))
      .map(t => ({ label: t, value: t }));
  }
};
