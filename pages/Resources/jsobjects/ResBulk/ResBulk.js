export default {
  async deleteSelected() {
    const rows = tbl_resources.selectedRows || [];
    if (!rows.length) { showAlert('Select at least one resource.', 'warning'); return; }

    // Optional tiny safety: skip already archived
    const todo = rows.filter(r => String(r.resource_is_active ?? 1) !== '0');
    if (!todo.length) { showAlert('All selected are already archived.', 'info'); return; }

    await storeValue('_res_del_busy', true);
    try {
      for (const r of todo) {
        await upd_resource_soft_del.run({ resource_id: Number(r.resource_id) });
      }
      await get_resources_list.run();
      showAlert(`${todo.length} resource(s) archived.`, 'success');

      // Clear selection if available in your Appsmith version
      if (typeof tbl_resources.clearSelection === 'function') tbl_resources.clearSelection();
    } catch (e) {
      showAlert('Delete failed: ' + (e?.message || e), 'error');
    } finally {
      await storeValue('_res_del_busy', false);
    }
  }
}
