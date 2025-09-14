export default {
  storeFormData: () => {
    storeValue('insertedProjectData', {
      project_id: appsmith.store.projectInserted, // Optional: captured separately
      project_name: i_project_name.text,
      customer_id: i_customer_name.selectedOptionValue,
      currency_id: i_currency_id.selectedOptionValue,
      customer_account_id: i_customer_account_id.selectedOptionValue,
      project_status: i_project_status.selectedOptionValue,
      service_id: i_service_id.selectedOptionValue,
      unit_id: i_unit_id.selectedOptionValue,
      source_language_id: i_source_language_id.selectedOptionValue,
      target_language_id: i_target_language_id.selectedOptionValue,
      project_volume: i_project_volume.text,
      project_rate: i_project_rate.text,
      project_total: i_project_total.text,
      project_start_date: i_project_start_date.selectedDate,
      project_end_date: i_project_end_date.selectedDate,
      customer_reference_number: i_customer_reference_number.text,
      project_comments: i_project_comments.text
    });
  }
};
