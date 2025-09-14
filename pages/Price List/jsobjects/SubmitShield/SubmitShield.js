export default {
  // Simple debounce guard (backward compatible)
  lastRun: 0,
  guard(ms = 800) {
    const now = Date.now();
    if (now - this.lastRun < ms) {
      showAlert("Please wait…", "warning");
      return false;
    }
    this.lastRun = now;
    return true;
  },

  // Promise-based protection (optional)
  isSubmitting: false,
  async protect(action) {
    if (this.isSubmitting) {
      showAlert("Please wait… submission in progress.", "warning");
      return;
    }
    this.isSubmitting = true;
    try {
      await action();
    } catch (err) {
      console.error("SubmitShield error:", err);
      showAlert("An error occurred: " + err.message, "error");
    } finally {
      this.isSubmitting = false;
    }
  }
};
