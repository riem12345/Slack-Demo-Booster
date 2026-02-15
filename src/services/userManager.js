const { slackClient } = require('../config/slack');
class UserManager {
  async getChannelMembers(channelId) {
    try {
      const result = await slackClient.conversations.members({
        channel: channelId
      });
      return result.members;
    } catch (error) {
      console.error('Error getting channel members:', error);
      throw error;
    }
  }
  async getUserInfo(userId) {
    try {
      const result = await slackClient.users.info({
        user: userId
      });
      return result.user;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
  // 複数のユーザー情報を取得
  async getUsersInfo(userIds) {
    try {
      const userPromises = userIds.map(userId => this.getUserInfo(userId));
      const users = await Promise.all(userPromises);
      // ボットユーザーを除外
      return users.filter(user => !user.is_bot && !user.deleted);
    } catch (error) {
      console.error('Error getting users info:', error);
      throw error;
    }
  }
}
module.exports = new UserManager();