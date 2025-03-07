import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import googleGroups from '../services/googleGroups.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Allowed Google Groups (can be moved to environment variables)
const ALLOWED_GROUPS = process.env.ALLOWED_GOOGLE_GROUPS 
  ? process.env.ALLOWED_GOOGLE_GROUPS.split(',') 
  : [];

// Login with Google
router.post('/google', async (req, res) => {
  try {
    console.log('Received authentication request');
    const { token } = req.body;
    
    if (!token) {
      console.error('No token provided');
      return res.status(400).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;
    
    console.log(`User authenticated: ${userEmail}`);
    
    // If we have allowed groups configured, check membership
    let userGroups = [];
    let hasAccess = true;
    
    try {
      if (ALLOWED_GROUPS.length > 0) {
        console.log(`Checking group membership for ${userEmail} against groups: ${ALLOWED_GROUPS.join(', ')}`);
        
        // Check if user is in any of the allowed groups
        if (process.env.SERVICE_ACCOUNT_EMAIL && process.env.SERVICE_ACCOUNT_PRIVATE_KEY) {
          userGroups = await googleGroups.getUserGroups(userEmail);
          hasAccess = await googleGroups.isUserInGroups(userEmail, ALLOWED_GROUPS);
        } else {
          console.log('Google Groups service account not configured - skipping groups check');
        }
        
        if (!hasAccess) {
          console.log(`Access denied for ${userEmail} - not in allowed groups`);
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this application'
          });
        }
      }
    } catch (groupError) {
      console.error('Error during group check:', groupError);
      // Continue with authentication even if group check fails
      console.log('Continuing authentication despite group check error');
    }

    // Store user in session
    req.session.user = {
      id: payload.sub,
      email: userEmail,
      name: payload.name,
      picture: payload.picture,
      groups: userGroups
    };

    console.log(`User session created for ${userEmail}`);
    res.json({ 
      success: true, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ 
      authenticated: true, 
      user: req.session.user 
    });
  } else {
    res.status(401).json({ 
      authenticated: false 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
    res.clearCookie('connect.sid');
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
});

export default router;