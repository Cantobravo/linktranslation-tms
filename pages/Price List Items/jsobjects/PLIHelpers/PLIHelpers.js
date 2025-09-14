export default {
  // Try to read insertId from various plugin response shapes.
  getInsertId(insResponse) {
    // MySQL plugin responses vary by version. Try the common shapes:
    const r = insResponse;
    if (!r) return null;

    // 1) { insertId: 123 }
    if (typeof r.insertId === "number") return r.insertId;

    // 2) [ { insertId: 123 } ]
    if (Array.isArray(r) && r.length && typeof r[0]?.insertId === "number") {
      return r[0].insertId;
    }

    // 3) Nested data structures (rare)
    if (r.data && typeof r.data.insertId === "number") return r.data.insertId;
    if (r.data && Array.isArray(r.data) && typeof r.data[0]?.insertId === "number") {
      return r.data[0].insertId;
    }

    return null;
  },

  // Find a row in get_pli_list by id (fallback when insertId not present)
  findRowById(id) {
    const rows = get_pli_list.data || [];
    return rows.find(x => x.price_list_item_id == id) || null;
  },

  // Final open-update logic: store row then open modal
  openUpdateWithRow(row) {
    if (!row) {
      showAlert("Could not find the inserted item to edit.", "warning");
      return;
    }
    storeValue('pliRow', row);
    showModal('j_pli_upd_m');
  }
};
