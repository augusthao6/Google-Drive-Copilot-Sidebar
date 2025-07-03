const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Google OAuth2 setup (placeholder)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// /auth route (Google OAuth2 login)
app.get('/auth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.json({ url });
});

// /files route (list Google Drive files)
app.get('/files', async (req, res) => {
  // Placeholder: expects access_token in query
  const { access_token } = req.query;
  if (!access_token) return res.status(400).json({ error: 'Missing access_token' });
  oauth2Client.setCredentials({ access_token });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  try {
    const result = await drive.files.list({ pageSize: 20 });
    res.json(result.data.files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /query route (accept user prompts and return responses with citations)
app.post('/query', async (req, res) => {
  // Placeholder: expects { prompt, access_token }
  const { prompt, access_token } = req.body;
  if (!prompt || !access_token) return res.status(400).json({ error: 'Missing prompt or access_token' });
  // TODO: Implement retrieval and citation logic
  res.json({ answer: `You asked: ${prompt}`, citations: [] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 