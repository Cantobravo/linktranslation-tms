export default {
  // init array if missing
  _ensureIns() {
    const arr = appsmith.store.ins_pairs;
    if (!Array.isArray(arr)) return storeValue('ins_pairs', []);
    return Promise.resolve();
  },

  // adds a staged pair if valid & not duplicate
  async addPairIns(srcId, srcLabel, tgtId, tgtLabel) {
    await this._ensureIns();
    const sId = Number(srcId), tId = Number(tgtId);
    if (!sId || !tId) { showAlert('Pick source and target.', 'warning'); return; }
    if (sId === tId) { showAlert('Source and target cannot be the same.', 'warning'); return; }

    const label = `${srcLabel || sId} → ${tgtLabel || tId}`;
    const key = `${sId}-${tId}`;

    const list = appsmith.store.ins_pairs || [];
    if (list.some(p => p.key === key)) { showAlert('Pair already added.', 'info'); return; }

    list.push({
      __idx: list.length,
      key, label,
      source_language_id: sId,
      target_language_id: tId
    });
    await storeValue('ins_pairs', list);
    resetWidget('i_src_lang_add_ins', true);
    resetWidget('i_tgt_lang_add_ins', true);
  },

  async removePairIns(idx) {
    const list = (appsmith.store.ins_pairs || []).filter(p => p.__idx !== idx);
    // re-index
    list.forEach((p,i) => p.__idx = i);
    await storeValue('ins_pairs', list);
  }
}
