export default {
  // normalize strings for safe comparison
  norm: (v) => String(v || '').trim().toLowerCase(),

  // load & cache allowed pages for the logged-in user
  loadPages: async () => {00
    const email = Perms.norm(appsmith.user.email);

    // reuse cache for same user
    if (
      appsmith.store.pagePermsEmail === email &&
      Array.isArray(appsmith.store.pagePerms)
    ) {
      return;
    }

    // fetch allowed pages
    await get_my_pages.run();

    const pages = (get_my_pages.data || [])
      .map(r => r.page_value)
      .filter(Boolean)
      .map(Perms.norm);

    await storeValue('pagePerms', pages);
    await storeValue('pagePermsEmail', email);
  },

  // check if a page is allowed
  canPage: (pageName) => {
    const pages = appsmith.store.pagePerms || [];
    return pages.includes(Perms.norm(pageName));
  },

  // guarded navigation (USE THIS FROM MENU CLICKS)
  go: async (pageName) => {
    await Perms.loadPages();

    const allowed = Perms.canPage(pageName);

    if (allowed) {
      return navigateTo(pageName);
    }

    // optional: remember blocked page
    await storeValue('noAccessFrom', pageName);
    return navigateTo('NoAccess');
  }
};
