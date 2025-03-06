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
    let userGroups = [];
    try {
      // Using the access token to fetch groups
      // This requires the correct OAuth scope (https://www.googleapis.com/auth/admin.directory.group.readonly)
      const groupsResponse = await axios.get(
        `https://admin.googleapis.com/admin/directory/v1/groups?userKey=${userInfo.email}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (groupsResponse.data && groupsResponse.data.groups) {
        userGroups = groupsResponse.data.groups.map(group => ({
          id: group.id,
          name: group.name,
          email: group.email
        }));
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
      // If there's an error, we'll continue without groups
      // This could happen if user doesn't have permission or the token doesn't have required scopes
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