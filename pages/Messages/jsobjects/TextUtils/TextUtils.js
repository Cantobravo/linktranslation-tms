export default {
  // Convert Rich Text HTML to clean plain text with line breaks
  toPlain(html) {
    if (!html) return '';
    let s = String(html);

    // Preserve line breaks before stripping tags
    s = s
      .replace(/<\/p>\s*<p>/gi, '\n')         // paragraph to newline
      .replace(/<br\s*\/?>/gi, '\n')          // <br> to newline
      .replace(/<\/(div|p|li|h[1-6])>/gi, '\n')
      .replace(/<li>/gi, '• ');               // bullets

    // Strip remaining tags
    s = s.replace(/<[^>]*>/g, '');

    // Decode common entities
    const entities = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    Object.keys(entities).forEach(k => { s = s.split(k).join(entities[k]); });

    // Clean whitespace
    s = s
      .replace(/\u00A0/g, ' ')  // non-breaking space
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    return s;
  }
}
