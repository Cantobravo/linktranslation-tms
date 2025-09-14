export default {
  async init() {
    await storeValue('f_field', '');  // no column chosen yet
    await storeValue('f_text',  '');  // empty search
    await storeValue('f_like',  '%'); // unquoted pattern => prepared stmt will quote

    // (optional) preload filter dropdowns
    try { await get_languages_dd.run(); } catch(_) {}
    try { await get_work_teams_dd.run(); } catch(_) {}

    await get_projects.run();
    return true;
  }
}
