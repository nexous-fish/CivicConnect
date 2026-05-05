# CivicConnect Authentication Setup Guide

## Overview
CivicConnect uses **Supabase Authentication** for both citizen and officer accounts. The authentication flow is as follows:

- **Citizen Login**: Direct email/password authentication via Supabase Auth
- **Officer Login**: Email/password authentication + role verification from `officers` table

## Current Implementation

### 1. Citizen Authentication (UserAuth.tsx)
✅ **Correct Implementation**
- Uses `supabase.auth.signUp()` for registration
- Uses `supabase.auth.signInWithPassword()` for login
- Stores user profile data in Supabase Auth user metadata
- Automatically redirects to `/user-dashboard` on successful login

### 2. Officer Authentication (OfficerAuth.tsx)
✅ **Correct Implementation**
- Uses `supabase.auth.signInWithPassword()` for authentication
- After successful auth, checks `officers` table for user role
- Enforces officer-only access with role verification
- Prevents unauthorized access by non-officers

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your credentials:
   - Project URL
   - Anon Key
   - Project ID

### Step 2: Update Environment Variables
Update `.env` file:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_PROJECT_ID="your_project_id"
```

### Step 3: Run Database Migrations
All migrations are in `supabase/migrations/`. They include:
- Users/authentication tables
- Complaints table with GPS coordinates
- Officers table with roles
- Cities, States, Nagars tables
- Storage bucket for photos
- RLS (Row Level Security) policies

### Step 4: Create Test Accounts

#### Citizen Account
1. In Supabase Dashboard, go to **Auth** → **Users**
2. Click **Add User**
3. Create citizen account:
   - Email: `citizen@test.com`
   - Password: `Test@123`

#### Officer Account
1. Create auth user:
   - Email: `officer@test.com`
   - Password: `Test@123`

2. Add officer record to database:
   - Go to **SQL Editor** in Supabase
   - Run this query:

```sql
-- Get the officer user ID from auth.users
WITH officer_user AS (
  SELECT id FROM auth.users 
  WHERE email = 'officer@test.com'
  LIMIT 1
)
INSERT INTO public.officers (user_id, city_id, role, department)
SELECT 
  (SELECT id FROM officer_user),
  (SELECT id FROM public.cities LIMIT 1),
  'nodal_officer',
  'Municipal Works'
WHERE EXISTS (SELECT 1 FROM officer_user);
```

### Step 5: Enable Authentication Providers

In Supabase Dashboard:
1. Go to **Auth** → **Providers**
2. Enable **Email** provider (default)
3. Disable other providers if not needed

## Authentication Flow

### Citizen Registration/Login Flow
```
User → SignUp Form
  ↓
Supabase Auth (email/password)
  ↓
User metadata stored
  ↓
Redirect to /user-dashboard
```

### Officer Login Flow
```
Officer → Login Form
  ↓
Supabase Auth (email/password)
  ↓
Query officers table
  ↓
Officer record found? → Yes → Redirect to /officer-dashboard
                      → No → Sign out & show error
```

## Key Features

### Session Management
- ✅ Persistent sessions using localStorage
- ✅ Auto-refresh tokens
- ✅ onAuthStateChange listeners for route protection

### Role-Based Access
- ✅ Citizens: Can only access `/user-*` routes
- ✅ Officers: Can only access `/officer-*` routes
- ✅ Role enforced at database level (RLS policies)

### Data Security
- ✅ Row Level Security (RLS) policies
- ✅ Anonymous users can create complaints
- ✅ Authenticated users can view their own data
- ✅ Officers have elevated permissions

## Troubleshooting

### Issue: "Access denied. Officer account required."
**Solution**: The user is authenticated but doesn't have an officer record in the `officers` table.
- Create an officer record using the SQL query above

### Issue: Login page shows errors
**Solution**: Check if environment variables are correct:
```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY
```

### Issue: Session not persisting
**Solution**: Ensure localStorage is enabled in browser and not blocked by privacy settings

### Issue: Maps not loading in complaint form
**Solution**: This is a free feature! Maps use OpenStreetMap (Nominatim) - no API key needed. Check browser console for errors.

## Database Schema for GPS

The complaints table now includes:
```sql
- latitude: NUMERIC (6 decimal places)
- longitude: NUMERIC (6 decimal places)
- address: TEXT (auto-filled from reverse geocoding)
```

## Testing

### Test Citizen Flow
1. Visit `http://localhost:5173`
2. Click "Citizen Login"
3. Sign up with any email/password
4. Report a complaint
5. **NEW**: Use the map in Step 3 to pinpoint location with GPS

### Test Officer Flow
1. Visit `http://localhost:5173`
2. Click "Officer Login"
3. Login with officer account
4. View and manage complaints
5. Assign to contractors

## API Documentation

### Session Check
```typescript
import { supabase } from "@/integrations/supabase/client";

const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  // User is logged in
}
```

### Sign Out
```typescript
await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

## Next Steps

1. ✅ Install dependencies: `npm install` or `bun install`
2. ✅ Update `.env` with Supabase credentials
3. ✅ Create test accounts in Supabase
4. ✅ Run application: `npm run dev` or `bun run dev`
5. ✅ Test authentication flows

---

**Questions?** Check the Supabase documentation: https://supabase.com/docs/guides/auth
