export default {
  async onLoad() {
    // Always refresh the table
    await get_notes.run();
    await get_notes_count.run();

    const id = appsmith.store.dash_note_id;
    if (id) {
      await get_note_by_id.run();
      const row = get_note_by_id.data?.[0];

      if (row) {
        await storeValue('edit_note_data', row);
        showModal('Edit_Note_Modal');
      } else {
        showAlert('Note not found', 'warning');
      }

      // clear the pointer so it won't reopen next time
      await storeValue('dash_note_id', undefined);
    }
  }
}
