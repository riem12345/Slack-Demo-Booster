function registerActionHandlers(app) {
 // 「新しい会話を作成」ボタン
  app.action('button_create_conversation', async ({ ack, body, client }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'generate_conversation_modal',
          title: {
            type: 'plain_text',
            text: '会話を生成'
          },
          submit: {
            type: 'plain_text',
            text: '生成する'
          },
          close: {
            type: 'plain_text',
            text: 'キャンセル'
          },
          blocks: [
            {
              type: 'input',
              block_id: 'topic_block',
              element: {
                type: 'plain_text_input',
                action_id: 'topic_input',
                multiline: true, // ← ⑥ 大きくする
                placeholder: {
                  type: 'plain_text',
                  text: '例: 新製品のマーケティング戦略について議論する'
                }
              },
              label: {
                type: 'plain_text',
                text: '📋 会話のトピック'
              },
              hint: {
                type: 'plain_text',
                text: 'このトピックに基づいて自然な会話が生成されます'
              }
            },
            {
              type: 'input',
              block_id: 'situation_block', // ← ⑦ シチュエーション欄を追加
              element: {
                type: 'plain_text_input',
                action_id: 'situation_input',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: '例: 営業チームとマーケティングチームの会議'
                }
              },
              label: {
                type: 'plain_text',
                text: '🎭 シチュエーション'
              },
              hint: {
                type: 'plain_text',
                text: 'どんな人たちの間でかわされる会話かを記入してください'
              }
            },
            {
              type: 'input',
              block_id: 'channel_block',
              element: {
                type: 'channels_select',
                action_id: 'channel_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'チャンネルを選択してください'
                }
              },
              label: {
                type: 'plain_text',
                text: '📢 投稿先チャンネル'
              },
              hint: {
                type: 'plain_text',
                text: '会話を投稿するチャンネルを選択してください'
              }
            },
            {
              type: 'input',
              block_id: 'count_block',
              element: {
                type: 'number_input',
                action_id: 'count_input',
                is_decimal_allowed: false,
                initial_value: '10',
                min_value: '3',
                max_value: '30'
              },
              label: {
                type: 'plain_text',
                text: '💬 メッセージ数'
              },
              hint: {
                type: 'plain_text',
                text: '生成するメッセージの数(3〜30)'
              }
            },
            {
              type: 'input',
              block_id: 'thread_block',
              optional: true,
              element: {
                type: 'checkboxes',
                action_id: 'thread_checkbox',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: 'この会話をスレッド形式にする'
                    },
                    value: 'use_thread'
                  }
                ]
              },
              label: {
                type: 'plain_text',
                text: '🧵 スレッド形式'
              }
            },
            {
              type: 'input',
              block_id: 'participants_block',
              element: {
                type: 'number_input',
                action_id: 'participants_input',
                is_decimal_allowed: false,
                min_value: '2',
                max_value: '10',
                initial_value: '3',
                placeholder: {
                  type: 'plain_text',
                  text: '2〜10'
                }
              },
              label: {
                type: 'plain_text',
                text: '👥 会話の参加者数'
              },
              hint: {
                type: 'plain_text',
                text: '会話に参加するメンバーの人数（2〜10人）'
              }
            },
            {
              type: 'input',
              block_id: 'message_size_block', // ← ⑤ 文字数規模指定
              element: {
                type: 'static_select',
                action_id: 'message_size_select',
                placeholder: {
                  type: 'plain_text',
                  text: '選択してください'
                },
                initial_option: {
                  text: {
                    type: 'plain_text',
                    text: '少なめ（100文字前後）'
                  },
                  value: 'small'
                },
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '少なめ（100文字前後）'
                    },
                    value: 'small'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '普通（200文字前後）'
                    },
                    value: 'medium'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '多め（300文字前後）'
                    },
                    value: 'large'
                  }
                ]
              },
              label: {
                type: 'plain_text',
                text: '📏 メッセージのサイズ'
              },
              hint: {
                type: 'plain_text',
                text: '1投稿あたりの文字数の目安を選択してください'
              }
              
            },
            {
              type: 'input',
              block_id: 'reaction_block',
              element: {
                type: 'static_select',
                action_id: 'reaction_select',
                placeholder: {
                  type: 'plain_text',
                  text: '選択してください'
                },
                initial_option: {
                  text: {
                    type: 'plain_text',
                    text: '普通'
                  },
                  value: 'normal'
                },
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: 'なし'
                    },
                    value: 'none'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '少なめ'
                    },
                    value: 'few'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '普通'
                    },
                    value: 'normal'
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '多め'
                    },
                    value: 'many'
                  }
                ]
              },
              label: {
                type: 'plain_text',
                text: '👍 リアク字'
              },
              hint: {
                type: 'plain_text',
                text: 'メッセージに付けるリアクション絵文字の頻度'
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error opening conversation modal:', error);
    }
  });
  // 「メッセージを編集」ボタン
  app.action('button_edit_message', async ({ ack, body, client }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'メッセージの編集方法'
          },
          close: {
            type: 'plain_text',
            text: '閉じる'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '✏️ *メッセージの編集方法*\n\nメッセージショートカットを使って編集できます：'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '1. 編集したいメッセージの右側にある *3点メニュー (•••)* をクリック\n2. *「アプリに接続する」* を選択\n3. *「その他のメッセージ ショートカット」* を選択\n4. *「メッセージを編集（Demo Booster）」* をクリック\n5. モーダルで内容を編集して保存'
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error showing edit instructions:', error);
    }
  });
  // 「期間指定で削除」ボタン
  app.action('button_delete_by_range', async ({ ack, body, client }) => {
    await ack();
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'delete_range_modal',
          title: {
            type: 'plain_text',
            text: '期間指定削除'
          },
          submit: {
            type: 'plain_text',
            text: '削除する'
          },
          close: {
            type: 'plain_text',
            text: 'キャンセル'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '⚠️ *注意:* 指定した期間内のメッセージがすべて削除されます。'
              }
            },
            {
              type: 'input',
              block_id: 'channel_block',
              element: {
                type: 'channels_select',
                action_id: 'channel_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'チャンネルを選択'
                }
              },
              label: {
                type: 'plain_text',
                text: '📢 チャンネル'
              }
            },
            {
              type: 'input',
              block_id: 'start_time_block',
              element: {
                type: 'datetimepicker',
                action_id: 'start_time_input'
              },
              label: {
                type: 'plain_text',
                text: '🕐 開始日時'
              }
            },
            {
              type: 'input',
              block_id: 'end_time_block',
              element: {
                type: 'datetimepicker',
                action_id: 'end_time_input'
              },
              label: {
                type: 'plain_text',
                text: '🕑 終了日時'
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error opening delete range modal:', error);
    }
  });
  
}
module.exports = { registerActionHandlers };