export default {
  refreshAll() {
    get_notes.run();
    get_notes_count.run();
  },

  clearNewForm() {
    // Reset the whole modal to each widget's Default value
    resetWidget('New_Note_Modal', true);

    // Optional: if you didn't set defaults on the widgets, force them here:
    // n_priority.setSelectedOption({ label: 'Medium', value: 'Medium' });
    // n_note_date.setValue(''); // only if you really want to clear dates programmatically
    // For Rich Text: prefer resetWidget; if your version supports setText, you could do:
    // if (n_note_text.setText) { n_note_text.setText(''); }
  },

  openEditFromRow(row) {
    showModal('Edit_Note_Modal');
  },

  afterSave() {
    this.refreshAll();
    closeModal('New_Note_Modal');
    closeModal('Edit_Note_Modal');
    showAlert('Saved successfully', 'success');
  },

  afterDelete() {
    this.refreshAll();
    showAlert('Note deleted', 'success');
  },

  afterComplete() {
    this.refreshAll();
    showAlert('Marked as completed', 'success');
  },

  afterReopen() {
    this.refreshAll();
    showAlert('Reopened as pending', 'success');
  }
}
