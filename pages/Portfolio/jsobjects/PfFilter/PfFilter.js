export default {
  _escapeRe(s) {
    return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  _tagRegex(tagsArr) {
    const arr = (tagsArr || []).map(x => String(x || "").trim()).filter(Boolean);
    if (!arr.length) return "";

    const alt = arr.map(t => this._escapeRe(t.toLowerCase())).join("|");

    // Match whole tokens in a comma/semicolon separated string
    return `(^|[;,][[:space:]]*)(${alt})([[:space:]]*[;,]|$)`;
  },

  run() {
    const area_list = ms_pf_area.selectedOptionValues || [];
    const tags = ms_pf_tags.selectedOptionValues || [];
    const tag_re = this._tagRegex(tags);

    return get_pf_list.run({
      area_list,
      tag_re: tag_re || ""
    });
  }
};
