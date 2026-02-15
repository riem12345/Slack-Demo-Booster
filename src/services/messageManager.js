const { slackClient } = require('../config/slack');
class MessageManager {
  // ユーザー情報を使ってメッセージを投稿（改善版）
  async postMessageAsUser(channelId, text, user, threadTs = undefined) {
  try {
   const params = {
    channel: channelId,
    text: text,
    username: user.real_name || user.name,
    icon_url: user.profile.image_72,
   };
   if (threadTs) {
    params.thread_ts = threadTs;
   }
   const result = await slackClient.chat.postMessage(params);
   return result;
  } catch (error) {
   console.error('Error posting message:', error);
   throw error;
  }
 }
  async updateMessage(channelId, messageTs, newText) {
    try {
      await slackClient.chat.update({
        channel: channelId,
        ts: messageTs,
        text: newText,
      });
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }
  async deleteMessage(channelId, timestamp) {
    try {
      const result = await slackClient.chat.delete({
        channel: channelId,
        ts: timestamp
      });
      return result;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
  async getChannelHistory(channelId, oldest = null, latest = null) {
    try {
      const params = {
        channel: channelId,
        limit: 100
      };
      if (oldest) params.oldest = oldest;
      if (latest) params.latest = latest;
      const result = await slackClient.conversations.history(params);
      return result.messages;
    } catch (error) {
      console.error('Error getting channel history:', error);
      throw error;
    }
  }

 async deleteMessagesByTimeRange(channelId, startTime, endTime) {
  try {
   const messages = await this.getChannelHistory(channelId, startTime, endTime);
   if (messages.length === 0) {
    return 0;
   }
   let totalDeleted = 0;
   for (const msg of messages) {
    // スレッド返信の取得を試みる
    try {
     const replies = await slackClient.conversations.replies({
      channel: channelId,
      ts: msg.ts
     });
     if (replies.messages && replies.messages.length > 1) {
      const childMessages = replies.messages.filter(r => r.ts !== msg.ts);
      for (const child of childMessages.reverse()) {
       try {
        await this.deleteMessage(channelId, child.ts);
        totalDeleted++;
       } catch (e) {
        console.error('Error deleting thread reply:', e.message);
       }
      }
     }
    } catch (e) {
     // スレッドがない場合は無視
    }
    // メッセージを削除
    try {
     await this.deleteMessage(channelId, msg.ts);
     totalDeleted++;
    } catch (e) {
     console.error('Error deleting message:', e.message);
    }
   }
   return totalDeleted;
  } catch (error) {
   console.error('Error deleting messages by time range:', error);
   throw error;
  }
 }
}
module.exports = new MessageManager();