
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the admin SDK
const auth = new google.auth.JWT(
  process.env.SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/admin.directory.group.readonly'],
  process.env.ADMIN_EMAIL // Admin email for domain-wide delegation
);

/**
 * Check if a user is a member of specific Google Groups
 * @param {string} userEmail - The email of the user to check
 * @param {Array<string>} targetGroups - Array of group email addresses to check membership against
 * @returns {Promise<Array<string>>} - Array of groups the user is a member of
 */
export async function getUserGroups(userEmail) {
  try {
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
export async function isUserInGroups(userEmail, targetGroups) {
  try {
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
