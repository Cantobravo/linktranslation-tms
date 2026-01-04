export default {
  init: async () => {
    // prevent reruns on re-render
    if (appsmith.store.myPerms?.inited) return;

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
      permKeys,
      pages,
      menu
    });
  },

  // ===== PAGE ACCESS =====
  canPage: (pageName) => {
    return (appsmith.store.myPerms?.pages || []).includes(pageName);
  },

  // ===== MENU ACCESS (disable whole menu button) =====

  // menuLabel = exact app_menu_cols.col_label (example: "PM Menu")
  canMenu: (menuLabel) => {
    const cols = get_menu_cols.data || [];
    const col = cols.find(c => String(c.col_label) === String(menuLabel));
    if (!col?.col_id) return false;

    const items = (get_menu_items.data || [])
      .filter(i => String(i.col_id) === String(col.col_id))
      .map(i => i.page_value)
      .filter(Boolean);

    // enabled if user can access at least one page in that menu
    return items.some(p => Perms.canPage(p));
  },

  // convenience: bind directly to widget Disabled property
  menuDisabled: (menuLabel) => {
    return !Perms.canMenu(menuLabel);
  }
};
