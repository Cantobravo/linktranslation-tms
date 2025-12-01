// JSObject: EmailHelper
export default {
// Replace {{field}} with row[field]
_render(tpl, row) {
return String(tpl || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => (
k in (row || {}) ? String(row[k] ?? '') : m
));
},
// Basic HTML → text (keeps line breaks)
_htmlToText(html) {
return String(html || '')
.replace(/<br\s*\/?\s*>/gi, '\n')
.replace(/<\/p>/gi, '\n\n')
.replace(/<p\b[^>]*>/gi, '')
.replace(/<[^>]+>/g, '')
.replace(/\n{3,}/g, '\n\n')
.trim();
},
// Pull selected template
_getTemplate() {
const ds = (get_email_templates_dd_res.data || []);
const val = String(i_email_template_res.selectedOptionValue ?? '');
const hit = ds.find(o => String(o.value) === val) || {};
return {
subject: hit.template_email_subject || '',
html: hit.template_email_body_html || ''
};
},


// BULK: one composer with Bcc list
// Why BODY LAST: some shells append a stray query; keeping body last prevents it sticking to Bcc
sendBulkBcc() {
const rows = tbl_resources.selectedRows || [];
if (!rows.length) { showAlert('Select at least one resource.', 'warning'); return; }


const emails = [...new Set(rows
.map(r => (r.resource_email || '').trim())
.filter(Boolean))];
if (!emails.length) { showAlert('No emails found.', 'warning'); return; }


const tpl = this._getTemplate();
const ctx = tbl_resources.selectedRow || rows[0] || {};


const subject = this._render(tpl.subject, ctx);
const bodyTxt = this._htmlToText(this._render(tpl.html, ctx)) || '\n'; // ensure non-empty


const bcc = emails.map(e => e.replace(/[\s,;]+/g, '')).join(';'); // Outlook-friendly


const params = [];
if (subject) params.push('subject=' + encodeURIComponent(subject));
params.push('bcc=' + bcc);
params.push('body=' + encodeURIComponent(bodyTxt)); // LAST


const url = 'mailto:' + '?' + params.join('&');
navigateTo(url, 'NEW_WINDOW');
},


// PER-ROW: one personalized composer (To: row email)
sendRowEmail(row) {
const r = row || tbl_resources.triggeredRow || tbl_resources.selectedRow;
if (!r) { showAlert('No row selected.', 'warning'); return; }


const to = String(r.resource_email || '').trim();
if (!to) { showAlert('Row has no email.', 'warning'); return; }


const tpl = this._getTemplate();
const subject = this._render(tpl.subject, r);
const bodyTxt = this._htmlToText(this._render(tpl.html, r)) || '\n';


const params = [];
if (subject) params.push('subject=' + encodeURIComponent(subject));
params.push('body=' + encodeURIComponent(bodyTxt)); // LAST


const url = 'mailto:' + encodeURIComponent(to) + '?' + params.join('&');
navigateTo(url, 'NEW_WINDOW');
}
};	