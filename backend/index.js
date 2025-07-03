const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory token storage (replace with database in production)
const userTokens = new Map();

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// /auth route (Google OAuth2 login)
app.get('/auth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/documents.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  res.json({ url });
});

// /auth/callback route (handle OAuth callback)
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code not found' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token } = tokens;

    // Get user info
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Store tokens with user ID
    const userId = userInfo.data.id;
    userTokens.set(userId, {
      access_token,
      refresh_token,
      userInfo: userInfo.data
    });

    // Redirect to frontend with success
    res.redirect(`http://localhost:5173/auth-success?userId=${userId}&accessToken=${access_token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`http://localhost:5173/auth-error?error=${encodeURIComponent(error.message)}`);
  }
});

// /auth/user route (get user info)
app.get('/auth/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userData = userTokens.get(userId);
  
  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ userInfo: userData.userInfo });
});

// /files route (list Google Drive files)
app.get('/files', async (req, res) => {
  const { access_token, userId } = req.query;
  if (!access_token && !userId) {
    return res.status(400).json({ error: 'Missing access_token or userId' });
  }

  let tokens;
  if (userId) {
    const userData = userTokens.get(userId);
    if (!userData) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    tokens = userData;
  } else {
    tokens = { access_token };
  }

  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  try {
    const result = await drive.files.list({
      pageSize: 50,
      fields: 'files(id,name,mimeType,modifiedTime,parents)',
      orderBy: 'modifiedTime desc'
    });
    res.json(result.data.files);
  } catch (err) {
    console.error('Drive API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// /query route (accept user prompts and return responses with citations)
app.post('/query', async (req, res) => {
  const { prompt, access_token, userId } = req.body;
  if (!prompt || (!access_token && !userId)) {
    return res.status(400).json({ error: 'Missing prompt or authentication' });
  }

  let tokens;
  if (userId) {
    const userData = userTokens.get(userId);
    if (!userData) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    tokens = userData;
  } else {
    tokens = { access_token };
  }

  // TODO: Implement retrieval and citation logic
  // For now, return a placeholder response
  res.json({ 
    answer: `You asked: "${prompt}". This is a placeholder response. Implement document search and AI processing here.`, 
    citations: [] 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`OAuth redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);
}); 