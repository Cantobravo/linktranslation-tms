export default {
  async openIns() {
    resetWidget("jf_pf_ins", true);
    showModal("j_pf_ins_m");
  },

  async openUpd(row) {
    if (!row || !row.portfolio_id) {
      showAlert("No row selected.", "warning");
      return;
    }
    await storeValue("pf_row", row);
    resetWidget("jf_pf_upd", true);
    showModal("j_pf_upd_m");
    await get_pf_one.run({ portfolio_id: row.portfolio_id });
  },

  async afterSave() {
    await get_pf_list.run();
    await get_pf_tags_raw.run();
    await get_pf_areas.run();
  }
};
