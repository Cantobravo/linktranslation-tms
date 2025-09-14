export default {
  handleRowSelect: async () => {
    await storeValue('cquoteRow', tbl_cquote.triggeredRow || tbl_cquote.selectedRow);
  }
}
