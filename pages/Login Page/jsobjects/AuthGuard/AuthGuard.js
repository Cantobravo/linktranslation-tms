export default {
  user()      { return appsmith.store.session_user || null; },
  perms()     { return appsmith.store.session_perms || []; },
  has(key)    { return this.perms().includes(key); },
  any(keys=[]) { return keys.some(k => this.has(k)); },
  all(keys=[]) { return keys.every(k => this.has(k)); },
  isLoggedIn(){ return !!this.user(); }
}