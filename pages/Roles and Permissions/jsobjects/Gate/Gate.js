export default {
  required: ['VIEW_RBAC'],

  boot() {
    // Let you design the page in the editor
    if (appsmith.mode === 'EDIT') return;

    const user  = appsmith.store.session_user || null;
    const perms = appsmith.store.session_perms || [];
    const exp   = Number(appsmith.store.session_exp || 0);

    if (!user || (exp && Date.now() > exp)) {
      storeValue("session_user", null);
      storeValue("session_perms", []);
      storeValue("session_exp", 0);
      showAlert("Please log in.", "warning");
      return navigateTo("Login");
    }

    const ok = this.required.every(k => perms.includes(k));
    if (!ok) {
      showAlert("You do not have access to this page.", "warning");
      return navigateTo("Login");
    }
  }
}
