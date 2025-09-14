export default {
  async save() {
    const roleId = appsmith.store.roleRow?.role_id;
    if (!roleId) { showAlert('Pick a role first', 'warning'); return; }

    try {
      await del_role_permissions_by_role.run();
      const list = ms_role_perms.selectedOptionValues || [];
      if (list.length) {
        await ins_role_permissions_bulk.run();
      }
      showAlert('Permissions saved', 'success');
      await get_role_perms.run(() => resetWidget('ms_role_perms', true));
      closeModal('j_role_permissions_modal');
    } catch (e) {
      showAlert('Update failed: ' + (e?.message || e), 'error');
    }
  }
}
