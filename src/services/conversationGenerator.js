const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
class ConversationGenerator {
async generateConversation(topic, situation, messageCount = 10, messageSize = 'medium', reactionLevel = 'normal', participantCount = 3) {
let responseText;
try {
const sizeGuide = {
small: '各メッセージは日本語で200文字前後（3〜4文程度）にしてください。短すぎないように注意してください',
medium: '各メッセージは日本語で300文字前後（5〜7文程度）にしてください。しっかりとした内容のあるメッセージにしてください',
large: '各メッセージは日本語で400文字前後（8〜10文程度）にしてください。詳しく丁寧な内容にしてください'
};
let reactionInstruction = '';
if (reactionLevel === 'none') {
reactionInstruction = '- reactionsフィールドは空配列[]にしてください';
} else if (reactionLevel === 'few') {
reactionInstruction = '- 約10〜20%のメッセージにリアク字を付けてください。控えめに、特に良い発言にだけ付けてください。適切なSlack標準絵文字名を使用（例: thumbsup, eyes, 100, smile）';
} else if (reactionLevel === 'normal') {
reactionInstruction = '- 約30〜40%のメッセージにリアク字を付けてください。適切なSlack標準絵文字名を使用（例: thumbsup, heart, eyes, fire, tada, raised_hands, 100, thinking_face, smile, clap）';
} else if (reactionLevel === 'many') {
reactionInstruction = '- 約60〜80%のメッセージにリアク字を付けてください。1つのメッセージに複数のリアク字を付けても良いです。適切なSlack標準絵文字名を使用（例: thumbsup, heart, eyes, fire, tada, raised_hands, 100, thinking_face, smile, clap, sparkles, rocket, muscle, pray, wave）';
}
const prompt = `あなたはSlackでの自然な会話を生成するアシスタントです。
以下の条件に基づいて、${messageCount}個のメッセージからなる自然な会話を生成してください。
トピック: ${topic}
シチュエーション: ${situation}
要件:
- 必ず${participantCount}人の話者で会話してください。話者名は「話者1」「話者2」...「話者${participantCount}」としてください
- 各話者がバランスよく発言するようにしてください
- ${sizeGuide[messageSize]}
- 各メッセージは独立した発言として出力
- JSONフォーマットで出力: [{"speaker": "話者1", "message": "メッセージ内容", "reactions": ["絵文字名"]}]
- reactionsには、そのメッセージに対する他の参加者からのリアクションとして適切なSlack絵文字名を配列で指定
${reactionInstruction}
- 日本語で生成
- ビジネスシーンでの自然な会話を心がける
- メッセージには、たまに効果的に絵文字を織り交ぜる（ただしビジネスシーンなので控えめに）
重要: JSONのみを出力し、マークダウンのコードブロックは使用しないでください。`;
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
const result = await model.generateContent(prompt);
responseText = result.response.text();
const cleanedText = responseText
.replace(/```json\n?/g, '')
.replace(/```\n?/g, '')
.trim();
const conversations = JSON.parse(cleanedText);
return conversations;
} catch (error) {
console.error('Error generating conversation:', error);
if (responseText) {
console.error('Response text:', responseText);
}
throw error;
}
}
}
module.exports = new ConversationGenerator();