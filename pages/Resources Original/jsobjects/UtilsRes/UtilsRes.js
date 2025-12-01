export default {
  isUrl(u) {
    try { return /^https?:\/\//i.test(String(u || '').trim()); } catch { return false; }
  },

  // Normalize Dropbox shared links:
  //  - guarantees https
  //  - ensures ?dl=0 for web view (prevents download prompt)
  normalizeDropboxUrl(u) {
    if (!u) return '';
    let url = String(u).trim();

    // add scheme if missing
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    try {
      const p = new URL(url);
      if (p.hostname.endsWith('dropbox.com')) {
        // common share forms:
        //  - https://www.dropbox.com/scl/fo/<id>?rlkey=...&dl=0
        //  - https://www.dropbox.com/s/<id>/<name>?dl=0
        // force dl=0 for web view
        p.searchParams.set('dl', '0');
        return p.toString();
      }
      return url;
    } catch {
      return url;
    }
  }
}
