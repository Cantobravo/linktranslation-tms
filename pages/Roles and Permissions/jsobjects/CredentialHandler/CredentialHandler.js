export default {
  _randomSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr)).replace(/=+$/,''); // base64 salt
  },

  _validate(data) {
    const errs = [];
    if (!data?.resource_id) errs.push('Missing resource_id.');
    const uname = (data?.resource_username || '').trim();
    if (!uname) errs.push('Username is required.');
    if (uname.length < 4) errs.push('Username must be at least 4 characters.');
    const p1 = data?.password || '';
    const p2 = data?.confirm_password || '';
    if (!p1) errs.push('Password is required.');
    if (p1.length < 8) errs.push('Password must be at least 8 characters.');
    if (p1 !== p2) errs.push('Passwords do not match.');
    if (errs.length) { showAlert(errs.join('\n'), 'error'); return false; }
    return true;
  },

  async saveCredentials(data) {
    if (!this._validate(data)) return;

    const salt = this._randomSalt();

    try {
      await upd_resource_credentials.run({
        resource_id: data.resource_id,
        username: (data.resource_username || '').trim(),
        plain_password: data.password,
        salt
      });
      showAlert('Credentials updated successfully.', 'success');
      await get_staff_resources_list.run();
      closeModal('j_set_creds_m');
    } catch (e) {
      showAlert(
        'Error updating credentials: ' + (e?.message || JSON.stringify(e)),
        'error'
      );
    }
  }
};
