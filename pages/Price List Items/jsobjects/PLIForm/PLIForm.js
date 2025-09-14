export default {
  normalize(row) {
    const r = _.cloneDeep(row) || {};
    const num = v => (v === '' || v === null || v === undefined) ? null : Number(v);
    r.price_list_id       = num(r.price_list_id);
    r.service_id          = num(r.service_id);
    r.unit_id             = num(r.unit_id);
    r.source_language_id  = num(r.source_language_id);
    r.target_language_id  = num(r.target_language_id);
    r.item_is_active = !!Number(r.item_is_active ?? 1);

    const safeDate = d => (d && String(d).length >= 10) ? d : null;
    r.effective_start_date = safeDate(r.effective_start_date);
    r.effective_end_date   = safeDate(r.effective_end_date);

    return {
      price_list_id: r.price_list_id,
      service_id: r.service_id,
      unit_id: r.unit_id,
      source_language_id: r.source_language_id,
      target_language_id: r.target_language_id,
      rate: r.rate ?? null,
      effective_start_date: r.effective_start_date,
      effective_end_date: r.
