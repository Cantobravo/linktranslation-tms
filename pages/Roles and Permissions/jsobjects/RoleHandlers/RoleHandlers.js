export default {
  // ---------- Helpers ----------
  getRoleId() {
    return Number(appsmith.store.roleRow?.role_id || roles_table.selectedRow?.role_id);
  },

  // ---------- Insert Role ----------
  openInsert() {
    storeValue('roleRow', null);
    resetWidget('j_role', true);
    showModal('j_role_insert_modal');
  },

  async saveInsert() {
    try {
      await add_role.run();
      showAlert('Role created', 'success');
      await get_roles.run();
      resetWidget('j_role', true);
      closeModal('j_role_insert_modal');
    } catch (e) {
      showAlert('Create failed: ' + (e?.message || e), 'error');
    }
  },

  // ---------- Update Role ----------
  openUpdate() {
    const row = roles_table.triggeredRow || roles_table.selectedRow;
    if (!row?.role_id) { showAlert('Pick a role to edit', 'warning'); return; }
    storeValue('roleRow', row);
    resetWidget('j_role', true);
    showModal('j_role_update_modal');
  },

  async saveUpdate() {
    const id = this.getRoleId();
    if (!id) { showAlert('No role selected', 'warning'); return; }
    try {
      await upd_role.run();
      showAlert('Role updated', 'success');
      await get_roles.run();
      closeModal('j_role_update_modal');
    } catch (e) {
      showAlert('Update failed: ' + (e?.message || e), 'error');
    }
  },

  // ---------- Permissions for a Role ----------
  async openPermissions() {
    const row = roles_table.triggeredRow || roles_table.selectedRow;
    if (!row?.role_id) { showAlert('Pick a role first', 'warning'); return; }
    storeValue('roleRow', row);
    await get_role_perms.run();
    showModal('j_role_permissions_modal');
  },

  async savePermissions() {
    const roleId = this.getRoleId();
    if (!roleId) { showAlert('Pick a role first', 'warning'); return; }

    // Supports both MultiSelect APIs
    const selected =
      (ms_role_perms.selectedOptionValues && Array.isArray(ms_role_perms.selectedOptionValues))
        ? ms_role_perms.selectedOptionValues
        : (ms_role_perms.selectedValues || []);

    try {
      // Clear all then bulk insert (idempotent)
      await del_role_permissions_by_role.run();

      if (selected.length) {
        await ins_role_permissions_bulk.run(); // builds VALUES from ms_role_perms internally
      }

      showAlert('Permissions saved', 'success');
      await get_role_perms.run(() => resetWidget('ms_role_perms', true));
      closeModal('j_role_permissions_modal');
    } catch (e) {
      showAlert('Update failed: ' + (e?.message || e), 'error');
    }
  },

  // ---------- Assign a Role to resources (your 3 test resources) ----------
  openAssignRole() {
    showModal('j_assign_role_modal');
  },

  async assignRoleSave() {
    try {
      await assign_user_role.run();
      showAlert('Role assigned to selected resources', 'success');
      await get_users.run();
      closeModal('j_assign_role_modal');
    } catch (e) {
      showAlert('Assign failed: ' + (e?.message || e), 'error');
    }
  }
};
