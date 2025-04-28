import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.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
,  // Your OpenAI API Key
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    res.status(200).json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error communicating with OpenAI');
  }
}
