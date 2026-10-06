/**
 * KABU STORY 登録フォーム → スプレッドシート保存
 * 使い方：
 * 1. Googleスプレッドシートを新規作成（名前例：KABU STORY 登録者）
 * 2. 拡張機能 → Apps Script を開き、このコードを貼り付けて保存
 * 3. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」
 *    実行ユーザー：自分 / アクセスできるユーザー：全員
 * 4. 表示されたウェブアプリURLを script.js の GAS_URL に貼る
 */
const SHEET_NAME = '登録者';

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['登録日時', 'ニックネーム', 'メールアドレス', '年代', '投資経験', '気になっていること']);
    sheet.setFrozenRows(1);
  }
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.age || '',
    data.exp || '',
    data.worry || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
