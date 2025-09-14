export default {
  itemsFor(col_id) {
    const all = get_menu_items.data || [];
    return all
      .filter(x => String(x.col_id) === String(col_id))
      .map(x => ({ label: x.label, value: x.page_value }));
  },
  itemsForLabel(lbl) {
    const cols = get_menu_cols.data || [];
    const col = cols.find(c => c.col_label === lbl);
    return col ? this.itemsFor(col.col_id) : [];
  },
  go(page) {
    navigateTo(page, {}, "SAME_WINDOW");
  }
};
