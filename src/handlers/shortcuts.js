function registerShortcuts(app) {
  // メッセージショートカット: メッセージを編集
  app.shortcut('edit_message_shortcut', async ({ shortcut, ack, client }) => {
    await ack();
    try {
      // ショートカットから情報を取得
      const message = shortcut.message;
      const channelId = shortcut.channel.id;
      const messageText = message.text;
      const messageTs = message.ts;
      // モーダルを開く
      await client.views.open({
        trigger_id: shortcut.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'edit_message_from_shortcut_modal',
          title: {
            type: 'plain_text',
            text: 'メッセージを編集'
          },
          submit: {
            type: 'plain_text',
            text: '保存'
          },
          close: {
            type: 'plain_text',
            text: 'キャンセル'
          },
          private_metadata: JSON.stringify({
            channel_id: channelId,
            message_ts: messageTs
          }),
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '✏️ *このメッセージを編集します*'
              }
            },
            {
              type: 'input',
              block_id: 'message_text_block',
              element: {
                type: 'plain_text_input',
                action_id: 'message_text_input',
                multiline: true,
                initial_value: messageText,
                placeholder: {
                  type: 'plain_text',
                  text: 'メッセージの内容を編集...'
                }
              },
              label: {
                type: 'plain_text',
                text: '📝 メッセージ内容'
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error opening edit modal from shortcut:', error);
    }
  });
}
module.exports = { registerShortcuts };