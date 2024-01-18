// import OpenAI from "openai";


const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require("openai")
// const openai = require('openai');


// Set up CORS and body-parser middleware
const express = require('express');
const app = express();
require('dotenv').config();



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const openaiApiKey = process.env.OPENAI_API_KEY;
console.log("a a - -- --- --- -- -- --- -- --- -- ")


const openaiApi = new OpenAI({
  apiKey: openaiApiKey,
});


app.post('/gpt', async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://email-responder-ai-app.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
    return;
  }
  try {
    const { message, mood, context, emailType, name, language } = req.body;

    // Set OpenAI API completion parameters
    const completions = await openaiApi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Write a response to the following email in ${language}. Please ensure that the response is written in the same language as the email, unless otherwise specified. The tone of the response should be ${mood}. This is a(n) ${emailType}. Your name is ${name}. If necessary, please use the following additional context to inform your response: ${context} Email provided: '${message}'` },
      ],
      temperature: 1,
      max_tokens: 500,
    });

    if (completions.choices && completions.choices.length > 0) {
      // const response = completions.choices[0].text;
      const response = completions.choices[0].message.content;
      console.log(" --- response -- -- -- ")
      console.log(response);
      console.log(" --- completions -- -- -- ")
      console.log(completions);
      // console.log(response);
      res.status(200).json({ message: response });
    } else {
      console.log("this loop --- -- -- ")
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
    }
    // const response = completions.choices[0].text;

    // res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("server.js error caught")
    if (error.response) {
      // The request was made and the server responded with a non-2xx status
      console.error('OpenAI API Error Response:', error.response.data);
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('OpenAI API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('OpenAI API Request Setup Error:', error.message);
    }
  }
});



app.get('/', function(req, res) {
    res.send('Hello, World!');
  });



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));