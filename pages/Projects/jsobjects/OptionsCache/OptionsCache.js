export default {
  // Load dropdown options once per session (or force reload)
  async loadOnce(force = false) {
    const has = (k) => Array.isArray(appsmith.store[k]) && appsmith.store[k].length > 0;

    if (force || !has('opt_resources')) {
      await get_resources_dd.run();
      await storeValue('opt_resources', get_resources_dd.data || []);
    }
    if (force || !has('opt_services')) {
      await get_services_dd.run();
      await storeValue('opt_services', get_services_dd.data || []);
    }
    if (force || !has('opt_units')) {
      await get_units_dd.run();
      await storeValue('opt_units', get_units_dd.data || []);
    }
    if (force || !has('opt_langs')) {
      await get_languages_dd.run();
      await storeValue('opt_langs', get_languages_dd.data || []);
    }

    return true;
  },

  // Optional: force refresh button can call this
  async refresh() { return this.loadOnce(true); }
};
