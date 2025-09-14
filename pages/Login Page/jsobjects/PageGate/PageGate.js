export default {
  boot() {
    // REQUIRED permissions for this page
    const required = ['VIEW_COMPANY']; // change per page

    const isLoggedIn = !!(appsmith.store.session_user);
    const perms = appsmith.store.session_perms || [];
    const allowed = required.every(k => perms.includes(k));

    if (!isLoggedIn || !allowed) {
      showAlert('You do not have access to this page.', 'warning');
      navigateTo('Login');
    }
  }
}
