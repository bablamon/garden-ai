import { Configuration, OpenAIApi } from 'openai';

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

const openai = new OpenAIApi(configuration);

// Serverless function handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body; // Get the message from the request

    try {
      // Call OpenAI's API to get the chatbot's response
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });

      // Send the response back to the frontend
      res.status(200).json({ reply: response.data.choices[0].message.content });
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      res.status(500).send('Error communicating with OpenAI');
    }
  } else {
    // If not POST method, return method not allowed
    res.status(405).send('Method Not Allowed');
  }
}
