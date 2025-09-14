export default {
  openProjectDetails: (projectRow) => {
    storeValue("selectedProjectData", projectRow);
    get_purchase_orders_update.run();
    showModal("j_proj_upd_m");
  }
}
