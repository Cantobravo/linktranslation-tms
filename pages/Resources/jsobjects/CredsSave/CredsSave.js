export default {
  async save(form) {
    const base = appsmith.store.credsRow || {};
    const resource_id = base.resource_id;

    const username = (form.resource_username || "").trim();
    const new_password = form.new_password || "";
    const confirm_password = form.confirm_password || "";

    if (!resource_id) { showAlert('No resource selected', 'error'); return; }
    if (!username)    { showAlert('Username is required', 'warning'); return; }
    if (new_password && new_password !== confirm_password) {
      showAlert('Passwords do not match', 'warning'); return;
    }
    if (new_password && new_password.length < 6) {
      showAlert('Password must be at least 6 characters', 'warning'); return;
    }

    const dupe = await check_user_dupe.run({ username, resource_id })
      .then(r => (Array.isArray(r) && r[0]?.cnt) ? Number(r[0].cnt) : 0);
    if (dupe > 0) { showAlert('Username already in use', 'error'); return; }

    if (new_password) {
      await upd_user_pw.run({ username, new_password, resource_id });
    } else {
      await upd_user_name.run({ username, resource_id });
    }

    showAlert('Credentials updated', 'success');
    await get_users.run();          // <-- this now exists
    closeModal('Creds_Modal');
  }
}
