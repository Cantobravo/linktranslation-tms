export default {
  async load() {
    const res = await get_my_permissions.run();
    const row0 = (res || [])[0] || {};
    const keys = (res || []).map(x => x.permission_key).filter(Boolean);
    const permSet = keys.reduce((acc, k) => { acc[k] = true; return acc; }, {});
    await storeValue('myResId', row0.resource_id || null);
    await storeValue('myRoleId', row0.role_id || null);
    await storeValue('myRoleName', row0.role_name || null);
    await storeValue('myPerms', permSet);
    await storeValue('myPermKeys', keys);
    return permSet;
  },

  has(key) {
    const perms = appsmith.store.myPerms || {};
    return !!perms[key];
  },

  any(keys) {
    const perms = appsmith.store.myPerms || {};
    return (keys || []).some(k => !!perms[k]);
  },

  all(keys) {
    const perms = appsmith.store.myPerms || {};
    return (keys || []).every(k => !!perms[k]);
  }
}
