export default {
  async revertIfNeededAndClose() {
    const pos = appsmith.store.selectedNewPOs;

    if (pos && pos.length > 0) {
      await revert_billed_status.run();
    }

    storeValue('selectedNewPOs', []);
    closeModal('New_Modal');
  }
}
