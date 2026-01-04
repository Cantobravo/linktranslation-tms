export default {
  phMap() {
    return {
      "Resources page": [
        "resource_email",
        "resource_first_name",
        "resource_last_name",
        "resource_full_name",
        "resource_native_language"
      ],
      "Work teams page": [
        "service_name",
        "unit_name",
        "source_language_name",
        "target_language_name",
        "currency_name",
        "certification_names",
        "work_team_name",
        "webapp_name",
        "translator_rate",
        "resource_email",
        "resource_first_name",
        "resource_last_name",
        "resource_full_name",
        "customer_account_name"
      ],
      "Projects page": [
        "project_id",
        "project_name",
        "service_name",
        "unit_name",
        "source_language_name",
        "target_language_name",
        "currency_name",
        "customer_account_name",
        "resource_email",
        "resource_first_name",
        "resource_last_name",
        "resource_full_name",
        "resource_native_language"
      ],
      "Purchase Order section": [
        "purchase_order_id",
        "project_id",
        "unit_name",
        "volume",
        "rate",
        "total",
        "date",
        "due_date",
        "note"
      ]
    };
  },

  phOpts(tplType) {
    if (!tplType) return [];

    const key = tplType.toLowerCase().trim();
    const m = this.phMap();

    let arr = [];

    if (key === "resources") {
      arr = m["Resources page"];
    } else if (key === "work teams") {
      arr = m["Work teams page"];
    } else if (key === "projects") {
      arr = m["Projects page"];
    } else if (key === "purchase order section") {
      arr = m["Purchase Order section"];
    }

    return (arr || []).map(x => ({
      label: `{{${x}}}`,
      value: `{{${x}}}`
    }));
  },

  setFocusKey(key) {
    storeValue("tplFocusKey", key);
  }
};
