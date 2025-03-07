
import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/admin.directory.group.readonly'],
  process.env.ADMIN_EMAIL // Admin email for domain-wide delegation
);

/**
 * Check if a user is a member of specific Google Groups
 * @param {string} userEmail - The email of the user to check
 * @param {Array<string>} targetGroups - Array of group email addresses to check membership against
 * @returns {Promise<Array<string>>} - Array of groups the user is a member of
 */
async function getUserGroups(userEmail) {
  try {
    // If service account credentials are not set, return empty array
    if (!process.env.SERVICE_ACCOUNT_EMAIL || !process.env.SERVICE_ACCOUNT_PRIVATE_KEY) {
      console.warn('Google Groups service account credentials not configured');
      return [];
    }

    // Create the directory API client
    const directory = google.admin({
      version: 'directory_v1',
      auth
    });

    // Get all groups the user is a member of
    const response = await directory.groups.list({
      userKey: userEmail
    });

    if (!response.data.groups) {
      return [];
    }

    // Return array of group emails
    return response.data.groups.map(group => group.email);
  } catch (error) {
    console.error('Error checking Google Groups membership:', error);
    return [];
  }
}

/**
 * Check if a user is a member of any of the target groups
 * @param {string} userEmail - The email of the user to check
 * @param {Array<string>} targetGroups - Array of group email addresses to check membership against
 * @returns {Promise<boolean>} - Whether the user is a member of any target group
 */
async function isUserInGroups(userEmail, targetGroups) {
  try {
    // If no target groups or Google Groups integration is not configured, always allow access
    if (!targetGroups || targetGroups.length === 0 || 
        !process.env.SERVICE_ACCOUNT_EMAIL || !process.env.SERVICE_ACCOUNT_PRIVATE_KEY) {
      return true;
    }
    
    const userGroups = await getUserGroups(userEmail);
    
    // Check if any of the user's groups match the target groups
    return userGroups.some(group => targetGroups.includes(group));
  } catch (error) {
    console.error('Error checking group membership:', error);
    return false;
  }
}

export default {
  getUserGroups,
  isUserInGroups
};
