export default {
  lastRun: 0,
  guard(ms = 800) {
    const now = Date.now();
    if (now - this.lastRun < ms) { showAlert('Please wait…','warning'); return false; }
    this.lastRun = now; return true;
  }
}
