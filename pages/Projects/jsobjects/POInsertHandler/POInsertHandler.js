export default {
  insertPurchaseOrder: async () => {
    const stripHTML = (input) =>
      input ? input.replace(/<\/?[^>]+(>|$)/g, "") : "";

    const safeText = (val) =>
      val ? `'${stripHTML(val).replace(/'/g, "\\'")}'` : "NULL";

    const safeNum = (val) =>
      val !== undefined && val !== "" ? val : "NULL";

    const safeDate = (val) =>
      val ? `'${moment(val).format("YYYY-MM-DD")}'` : "NULL";

    const queryText = `
      INSERT INTO resource_purchase_orders (
        resource_id,
        currency_id,
        project_id,
        source_language_id,
        target_language_id,
        service_id,
        unit_id,
        volume,
        rate,
        total,
        date,
        due_date,
        template_id,
        note,
        created_at,
        updated_at
      ) VALUES (
        ${safeNum(p_resource_id.selectedOptionValue)},
        ${safeNum(p_currency_id.selectedOptionValue)},
        ${safeNum(appsmith.store.selectedProjectData?.project_id)},
        ${safeNum(p_source_language_id.selectedOptionValue)},
        ${safeNum(p_target_language_id.selectedOptionValue)},
        ${safeNum(p_service_id.selectedOptionValue)},
        ${safeNum(p_unit_id.selectedOptionValue)},
        ${safeNum(p_volume.text)},
        ${safeNum(p_rate.text)},
        ${safeNum(p_total.text)},
        ${safeDate(p_date.selectedDate)},
        ${safeDate(p_due_date.selectedDate)},
        ${safeNum(p_template_id.selectedOptionValue)},
        ${safeText(p_note.text)},
        NOW(),
        NOW()
      );
    `;

    return InsertPOQuery.run({ query: queryText });
  }
};
