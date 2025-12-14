# Facebook OAuth Setup Guide

## Required URLs for Facebook App Configuration

When setting up Facebook OAuth in your Facebook App settings, you'll need to provide the following URLs:

### 1. Privacy Policy URL
```
https://your-domain.com/privacy-policy
```
or for local development:
```
http://localhost:3000/privacy-policy
```

### 2. User Data Deletion URL
```
https://your-domain.com/data-deletion
```
or for local development:
```
http://localhost:3000/data-deletion
```

## Where to Configure the Callback URL

### Step 1: Facebook App Settings

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app (or create a new one)
3. Go to **Settings** → **Basic**
4. Add your **App Domains**:
   - For production: `your-domain.com`
   - For development: `localhost` (optional, for testing)

### Step 2: Facebook Login Settings

1. In your Facebook App dashboard, go to **Products** → **Facebook Login** → **Settings**
2. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://your-domain.com/auth/callback
   ```
   For local development:
   ```
   http://localhost:3000/auth/callback
   ```

### Step 3: Supabase Configuration

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Facebook** and click to configure
4. Enter your **Facebook App ID** and **App Secret**
5. The **Redirect URL** should be:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   (This is automatically provided by Supabase)

### Step 4: Facebook App Settings (Advanced)

In your Facebook App settings, also configure:

1. **Privacy Policy URL** (Settings → Basic):
   ```
   https://your-domain.com/privacy-policy
   ```

2. **User Data Deletion URL** (Settings → Basic):
   ```
   https://your-domain.com/data-deletion
   ```

3. **App Review** (if needed):
   - Submit your app for review if you want to use it in production
   - For development, you can add test users

## Complete Flow

```
User clicks "Sign in with Facebook"
    ↓
Facebook OAuth (redirects to Facebook)
    ↓
User authorizes app
    ↓
Facebook redirects to: https://your-project-ref.supabase.co/auth/v1/callback
    ↓
Supabase processes OAuth
    ↓
Supabase redirects to: https://your-domain.com/auth/callback?code=...
    ↓
Your app exchanges code for session
    ↓
User is logged in
```

## Important Notes

1. **Callback URL in Supabase**: The callback URL in Supabase (`https://your-project-ref.supabase.co/auth/v1/callback`) is automatically handled. You don't need to configure this in Facebook.

2. **Your App's Callback**: The callback URL you configure in Facebook should be your app's callback route: `/auth/callback`

3. **HTTPS Required**: Facebook requires HTTPS for production. Use `http://localhost:3000` only for local development.

4. **App Domains**: Make sure your App Domains in Facebook match your actual domain.

5. **Test Users**: For development, you can add test users in Facebook App → Roles → Test Users

## Troubleshooting

### "Invalid OAuth Redirect URI"
- Check that the redirect URI in Facebook matches exactly: `https://your-domain.com/auth/callback`
- Make sure there are no trailing slashes
- Verify the protocol (https vs http)

### "App Not Setup"
- Make sure Facebook Login product is added to your app
- Verify App ID and App Secret are correct in Supabase

### "Privacy Policy URL Required"
- Make sure you've added the Privacy Policy URL in Facebook App → Settings → Basic
- The URL must be publicly accessible

### "User Data Deletion URL Required"
- Make sure you've added the Data Deletion URL in Facebook App → Settings → Basic
- The URL must be publicly accessible

## Quick Checklist

- [ ] Facebook App created
- [ ] App ID and App Secret obtained
- [ ] Privacy Policy URL added to Facebook App settings
- [ ] User Data Deletion URL added to Facebook App settings
- [ ] Valid OAuth Redirect URI added: `https://your-domain.com/auth/callback`
- [ ] App Domains configured in Facebook
- [ ] Facebook App ID and Secret added to Supabase
- [ ] Privacy Policy page created at `/privacy-policy`
- [ ] Data Deletion page created at `/data-deletion`
- [ ] Test the OAuth flow

## Example URLs (Replace with your domain)

**Production:**
- Privacy Policy: `https://leeviennafs.com/privacy-policy`
- Data Deletion: `https://leeviennafs.com/data-deletion`
- Callback: `https://leeviennafs.com/auth/callback`

**Development:**
- Privacy Policy: `http://localhost:3000/privacy-policy`
- Data Deletion: `http://localhost:3000/data-deletion`
- Callback: `http://localhost:3000/auth/callback`

