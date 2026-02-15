const { App } = require('@slack/bolt');
require('dotenv').config();
const { registerHomeHandlers } = require('./handlers/home');
const { registerActionHandlers } = require('./handlers/actions');
const { registerViews } = require('./handlers/views');
const { registerShortcuts } = require('./handlers/shortcuts'); 
// Slack Appの初期化
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});
// ハンドラーの登録
registerHomeHandlers(app);
registerActionHandlers(app);
registerViews(app);
registerShortcuts(app); 
// アプリケーションの起動
(async () => {
  await app.start();
  console.log('⚡️ Slack Sandbox Data Tool is running!');
})();