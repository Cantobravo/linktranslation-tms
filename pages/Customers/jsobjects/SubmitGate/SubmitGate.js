export default {
  busyKey: "__submit_busy",
  isBusy() { return !!appsmith.store[this.busyKey]; },
  async runOnce(fn) {
    if (this.isBusy()) return;
    try { await storeValue(this.busyKey, true); await fn(); }
    finally { await storeValue(this.busyKey, false); }
  }
}
