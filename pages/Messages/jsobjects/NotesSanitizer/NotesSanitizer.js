export default {
  normalize(v) {
    return (v ?? '').toString().trim();
  },
  getStatus(v) {
    const x = this.normalize(v);
    return (x === 'Pending' || x === 'Completed') ? x : 'Pending';
  },
  getPriority(v) {
    const x = this.normalize(v);
    return (x === 'Low' || x === 'Medium' || x === 'High') ? x : 'Medium';
  }
}
