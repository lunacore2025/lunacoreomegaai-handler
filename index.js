const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());

// GPT API 키를 환경 변수에서 불러옴
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 기본 테스트 라우터
app.get('/', (req, res) => {
  res.send('✅ LunaCoreOmegaAI 핸들러가 작동 중입니다!');
});

// 질문 처리 라우터
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: 'question 필드는 필수입니다.' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '당신은 친절하고 전문적인 AI입니다.' },
        { role: 'user', content: question }
      ]
    });

    const answer = chatCompletion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('GPT 호출 오류:', error);
    res.status(500).json({ error: 'GPT 호출에 실패했습니다.' });
  }
});

// Cloud Run에서 요구하는 포트 사용
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 리스닝 중입니다.`);
});
