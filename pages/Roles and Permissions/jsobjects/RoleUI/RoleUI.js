export default {
  openAdd() {
    storeValue('roleEditId', null);
    resetWidget('j_role', true);
    showModal('Role_Modal');
  },
  openEdit() {
    if (!roles_table.selectedRow?.role_id) {
      showAlert('Select a role to edit.', 'warning'); 
      return;
    }
    storeValue('roleEditId', roles_table.selectedRow.role_id);
    resetWidget('j_role', true);
    showModal('Role_Modal');
  }
}
