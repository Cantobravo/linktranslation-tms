export default {
  isBusy: () => !!appsmith.store.tpl_upd_busy,
  start: async () => {
    if (appsmith.store.tpl_upd_busy) return false;
    await storeValue('tpl_upd_busy', true);
    return true;
  },
  end: async () => { await storeValue('tpl_upd_busy', false); }
}
