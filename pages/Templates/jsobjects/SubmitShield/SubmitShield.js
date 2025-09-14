export default {
  isBusy: () => !!appsmith.store.tpl_ins_busy,

  start: async () => {
    if (appsmith.store.tpl_ins_busy) { return false; }
    await storeValue('tpl_ins_busy', true);
    return true;
  },

  end: async () => {
    await storeValue('tpl_ins_busy', false);
  }
}
