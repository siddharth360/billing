
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userInfo = userInfoResponse.data;
    
    // Get user groups from Google Admin
    // Note: This requires additional setup with Google Admin SDK
    // and proper OAuth2 scopes for directory access
    let userGroups = [];
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        // This is a simplified example. In reality, you'd use a service account
        // with domain-wide delegation to access the Admin SDK
        // See: https://developers.google.com/admin-sdk/directory/v1/guides/delegation
        
        // Fetch user groups - this is just placeholder code
        // const groupsResponse = await googleAdminClient.groups.list({
        //   userKey: userInfo.email
        // });
        // userGroups = groupsResponse.data.groups || [];
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
    
    // Create user session
    const user = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      groups: userGroups.map(group => group.name)
    };
    
    req.session.user = user;
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ authenticated: true, user: req.session.user });
  }
  return res.status(401).json({ authenticated: false });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
