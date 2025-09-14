export default {
  updateAllCurrencyQuotes: async () => {
    // 1. Get latest rates from APIs
    await get_eur_usd_rate.run();
    await get_brl_usd_rate.run();
    await get_jpy_usd_rate.run();

    // 2. Update database with new rates
    await Update_EUR.run();
    await Update_BRL.run();
    await Update_JPY.run();

    // 3. Optionally show confirmation
    showAlert("Currency rates auto-updated.", "success");
  }
}