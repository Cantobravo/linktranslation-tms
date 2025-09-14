export default {
  onLoad() {
    if (appsmith.store.dash_selected_note) {
      const row = appsmith.store.dash_selected_note;
      resetWidget('notes_table'); // optional
      // Select the right row in the table (or just open Edit with this row data)
      showModal('Edit_Note_Modal');
      storeValue('dash_selected_note', undefined);
    }
  }
}
