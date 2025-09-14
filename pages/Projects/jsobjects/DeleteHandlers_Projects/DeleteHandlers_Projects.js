export default {
  async open(row) {
    const project_id = Number(row?.project_id);
    if (!project_id) { showAlert('No project_id.', 'warning'); return; }

    await storeValue('projDel', { project_id, name: row.project_name });

    // Run guard and show modal with details
    await get_proj_guard.run({ project_id });
    const g = get_proj_guard.data?.[0] || {};
    const billedCnt = Number(g.billed_po_count || 0);
    const linkCnt   = Number(g.bill_link_count || 0);

    showModal('j_proj_delete_guard');

    if ((billedCnt + linkCnt) > 0) {
      showAlert('Blocked: billed/linked POs. Unbill/unlink first.', 'warning');
    }
  },

  async unlinkInvoices() {
    const project_id = appsmith.store.projDel?.project_id;
    if (!project_id) { showAlert('Missing project id', 'warning'); return; }
    try {
      await unlink_proj_invoices.run({ project_id });
      await get_proj_guard.run({ project_id });
      showAlert('Unlinked invoice links.', 'success');
    } catch(e) {
      showAlert('Unlink failed: ' + (e?.message || e), 'error');
    }
  },

  async confirmDelete() {
    const project_id = appsmith.store.projDel?.project_id;
    if (!project_id) { showAlert('Missing project id', 'warning'); return; }

    // Re-check guard right before deletion
    await get_proj_guard.run({ project_id });
    const g = get_proj_guard.data?.[0] || {};
    const billedCnt = Number(g.billed_po_count || 0);
    const linkCnt   = Number(g.bill_link_count || 0);

    if ((billedCnt + linkCnt) > 0) {
      showAlert('Blocked: this project has billed/linked POs. Unbill/unlink first.', 'warning');
      return;
    }

    try {
      // Clear bill links (if none, affects 0 rows)
      await del_project_bill_links_by_proj.run({ project_id });

      // Delete POs (if none, affects 0 rows)
      await del_project_pos.run({ project_id });

      // Delete the project
      await del_project_only.run({ project_id });

      closeModal('j_proj_delete_guard');
      await storeValue('projDel', null);

      await get_projects.run();
      showAlert('Project and POs removed. Bill links cleared.', 'success');
    } catch (e) {
      showAlert('Delete failed: ' + (e?.message || e), 'error');
    }
  }
};
