export default {
  handleRowSelect: async () => {
    // Store the new row
    await storeValue('selectedCustomerPortalRow', SelectQuery.data[tbl_cport.selectedRowIndex]);
    // Wait for the store to update before running the query
    setTimeout(() => {
      get_customer_contacts_dropdown.run();
    }, 100); // 100ms delay is usually enough
  }
}
