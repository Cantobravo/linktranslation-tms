export default {
  lock(key) {
    const flagKey = 'ss_' + key;
    if (appsmith.store[flagKey]) {
      showAlert('Please wait — a save is already in progress.', 'warning');
      return false;
    }
    storeValue(flagKey, true);
    return true;
  },
  release(key) {
    const flagKey = 'ss_' + key;
    storeValue(flagKey, false);
  },
  isLocked(key) {
    return !!appsmith.store['ss_' + key];
  }
};
