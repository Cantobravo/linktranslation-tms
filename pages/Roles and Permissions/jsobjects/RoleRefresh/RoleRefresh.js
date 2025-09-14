export default {
  async afterPermissionsChange() {
    try {
      await get_role_perms.run();
      await get_roles_perms_summary.run();
      await get_roles_perms_flat.run();
      await get_resource_roles_summary.run();
      await get_resource_roles_flat.run();
    } catch(e) {
      showAlert('Refresh failed: ' + (e?.message || e), 'error');
    }
  },
  async afterRoleAssignment() {
    try {
      if (typeof get_users !== 'undefined' && get_users.run) await get_users.run();
      if (typeof get_resources_test !== 'undefined' && get_resources_test.run) await get_resources_test.run();
      await get_resource_roles_summary.run();
      await get_resource_roles_flat.run();
    } catch(e) {
      showAlert('Refresh failed: ' + (e?.message || e), 'error');
    }
  },
  async afterRoleInsertOrUpdate() {
    try {
      await get_roles.run();
      await get_roles_perms_summary.run();
      await get_resource_roles_summary.run();
    } catch(e) {
      showAlert('Refresh failed: ' + (e?.message || e), 'error');
    }
  }
}
