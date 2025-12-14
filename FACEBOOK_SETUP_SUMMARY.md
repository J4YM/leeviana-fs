# Facebook OAuth Setup - Quick Reference

## Required URLs for Facebook App

### 1. Privacy Policy URL
**Production:**
```
https://your-domain.com/privacy-policy
```

**Development:**
```
http://localhost:3000/privacy-policy
```

### 2. User Data Deletion URL
**Production:**
```
https://your-domain.com/data-deletion
```

**Development:**
```
http://localhost:3000/data-deletion
```

## Where to Put the Callback URL

### In Facebook App Settings:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to **Products** → **Facebook Login** → **Settings**
4. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://your-domain.com/auth/callback
   ```

### In Supabase:

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Facebook**
3. Enter your **Facebook App ID** and **App Secret**
4. The redirect URL shown in Supabase (`https://your-project.supabase.co/auth/v1/callback`) is automatically handled - you don't need to configure this in Facebook

## Complete Setup Steps

1. ✅ Create Privacy Policy page at `/privacy-policy`
2. ✅ Create Data Deletion page at `/data-deletion`
3. ✅ Add URLs to Facebook App → Settings → Basic:
   - Privacy Policy URL
   - User Data Deletion URL
4. ✅ Add Callback URL to Facebook App → Products → Facebook Login → Settings:
   - Valid OAuth Redirect URI: `https://your-domain.com/auth/callback`
5. ✅ Configure Facebook in Supabase:
   - Add App ID and App Secret
   - The redirect URL is automatically handled by Supabase

## Important Notes

- **Callback URL in Facebook** = Your app's callback route: `/auth/callback`
- **Callback URL in Supabase** = Automatically provided by Supabase (don't configure this in Facebook)
- **HTTPS Required** for production (Facebook requirement)
- **Public Access** required for Privacy Policy and Data Deletion pages

## Testing

After setup, test the flow:
1. Click "Sign in with Facebook" on your site
2. Should redirect to Facebook for authorization
3. After authorization, should redirect back to your site
4. User should be logged in

For detailed instructions, see `FACEBOOK_OAUTH_SETUP.md`

