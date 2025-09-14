export default {
  _splitTags(s) {
    return String(s || "")
      .split(/[;,]/)
      .map(x => x.trim())
      .filter(Boolean);
  },

  options() {
    const rows = get_iso_all_tags.data || [];
    const bag = new Set();
    for (const r of rows) {
      this._splitTags(r.tags).forEach(t => bag.add(t));
    }
    const list = Array.from(bag).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    return list.map(t => ({ label: t, value: t }));
  },

  async refresh() {
    await get_iso_all_tags.run();
    showAlert("Tags refreshed", "success");
  }
};
