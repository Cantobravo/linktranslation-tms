export default {
  render(str) {
    if (!str) return "";

    const r = tbl_resources.selectedRow || {};

    return str
      .replace(/{{resource_email}}/g, r.resource_email ?? "")
      .replace(/{{resource_first_name}}/g, r.resource_first_name ?? "")
      .replace(/{{resource_last_name}}/g, r.resource_last_name ?? "")
      .replace(/{{resource_full_name}}/g, r.resource_full_name ?? "")
      .replace(/{{resource_native_language}}/g, r.resource_native_language ?? "");
  }
};
