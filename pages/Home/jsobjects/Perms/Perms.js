export default {
  init: async () => {
    if (appsmith.store.pagePermsInited) return;

    await get_my_pages.run();

    const pages = (get_my_pages.data || [])
      .map(x => x.page_value)
      .filter(Boolean);

    await storeValue('pagePerms', pages);
    await storeValue('pagePermsInited', true);
  },

  canAccessPage: (pageName) => {
    return (appsmith.store.pagePerms || []).includes(pageName);
  }
};
