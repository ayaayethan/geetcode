const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth/github', async (req, res) => {
  const { code } = req.body;
  const response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  }, { headers: { Accept: 'application/json' } });

  res.json(response.data);
});

app.listen(3000, () => console.log('OAuth Server running on port 3000'));