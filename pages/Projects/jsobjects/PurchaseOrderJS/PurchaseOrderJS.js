export default {
  updateResourceEmail: () => {
    const selected = get_resources_dropdown.data.find(
      (r) => r.value == up_resource_id.selectedOptionValue
    );

    const email = selected?.resource_email || "";
    storeValue("resource_email_live", email);
  }
}
