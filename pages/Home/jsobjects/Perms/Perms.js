export default {
  norm: (v) =>
    String(v || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/_/g, ''),

  loadPages: async () => {
    const email = String(appsmith.user.email || '').trim().toLowerCase();

    if (appsmith.store.pagePermsEmail === email && Array.isArray(appsmith.store.pagePermsNorm)) return;

    await get_my_pages.run();

    const raw = (get_my_pages.data || [])
      .map(x => x.page_value)
      .filter(Boolean);

    await storeValue('pagePermsRaw', raw);
    await storeValue('pagePermsNorm', raw.map(Perms.norm));
    await storeValue('pagePermsEmail', email);
  },

  canPage: (pageName) => {
    const allowed = appsmith.store.pagePermsNorm || [];
    return allowed.includes(Perms.norm(pageName));
  },

  go: async (pageName) => {
    await Perms.loadPages();

    // DEBUG (will show the real clicked value)
    await storeValue('noAccessFrom', pageName);
    await storeValue('lastClickNorm', Perms.norm(pageName));

    if (Perms.canPage(pageName)) return navigateTo(pageName);

    return navigateTo('NoAccess');
  }
};
