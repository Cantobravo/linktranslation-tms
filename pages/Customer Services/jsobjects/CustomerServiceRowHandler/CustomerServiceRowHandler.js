export default {
  handleRowSelect: async () => {
    await storeValue('selectedCustomerServiceRow', SelectQuery.data[tbl_cserv.selectedRowIndex]);
    setTimeout(() => get_customer_accounts_dropdown.run(), 100);
  }
}