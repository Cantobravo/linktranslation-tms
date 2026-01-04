export default {
  init: async () => {
    const email = String(appsmith.user.email || '').trim().toLowerCase();

    // rerun if different user or not initialized
    if (appsmith.store.myPerms?.inited && appsmith.store.myPerms?.email === email) return;

    await get_my_permissions.run();
    await get_my_pages.run();
    await get_my_menu.run();

    const permKeys = (get_my_permissions.data || [])
      .map(x => x.permission_key)
      .filter(Boolean);

    const pages = (get_my_pages.data || [])
      .map(x => x.page_value)
      .filter(Boolean);

    const menu = (get_my_menu.data || [])
      .map(x => ({
        col_id: x.col_id,
        label: x.label,
        page_value: x.page_value
      }))
      .filter(x => x.page_value);

    await storeValue("myPerms", {
      inited: true,
      email,
      permKeys,
      pages,
      menu
    });
  },

  canPage: (pageName) => {
    return (appsmith.store.myPerms?.pages || []).includes(pageName);
  },

  canMenu: (menuLabel) => {
    // Menu items are driven by AppNav + get_menu_cols/get_menu_items (AUTOMATIC)
    const items = AppNav.itemsForLabel(menuLabel) || [];
    return items.some(it => this.canPage(it.value));
  }
};
