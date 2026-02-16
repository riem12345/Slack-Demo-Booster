# Demo Booster (Slack Sandbox Data Tool)

Demo BoosterはSlackサンドボックス環境にAI生成の会話データを簡単に投入できるSlackアプリです。

## ⚠️ 注意事項

- Slackサンドボックス環境上にデモを構築するため、データ入出力操作が行われるアプリケーションになります。本番環境に誤って利用しないようご注意ください。
- レポジトリが提供するのはサンプルコードになります。必要な設定、改修を行い自己責任でご利用ください。
- 提供する情報、資材、ソフトウェアに起因または関連し、あるいは使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。

## ✨ ガイド

- Demo Booster - 構成ガイド
　https://salesforce.quip.com/ZSx1ASa6lnDd

- Demo Booster - セットアップガイド
　https://salesforce.quip.com/abYwAT8bXLl5


## ✨ 主な機能

### 💬 会話の自動生成
- トピック・シチュエーションを指定するだけで、Gemini APIが自然なビジネス会話を自動生成
- チャンネルメンバーをランダムに選択して、本人のアイコン・名前で投稿
- メッセージ数・文字数・参加者数・リアクション頻度をカスタマイズ可能
- スレッド形式での投稿に対応
- リアルな会話感を演出するための時間間隔調整

### ✏️ メッセージ編集
- メッセージショートカットから投稿済みメッセージを直接編集

### 🗑️ 期間指定削除
- チャンネルと期間を指定してメッセージを一括削除（スレッド返信含む）

### 🎯 使いやすいUI
- App Home画面からすべての機能にアクセス
- ボタンクリックだけで操作可能
- 処理結果はDMで通知（日本語のエラーメッセージ対応）

## 📋 必要要件

- Node.js v18 以上
- npm
- Slackワークスペース（管理者権限）
- Google Gemini API キー

## 🚀 セットアップ

### 1. プロジェクトの準備

```bash
git clone <repository-url>
cd my-slack-bot
npm install
```

### 2. Slackアプリの作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」→「From scratch」を選択
3. アプリ名（例: `Demo Booster`）とワークスペースを設定

### 3. Socket Mode の有効化

1. 左メニュー「Socket Mode」を開く
2. 「Enable Socket Mode」をON
3. App-Level Token を生成（スコープ: `connections:write`）
4. 生成されたトークン（`xapp-` で始まる）を控える

### 4. Bot Token Scopes の追加

左メニュー「OAuth & Permissions」の Bot Token Scopes に以下を追加:

- `app_mentions:read`
- `channels:history`
- `channels:read`
- `chat:write`
- `chat:write.customize`
- `users:read`
- `im:history`
- `reactions:write`

設定後「Install to Workspace」でインストールし、Bot User OAuth Token（`xoxb-` で始まる）を控える。

### 5. Event Subscriptions の有効化

左メニュー「Event Subscriptions」で「Enable Events」をONにし、Subscribe to bot events に以下を追加:

- `app_home_opened`

### 6. App Home の有効化

左メニュー「App Home」で「Home Tab」をON。

### 7. メッセージショートカットの登録

左メニュー「Interactivity & Shortcuts」で以下のショートカットを作成:

| 項目 | 値 |
|------|---|
| 種類 | On messages |
| 名前 | メッセージを編集（Demo Booster） |
| Callback ID | `edit_message_shortcut` |

### 8. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
```

- `SLACK_SIGNING_SECRET` は左メニュー「Basic Information」→「App Credentials」から取得
- `GEMINI_API_KEY` は [Google AI Studio](https://aistudio.google.com/) から取得

### 9. アプリの起動

```bash
# 開発モード（ファイル変更時に自動再起動）
npm run dev

# 本番モード
npm start
```

起動成功時に以下が表示されます:

```
⚡️ Slack Sandbox Data Tool is running!
```

## 📖 使い方

### 事前準備
1. 会話を投入したいSlackチャンネルを用意する
2. デモに登場させたいメンバーをチャンネルに招待する
3. チャンネルにDemo Boosterのインテグレーションを追加する
   - チャンネル名をクリック →「インテグレーション」タブ →「アプリを追加する」

### 会話を生成
1. SlackサイドバーからDemo Boosterアプリを開く
2. 「💬 新しい会話を作成」ボタンをクリック
3. トピック・シチュエーション・投稿先チャンネル・メッセージ数等を設定
4. 「生成する」をクリック

### メッセージを編集
1. 編集したいメッセージの右側にある 3点メニュー (•••) をクリック
2. 「アプリに接続する」→「その他のメッセージ ショートカット」を選択
3. 「メッセージを編集（Demo Booster）」をクリック
4. モーダルで内容を編集して保存

### メッセージを削除
1. 「🗑️ 期間指定で削除」ボタンをクリック
2. チャンネル・開始日時・終了日時を設定
3. 「削除する」をクリック

## 🛠️ トラブルシューティング

| 症状 | 原因・対処 |
|------|-----------|
| 「ボットがチャンネルに参加していません」 | チャンネルにインテグレーションを追加する |
| 「指定されたチャンネルが見つかりません」 | チャンネルIDが不正、またはボットに閲覧権限がない |
| 「認証に失敗しました」 | `SLACK_BOT_TOKEN` が無効。トークンを再確認 |
| 会話生成が失敗する | `GEMINI_API_KEY` が無効、またはAPI利用制限に到達 |
| アプリが起動しない | `.env` の値が正しいか確認。Socket Modeが有効か確認 |

## 📝 ライセンス
MIT
