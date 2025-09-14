export default {
  busyKey: "__submit_busy",
  isBusy() {
    return !!appsmith.store[this.busyKey];
  },
  async runOnce(cb) {
    if (typeof cb !== "function") return;     // guard against bad usage
    if (this.isBusy()) return;                // prevent double-clicks
    try {
      await storeValue(this.busyKey, true);
      await cb();
    } finally {
      await storeValue(this.busyKey, false);
    }
  }
}
