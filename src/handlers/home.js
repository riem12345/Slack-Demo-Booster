function registerHomeHandlers(app) {
  app.event('app_home_opened', async ({ event, client }) => {
    try {
      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Welcome to Demo Booster！ 🚀'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Slackサンドボックス環境に会話データを簡単に投入できるツールです。'
              }
            },
            {
              type: 'divider'
            },
           {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '使い方ガイド'
              }
            },
           {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '・会話を投入するチャンネルを用意し、デモに登場させたいメンバーを招待した状態で利用開始します。\n ・対象のチャンネルにDemo Boosterのインテグレーション（追加）が必要です。\n　※設定方法　：チャンネル名をクリック > 「インテグレーション」タブ > 「アプリを追加する」で追加'
              }
            },
            {
              type: 'divider'
            },
                       {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Features'
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '💬 新しい会話を作成'
                  },
                  style: 'primary',
                  action_id: 'button_create_conversation'
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '✏️ メッセージを編集'
                  },
                  action_id: 'button_edit_message'
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '🗑️ 期間指定で削除'
                  },
                  style: 'danger',
                  action_id: 'button_delete_by_range'
                }
              ]
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: '💡 処理結果はメッセージタブで確認できます。'
                }
              ]
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error publishing home view:', error);
    }
  });
}
module.exports = { registerHomeHandlers };