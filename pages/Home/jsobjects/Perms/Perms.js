export default {
  // 1) MAP: Appsmith Page Name -> VIEW Permission Key
  // IMPORTANT: page names must match Appsmith pageName EXACTLY
  pagePermMap: {
    "Home": "VIEW_HOME",
    "Absences": "VIEW_ABSENCES",
    "Currencies": "VIEW_CURRENCIES",
    "Services": "VIEW_SERVICES",
    "Units": "VIEW_UNITS",
    "Languages": "VIEW_LANGUAGES",
    "Customers": "VIEW_CUSTOMERS",
    "Resources": "VIEW_RESOURCES",
    "Customer Accounts": "VIEW_CUSTOMER_ACCOUNTS",
    "Customer Contacts": "VIEW_CUSTOMER_CONTACTS",
    "Customer Portals": "VIEW_CUSTOMER_PORTALS",
    "Work Teams": "VIEW_WORK_TEAMS",
    "Projects": "VIEW_PROJECTS",
    "Customer Invoices": "VIEW_CUSTOMERS_INVOICES",
    "Templates": "VIEW_TEMPLATES",
    "Resource Bills": "VIEW_RESOURCE_BILLS",
    "Resources POs": "VIEW_RESOURCE_POs",
    "Resource Banking": "VIEW_RESOURCE_BANKING",
    "Company": "VIEW_COMPANY",
    "Roles and Permissions": "VIEW_RBAC",
    "Sales Pipeline": "VIEW_SALES_PIPELINE",
    "Company Documentation": "VIEW_COMPANY_DOCUMENTATION",
    "Portfolio": "VIEW_PORTFOLIO",
    "Price List": "VIEW_PRICE_LIST"
  },

  init: async () => {
    const email = String(appsmith.user.email || '').trim().toLowerCase();

    if (appsmith.store.myViewPermsEmail === email && Array.isArray(appsmith.store.myViewPerms)) return;

    await get_my_view_perms.run();

    const perms = (get_my_view_perms.data || [])
      .map(x => x.permission_key)
      .filter(Boolean);

    await storeValue('myViewPerms', perms);
    await storeValue('myViewPermsEmail', email);
  },

  has: (permKey) => {
    return (appsmith.store.myViewPerms || []).includes(permKey);
  },

  // check by Appsmith page name (exact)
  canPage: (pageName) => {
    const perm = Perms.pagePermMap[pageName];
    // if page not mapped, deny
    if (!perm) return false;
    return Perms.has(perm);
  },

  // menu click guard
go: async (pageName) => {
  await Perms.init();

  const need = Perms.pagePermMap[pageName] || null;
  const perms = appsmith.store.myViewPerms || [];
  const have = need ? perms.includes(need) : false;

  await storeValue('permDbg', {
    step: 'insidePermsGo',
    clicked: pageName,
    need,
    have,
    role: appsmith.store.myRoleName || null,
    perms,
    at: new Date().toISOString()
  });

  if (need && have) return navigateTo(pageName);
  return navigateTo('NoAccess');
}
