const conversationGenerator = require('../services/conversationGenerator');
const userManager = require('../services/userManager');
const messageManager = require('../services/messageManager');
const {getFriendlyErrorMessage } = require('../utils/helpers');
function registerViews(app) {
  app.view('generate_conversation_modal', async ({ ack, body, view, client }) => {
    await ack();
    let channelName = '';
    try {
      const topic = view.state.values.topic_block.topic_input.value;
      const situation = view.state.values.situation_block.situation_input.value;
      const channelId = view.state.values.channel_block.channel_select.selected_channel;
      const messageCount = parseInt(view.state.values.count_block.count_input.value);
      const participantCount = parseInt(view.state.values.participants_block.participants_input.value);
      const messageSize = view.state.values.message_size_block.message_size_select.selected_option.value;
      const reactionLevel = view.state.values.reaction_block.reaction_select.selected_option.value;
      const threadOptions = view.state.values.thread_block?.thread_checkbox?.selected_options || [];
      const useThread = threadOptions.some(opt => opt.value === 'use_thread');
      const channelInfo = await client.conversations.info({ channel: channelId });
      channelName = channelInfo.channel.name;
      const conversations = await conversationGenerator.generateConversation(
        topic, situation, messageCount, messageSize, reactionLevel, participantCount
      );
      const memberIds = await userManager.getChannelMembers(channelId);
      const members = await userManager.getUsersInfo(memberIds);
      if (members.length === 0) {
        throw new Error('チャンネルに投稿可能なユーザーが見つかりませんでした');
      }
      if (members.length < participantCount) {
        throw new Error(`チャンネルのメンバー数（${members.length}人）が参加者数（${participantCount}人）より少ないです`);
      }
      const shuffled = [...members].sort(() => Math.random() - 0.5);
      const selectedMembers = shuffled.slice(0, participantCount);
      const speakerMap = {};
      for (let i = 0; i < participantCount; i++) {
        speakerMap[`話者${i + 1}`] = selectedMembers[i];
      }
      
      let parentTs = null;
      for (let i = 0; i < conversations.length; i++) {
        const conv = conversations[i];
        const user = speakerMap[conv.speaker] || selectedMembers[Math.floor(Math.random() * selectedMembers.length)];
        // メッセージ内の「話者X」をSlackメンションに置換
        let messageText = conv.message;
        for (const [speakerName, memberInfo] of Object.entries(speakerMap)) {
          const userId = memberInfo.id;
          messageText = messageText.replace(new RegExp(`${speakerName}さん`, 'g'), `<@${userId}>`);
          messageText = messageText.replace(new RegExp(`${speakerName}`, 'g'), `<@${userId}>`);
        }
        // スレッド形式の場合、2件目以降は親メッセージにぶら下げる
        const threadTs = (useThread && parentTs) ? parentTs : undefined;
        const postResult = await messageManager.postMessageAsUser(channelId, messageText, user, threadTs);
        // 最初のメッセージのtsを親として記録
        if (useThread && i === 0) {
          parentTs = postResult.ts;
        }
        // リアク字を付加
        if (conv.reactions && conv.reactions.length > 0) {
          for (const reaction of conv.reactions) {
            try {
              await client.reactions.add({
                channel: channelId,
                name: reaction,
                timestamp: postResult.ts
              });
            } catch (reactionError) {
              console.error(`Failed to add reaction ${reaction}:`, reactionError.message);
            }
          }
        }
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      }
      await client.chat.postMessage({
        channel: body.user.id,
        text: `📋 *処理ログ*\n ${new Date().toLocaleString('ja-JP')}\n 会話データ生成\n #${channelName}\n ${conversations.length}件のメッセージを投稿\n✅ 完了`
      });
    } catch (error) {
      console.error('Error generating conversation:', error);
      await client.chat.postMessage({
        channel: body.user.id,
        text: `📋 *処理ログ*\n ${new Date().toLocaleString('ja-JP')}\n 会話データ生成\n #${channelName}\n❌ エラー: ${getFriendlyErrorMessage(error)}`
      });
    }
  });
  app.view('edit_message_from_shortcut_modal', async ({ ack, body, view, client }) => {
    await ack();
    try {
      const metadata = JSON.parse(view.private_metadata);
      const channelId = metadata.channel_id;
      const messageTs = metadata.message_ts;
      const newText = view.state.values.message_text_block.message_text_input.value;
      await messageManager.updateMessage(channelId, messageTs, newText);
    } catch (error) {
      console.error('Error editing message from shortcut:', error);
      await client.chat.postEphemeral({
        channel: body.user.id,
        user: body.user.id,
        text: `❌ メッセージの編集に失敗しました: ${getFriendlyErrorMessage(error)}`
      });
    }
  });
  app.view('delete_range_modal', async ({ ack, body, view, client }) => {
    await ack();
    let channelName = '';
    try {
      const channelId = view.state.values.channel_block.channel_select.selected_channel;
      const startTime = view.state.values.start_time_block.start_time_input.selected_date_time;
      const endTime = view.state.values.end_time_block.end_time_input.selected_date_time;
      const startTimestamp = startTime.toString();
      const endTimestamp = endTime.toString();

      // ← チャンネル名取得を先に移動
      const channelInfo = await client.conversations.info({ channel: channelId });
      channelName = channelInfo.channel.name;

      const deletedCount = await messageManager.deleteMessagesByTimeRange(
        channelId, startTimestamp, endTimestamp
      );
      await client.chat.postMessage({
        channel: body.user.id,
        text: `📋 *処理ログ*\n ${new Date().toLocaleString('ja-JP')}\n 期間指定削除\n #${channelName}\n ${deletedCount}件のメッセージを削除\n✅ 完了`
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
      await client.chat.postMessage({
        channel: body.user.id,
        text: `📋 *処理ログ*\n ${new Date().toLocaleString('ja-JP')}\n 期間指定削除\n #${channelName}\n❌ エラー: ${getFriendlyErrorMessage(error)}`
      });
    }
  });
}
module.exports = { registerViews };