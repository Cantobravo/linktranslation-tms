export default {
  busyKey: "__submit_busy",
  isBusy() { return !!appsmith.store[this.busyKey]; },
  async runOnce(cb) {
    if (typeof cb !== "function") return;
    if (this.isBusy()) return;
    try { await storeValue(this.busyKey, true); await cb(); }
    finally { await storeValue(this.busyKey, false); }
  }
}
