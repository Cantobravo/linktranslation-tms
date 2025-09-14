export default {
  _b64ToUtf8(b64) {
    try {
      const clean = (b64 || "").replace(/^data:.*;base64,/, "");
      const binStr = atob(clean);
      const bytes = Uint8Array.from(binStr, c => c.charCodeAt(0));
      const decoder = new TextDecoder("utf-8", { fatal: false });
      return decoder.decode(bytes);
    } catch (e) {
      try { return decodeURIComponent(escape(atob(b64))); } catch { return ""; }
    }
  },

  _basenameNoExt(name) {
    if (!name) return "untitled";
    const base = name.split(/[\\/]/).pop();
    return base.replace(/\.[^.]+$/, "");
    },

  async importFiles() {
    const files = fp_iso_files.files || [];
    if (!files.length) {
      showAlert("Pick at least one text file.", "warning");
      return;
    }

    const tags = i_import_tags.text || null;
    let ok = 0, fail = 0, errs = [];

    for (const f of files) {
      try {
        const title = this._basenameNoExt(f.name);
        const full_text = this._b64ToUtf8(f.data);
        if (!full_text) {
          fail++;
          errs.push(`${f.name}: empty or unreadable`);
          continue;
        }
        await ins_iso_text_one.run({ title, tags, full_text });
        ok++;
      } catch (e) {
        fail++;
        errs.push(`${f.name}: ${(e && e.message) || e}`);
      }
    }

    if (fail === 0) {
      showAlert(`Imported ${ok} file(s).`, "success");
    } else {
      showAlert(`Imported ${ok}, failed ${fail}.`, "warning");
    }

    closeModal('j_iso_import_modal');
    ISOTags.refresh();
    ISOTextSearch.search();
  }
};
