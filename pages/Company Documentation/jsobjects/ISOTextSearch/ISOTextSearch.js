export default {
  async search() {
    await get_iso_search.run();
    const rows = get_iso_search.data || [];

    const selected = (ms_iso_tags_filter.selectedOptions || []).map(o =>
      String(o.value || "").toLowerCase()
    );

    const filtered = selected.length
      ? rows.filter(r => {
          const tokens = String(r.tags || "")
            .split(/[;,]/)
            .map(x => x.trim().toLowerCase())
            .filter(Boolean);
          if (tokens.length === 0) return false;
          const set = new Set(tokens);
          return selected.every(t => set.has(t));
        })
      : rows;

    const ids = filtered.map(r => r.snippet_id);

    await storeValue("isoSearch", { ids, idx: 0 });

    if (ids.length > 0) {
      await this.loadCurrent();
    } else {
      await storeValue("isoCurrent", null);
    }
  },

  async loadCurrent() {
    if (!(appsmith.store.isoSearch && appsmith.store.isoSearch.ids.length > 0)) {
      await storeValue("isoCurrent", null);
      return;
    }
    await get_iso_fulltext.run();
    const row = (get_iso_fulltext.data && get_iso_fulltext.data[0]) ? get_iso_fulltext.data[0] : null;
    await storeValue("isoCurrent", row);
  },

  async next() {
    const s = appsmith.store.isoSearch;
    if (!s || s.ids.length === 0) return;
    const nextIdx = (s.idx + 1) % s.ids.length;
    await storeValue("isoSearch", { ids: s.ids, idx: nextIdx });
    await this.loadCurrent();
  },

  async prev() {
    const s = appsmith.store.isoSearch;
    if (!s || s.ids.length === 0) return;
    const prevIdx = (s.idx - 1 + s.ids.length) % s.ids.length;
    await storeValue("isoSearch", { ids: s.ids, idx: prevIdx });
    await this.loadCurrent();
  },

  async copy() {
    const t = appsmith.store.isoCurrent?.full_text || "";
    if (t) {
      await copyToClipboard(t);
      showAlert("Text copied to clipboard", "success");
    } else {
      showAlert("Nothing to copy", "warning");
    }
  }
};
