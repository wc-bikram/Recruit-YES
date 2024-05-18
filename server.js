require('dotenv').config();
const express = require("express");
const app = express();
const axios = require('axios');
const cors = require('cors');
const db = require("./db.js");
const path = require("path");
const jobsRoute = require('./routes/jobsRoute');
const userRoute = require('./routes/usersRoute');
app.use(cors());
app.use(express.json());
app.use('/api/jobs/', jobsRoute);
app.use('/api/users/', userRoute);

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant with high knowledge about resumes and interview questions. Provide detailed and dynamic answers but in a structured manner.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      }
    );

    const output = response.data.choices[0].message.content;

    
    res.status(200).json({ message: output });
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('client/build'));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

app.listen(port, () => console.log('Node JS Server Started'));




