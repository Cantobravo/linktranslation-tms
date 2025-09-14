export default {
  setRow(row) {
    return storeValue('companyRow', row);
  },
  clear() {
    return storeValue('companyRow', null);
  }
}
