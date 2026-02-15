// 変更後の全体
/**
 * エラーメッセージをユーザーフレンドリーな形式に変換
 */
function getFriendlyErrorMessage(error) {
  const errorMessages = {
    'not_in_channel': 'ボットがチャンネルに参加していません。チャンネルにボットを招待してください。',
    'channel_not_found': '指定されたチャンネルが見つかりません。',
    'message_not_found': '指定されたメッセージが見つかりません。タイムスタンプを確認してください。',
    'invalid_auth': '認証に失敗しました。トークンを確認してください。',
    'rate_limited': 'リクエストが多すぎます。しばらく待ってから再試行してください。'
  };
  return errorMessages[error.data?.error] || `エラーが発生しました: ${error.message}`;
}
module.exports = {
  getFriendlyErrorMessage,
};





