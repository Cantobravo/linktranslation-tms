export default {
  init: async () => {
    const email = String(appsmith.user.email || '').trim().toLowerCase();

    // rerun only if different user or not initialized
    if (appsmith.store.myPerms?.inited && appsmith.store.myPerms?.email === email) return;

    await get_my_role.run();
    await get_my_permissions.run();
    await get_my_pages.run();

    const permKeys = (get_my_permissions.data || []).map(x => x.permission_key).filter(Boolean);
    const pages = (get_my_pages.data || []).map(x => x.page_value).filter(Boolean);

    await storeValue("myPerms", { inited: true, email, permKeys, pages });
  },

  canPage: (pageName) => {
    return (appsmith.store.myPerms?.pages || []).includes(pageName);
  },

  // IMPORTANT: use Perms.canPage (NOT this.canPage)
  canMenu: (menuLabel) => {
    const items = AppNav.itemsForLabel(menuLabel) || [];
    return items.some(it => Perms.canPage(it.value));
  }
};
