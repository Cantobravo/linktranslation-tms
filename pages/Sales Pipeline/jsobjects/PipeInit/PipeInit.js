export default {
  init: async () => {
    await get_pipe_customers.run();
    const first = _.get(get_pipe_customers.data, '[0]', null);
    if (first && first.customer_id) {
      await storeValue('sel_cust_id', Number(first.customer_id));
      await get_cust_portals_bycust.run();
      await get_cust_contacts_bycust.run();
    }
    await get_pipe_statuses.run();
  }
}
