export default {
  async save(form) {
    const base = appsmith.store.credsRow || {};
    const resource_id = base.resource_id;

    // Read from small form
    const username = (form.resource_username || "").trim();
    const new_password = form.new_password || "";
    const confirm_password = form.confirm_password || "";

    // If your DB has resource_is_active (TINYINT/INT), map boolean -> 0/1. If not, set undefined.
    const hasActive = Object.prototype.hasOwnProperty.call(form, 'resource_is_active');
    const is_active = hasActive ? (form.resource_is_active ? 1 : 0) : undefined;

    // Validations
    if (!resource_id) { showAlert('No resource selected', 'error'); return; }
    if (!username)    { showAlert('Username is required', 'warning'); return; }
    if (new_password && new_password !== confirm_password) {
      showAlert('Passwords do not match', 'warning'); return;
    }
    if (new_password && new_password.length < 6) {
      showAlert('Password must be at least 6 characters', 'warning'); return;
    }

    // Uniqueness check (ignore this user)
    const dupe = await check_username_exists.run({ username, resource_id })
      .then(r => (Array.isArray(r) && r[0]?.cnt) ? Number(r[0].cnt) : 0);
    if (dupe > 0) { showAlert('Username already in use', 'error'); return; }

    // Choose the right update
    if (new_password) {
      // With password
      if (hasActive) {
        await upd_user_creds_with_pw.run({ username, new_password, is_active, resource_id });
      } else {
        await upd_user_creds_with_pw_noactive.run({ username, new_password, resource_id });
      }
    } else {
      // No password change
      if (hasActive) {
        await upd_user_creds_no_pw.run({ username, is_active, resource_id });
      } else {
        await upd_user_creds_no_pw_noactive.run({ username, resource_id });
      }
    }

    showAlert('Credentials updated', 'success');
    await get_users.run();
    closeModal('Creds_Modal');
  }
}
