export default {
  errMsg: "",

  async login() {
    this.errMsg = "";

    const row = await auth_login_sha2.run();
    if (!row || !Array.isArray(row) || row.length === 0) {
      this.errMsg = "Invalid username or password.";
      showAlert(this.errMsg, "error");
      return;
    }

    const user = row[0];

    // Fetch permissions for this role
    const perms = await auth_perms_by_role.run({ role_id: user.role_id })
      .then(res => (res || []).map(x => x.permission_key))
      .catch(() => []);

    // Store session
    await storeValue("session_user", user);
    await storeValue("session_perms", perms);

    // Navigate to your home page
    navigateTo('Dashboard');
  },

  logout() {
    storeValue("session_user", null);
    storeValue("session_perms", []);
    navigateTo('Login');
  }
}
