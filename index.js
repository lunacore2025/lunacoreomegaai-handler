const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.json());

// GPT API 키를 환경변수에서 불러옴
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 기본 응답 - GET 요청 테스트용
app.get('/', (req, res) => {
  res.send('LunaCoreOmegaAI 핸들러가 작동 중입니다!');
});

// GPT 질문 처리 - POST /ask
app.post('/ask', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'question 필드는 필수입니다.' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // 필요 시 gpt-3.5-turbo로 변경 가능
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

// 서버 시작
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버 실행 중: 포트 ${PORT}`);
});
