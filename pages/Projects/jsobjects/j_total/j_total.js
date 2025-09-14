export default {
  /* =========================
   * INSERT (sell side)
   * =======================*/
  resetInsert() {
    i_project_volume.setValue('');
    i_project_rate.setValue('');
    i_project_total.setValue('');
  },
  refreshInsert() {
    const mode = i_pricing_mode?.selectedOptionValue || 'PER_UNIT';
    if (mode !== 'PER_UNIT') return;
    const qty  = Number(i_project_volume.text || 0);
    const rate = Number(i_project_rate.text  || 0);
    if (!isFinite(qty) || !isFinite(rate) || qty <= 0 || rate < 0) {
      i_project_total.setValue('');
      return;
    }
    i_project_total.setValue(Number((qty * rate).toFixed(2)));
  },
  // Back-compat alias
  refresh() { return this.refreshInsert(); },

  /* =========================
   * UPDATE (sell side)
   * =======================*/
  resetUpdate() {
    u_project_volume.setValue('');
    u_project_rate.setValue('');
    u_project_total.setValue('');
  },
  refreshUpdate() {
    const mode = u_pricing_mode?.selectedOptionValue || 'PER_UNIT';
    if (mode !== 'PER_UNIT') return;
    const qty  = Number(u_project_volume.text || 0);
    const rate = Number(u_project_rate.text  || 0);
    if (!isFinite(qty) || !isFinite(rate) || qty <= 0 || rate < 0) {
      u_project_total.setValue('');
      return;
    }
    u_project_total.setValue(Number((qty * rate).toFixed(2)));
  },

  /* =========================
   * PO INSERT/UPDATE (cost)
   * =======================*/
  resetPO() {
    p_volume.setValue('');
    p_rate.setValue('');
    p_total.setValue('');
  },
  refreshPO() {
    const mode = p_pricing_mode?.selectedOptionValue || 'PER_UNIT';
    if (mode !== 'PER_UNIT') return;
    const qty  = Number(p_volume.text || 0);
    const rate = Number(p_rate.text   || 0);
    if (!isFinite(qty) || !isFinite(rate) || qty <= 0 || rate < 0) {
      p_total.setValue('');
      return;
    }
    p_total.setValue(Number((qty * rate).toFixed(2)));
  },
  resetPOUpdate() {
    up_volume.setValue('');
    up_rate.setValue('');
    up_total.setValue('');
  },
  refreshPOUpdate() {
    const mode = up_pricing_mode?.selectedOptionValue || 'PER_UNIT';
    if (mode !== 'PER_UNIT') return;
    const qty  = Number(up_volume.text || 0);
    const rate = Number(up_rate.text   || 0);
    if (!isFinite(qty) || !isFinite(rate) || qty <= 0 || rate < 0) {
      up_total.setValue('');
      return;
    }
    up_total.setValue(Number((qty * rate).toFixed(2)));
  }
};
