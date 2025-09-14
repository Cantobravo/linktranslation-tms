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
  }
};
