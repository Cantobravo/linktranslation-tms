export default {
  _escapeRe(s) {
    return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  _tagRegex(tagsArr) {
    const arr = (tagsArr || []).map(x => String(x || "").trim()).filter(Boolean);
    if (!arr.length) return "";
    const alt = arr.map(t => this._escapeRe(t.toLowerCase())).join("|");
    return `(^|;[[:space:]]*)(${alt})([[:space:]]*;|$)`;
  },

  async search() {
    const q = (i_iso_query.text || "").trim();
    const tags = ms_iso_tags_filter.selectedOptionValues || [];
    const tag_re = this._tagRegex(tags);

    const rows = await get_iso_search.run({ q: q || "", tag_re: tag_re || "" });

    const ids = (rows || []).map(r => r.snippet_id);
    await storeValue("isoSearch", { ids, idx: 0 });

    if (!ids.length) {
      await storeValue("isoCurrent", null);
      return;
    }

    await this.loadCurrent();
  },

  async loadCurrent() {
    const q = (i_iso_query.text || "").trim();
    const res = await get_iso_fulltext.run({ q: q || "" });
    const row = (res && res[0]) ? res[0] : null;
    await storeValue("isoCurrent", row);
  },

  async prev() {
    const s = appsmith.store.isoSearch || { ids: [], idx: 0 };
    const idx = Number(s.idx || 0);
    if (idx <= 0) return;
    await storeValue("isoSearch", { ...s, idx: idx - 1 });
    await this.loadCurrent();
  },

  async next() {
    const s = appsmith.store.isoSearch || { ids: [], idx: 0 };
    const idx = Number(s.idx || 0);
    const len = (s.ids || []).length;
    if (idx >= len - 1) return;
    await storeValue("isoSearch", { ...s, idx: idx + 1 });
    await this.loadCurrent();
  },

  async copy() {
    const txt = appsmith.store.isoCurrent?.display_text || "";
    if (!txt) {
      showAlert("Nothing to copy.", "warning");
      return;
    }
    await copyToClipboard(txt);
    showAlert("Copied excerpt.", "success");
  }
};
