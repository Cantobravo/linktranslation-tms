export default {
  updateCurrencies: async () => {
    // 1. Fetch rates from APIs
    await get_eur_usd_rate.run();
    await get_brl_usd_rate.run();
    await get_jpy_usd_rate.run();

    // 2. Update currencies table using SQL queries
    await update_eur_rate.run();
    await update_brl_rate.run();
    await update_jpy_rate.run();

    // 3. Show success message
    showAlert("Currency rates updated!", "success");
  }
}