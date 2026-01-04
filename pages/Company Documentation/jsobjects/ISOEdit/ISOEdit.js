export default {
  async open(row) {
    await storeValue('isoRowId', row.snippet_id);
    showModal('j_iso_upd_modal');
    resetWidget('j_iso_upd_form', true);
    await get_iso_one.run({ id: row.snippet_id });
    const full = (get_iso_one.data && get_iso_one.data[0])
      ? get_iso_one.data[0]
      : { snippet_id: row.snippet_id, snippet_title: row.snippet_title, tags: row.tags, full_text: "" };
    j_iso_upd_form.setSourceData(full);
  },

  async askDel(row) {
    await storeValue('isoDelRow', row);
    showModal('j_iso_del_modal');
  },

  async doDel() {
    const r = appsmith.store.isoDelRow || {};
    if (!r.snippet_id) {
      showAlert('No row selected to delete.', 'warning');
      return;
    }

    await delete_iso_text.run({ id: r.snippet_id });

    // Refresh lists (safe to refresh both)
    await get_iso_all.run();
    if (typeof get_iso_search !== "undefined") {
      await get_iso_search.run();
    }

    await storeValue('isoDelRow', null);
    closeModal('j_iso_del_modal');
    showAlert('Deleted successfully.', 'success');
  }
};
