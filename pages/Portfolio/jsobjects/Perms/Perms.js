export default {
  init: async () => {
    const email = String(appsmith.user.email || '').trim().toLowerCase();

    if (appsmith.store.pagePermsInited && appsmith.store.pagePermsEmail === email) return;

    await get_my_pages.run();

    const pages = (get_my_pages.data || [])
      .map(x => x.page_value)
      .filter(Boolean);

    await storeValue('pagePerms', pages);
    await storeValue('pagePermsInited', true);
    await storeValue('pagePermsEmail', email);
  },

  canAccessPage: (pageName) => {
    return (appsmith.store.pagePerms || []).includes(pageName);
  }
};
