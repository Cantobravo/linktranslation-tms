export default {
  async boot() {
    await storeValue('isoSearch', { ids: [], idx: 0 });
    await storeValue('isoCurrent', null);
    await get_iso_all_tags.run();
  }
};
