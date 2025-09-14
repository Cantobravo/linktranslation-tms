export default {
  updatePurchaseOrder: async () => {
    const stripHTML = (input) =>
      input ? input.replace(/<\/?[^>]+(>|$)/g, "") : "";

    const safeText = (val) =>
      val ? `'${stripHTML(val).replace(/'/g, "\\'")}'` : "NULL";

    const safeNum = (val) =>
      val !== undefined && val !== "" ? val : "NULL";

    const safeDate = (val) =>
      val ? `'${moment(val).format("YYYY-MM-DD")}'` : "NULL";

    const queryText = `
      UPDATE resource_purchase_orders
      SET
        project_id = ${safeNum(up_project_id.text)},
        resource_id = ${safeNum(up_resource_id.selectedOptionValue)},
        currency_id = ${safeNum(edit_currency_id.selectedOptionValue)},
        source_language_id = ${safeNum(up_source_language_id.selectedOptionValue)},
        target_language_id = ${safeNum(up_target_language_id.selectedOptionValue)},
        service_id = ${safeNum(up_service_id.selectedOptionValue)},
        unit_id = ${safeNum(up_unit_id.selectedOptionValue)},
        volume = ${safeNum(up_volume.text)},
        rate = ${safeNum(up_rate.text)},
        total = ${safeNum(up_total.text)},
        date = ${safeDate(up_date.selectedDate)},
        due_date = ${safeDate(up_due_date.selectedDate)},
        template_id = ${safeNum(up_template.selectedOptionValue)},
        note = ${safeText(up_note.text)},
        updated_at = NOW()
      WHERE
        purchase_order_id = ${safeNum(edit_purchase_order_id.text)};
    `;

    await UpdatePOQuery.run({ query: queryText });
  }
};
