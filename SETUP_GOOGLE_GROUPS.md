
# Setting up Google Workspace Groups Integration

To use Google Groups for access control, you need to create a service account with domain-wide delegation:

## 1. Create a Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "IAM & Admin" > "Service Accounts"
4. Click "Create Service Account"
5. Enter a name and description
6. Click "Create and Continue"
7. For the role, select "Basic" > "Viewer" (you can refine this later)
8. Click "Continue" and then "Done"

## 2. Create and Download a Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select JSON and click "Create"
5. Save the downloaded key file securely

## 3. Enable Domain-Wide Delegation

1. Edit the service account
2. Enable "Domain-wide delegation"
3. Save the changes

## 4. Configure Admin Console

1. Go to your [Google Workspace Admin Console](https://admin.google.com/)
2. Navigate to Security > API Controls
3. In the "Domain-wide Delegation" section, click "Manage Domain-wide Delegation"
4. Click "Add new"
5. Enter the Client ID from your service account 
6. For OAuth scopes, enter: `https://www.googleapis.com/auth/admin.directory.group.readonly`
7. Click "Authorize"

## 5. Update Your Environment Variables

Update the `.env` file with:

```
SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
ADMIN_EMAIL=admin@yourdomain.com
ALLOWED_GOOGLE_GROUPS=group1@yourdomain.com,group2@yourdomain.com
```

Notes:
- `SERVICE_ACCOUNT_PRIVATE_KEY` should be the entire private key from the JSON file, with newlines replaced by `\n`
- `ADMIN_EMAIL` should be an admin user in your Google Workspace
- `ALLOWED_GOOGLE_GROUPS` is a comma-separated list of group email addresses that have access to your app
