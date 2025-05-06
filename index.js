const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 상태 점검용 기본 응답
app.get('/', (req, res) => {
  res.send('✅ LunaCoreOmegaAI 핸들러 작동 중');
});

// GPT 질문 처리
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: 'question 필드는 필수입니다.' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '당신은 친절하고 전문적인 AI입니다.' },
        { role: 'user', content: question },
      ],
    });
    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('GPT 호출 오류:', error.message);
    res.status(500).json({ error: 'GPT 호출에 실패했습니다.' });
  }
});

// Cloud Run 포트 리스닝
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 리스닝 중입니다.`);
});
