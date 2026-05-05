# Schema Setup Guide - CivicConnect

## ⚠️ IMPORTANT: Run This SQL First!

You're missing the `user_profiles` table, which is causing the 404 error when citizens try to access their dashboard.

### Steps to Fix:

1. **Go to Supabase Dashboard**
   - Project: `zekkikyoziaszetesawn`
   - Navigate to **SQL Editor**

2. **Copy & Paste the Complete Schema**
   - Open file: `COMPLETE_SCHEMA.sql` in your project
   - Copy ALL the SQL
   - Paste into Supabase SQL Editor
   - Click **RUN**

3. **Wait for Completion**
   - Should complete in ~5-10 seconds
   - You'll see "✅ DONE!" message in the SQL output

---

## What Gets Created:

✅ `user_profiles` table - Stores citizen profile info (fixes 404 error)
✅ Automatic profile creation on signup (via trigger)
✅ `officers` table with role-based access
✅ Location tables (states, cities, nagars)
✅ `contractors` table for assignment
✅ `complaints` table with GPS coordinates
✅ Automatic complaint number generation (C001, C002, etc.)
✅ Storage bucket for complaint photos
✅ Row Level Security (RLS) policies
✅ Sample data for testing

---

## After Running SQL

### Test Citizen Login Again
1. Go to `http://localhost:8081`
2. Click **Citizen Login**
3. Login with: `citizen@test.com` / `Test@123`
4. **Should NOT see 404 error** ✅
5. Should redirect to dashboard

### Test Officer Login
1. Go to `http://localhost:8081`
2. Click **Officer Login**
3. You need to create an officer account first:

**Create Officer Account in Supabase:**

1. Go to **Auth** → **Users**
2. Click **Add User**
   - Email: `officer@test.com`
   - Password: `Test@123`
   - Auto confirm: Yes

3. Go to **SQL Editor** and run:

```sql
-- Create officer for testing
INSERT INTO public.officers (user_id, city_id, role, department)
SELECT 
  u.id,
  c.id,
  'nodal_officer',
  'Municipal Works'
FROM auth.users u, public.cities c
WHERE u.email = 'officer@test.com'
AND c.name = 'Durg'
LIMIT 1;
```

4. Now try officer login:
   - Email: `officer@test.com`
   - Password: `Test@123`

---

## Database Schema Overview

### User Management
- `auth.users` - Supabase auth users
- `user_profiles` - Extended user info (phone, full name)
- `officers` - Officers with city assignment

### Location Hierarchy
```
states (e.g., Chhattisgarh)
  ↓
cities (e.g., Durg, Bhilai)
  ↓
nagars (e.g., Subhas Nagar, Supela)
```

### Complaints Workflow
```
complaints (reported by citizen)
  ↓
assigned_contractor_id (assigned to contractor)
  ↓
contractors (handles the complaint)
```

### GPS Features
Each complaint stores:
- `latitude` - GPS coordinate (6 decimal places = 0.1m accuracy)
- `longitude` - GPS coordinate
- `photo_url` - Photo of the issue

---

## Key Features Enabled

### ✅ Automatic Complaint Numbering
- First complaint: C001
- Second complaint: C002
- Auto-incremented via trigger

### ✅ Automatic User Profiles
- When citizen signs up, profile created automatically
- Extracts phone & full name from signup form

### ✅ Role-Based Access
- Citizens can only view their complaints
- Officers can manage complaints in their city
- Contractors can view assigned complaints

### ✅ Timestamp Tracking
- `created_at` - When created
- `updated_at` - Last modified (auto-updated)
- `assigned_at` - When contractor assigned
- `resolved_at` - When marked resolved

---

## Troubleshooting

### Error: "Duplicate key value violates unique constraint"
**Solution**: The table already exists. That's OK! The schema file uses `IF NOT EXISTS` and `ON CONFLICT` clauses.

### Error: "Function already exists"
**Solution**: This is expected. Functions are being recreated to ensure they're up-to-date.

### Citizen login still shows 404
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Try in incognito window

### Officer login says "Access denied"
**Solution**: Officer record not in database. Run the SQL to insert officer record (see above).

---

## Testing Checklist

- [ ] Ran `COMPLETE_SCHEMA.sql` in Supabase
- [ ] Citizen login works (no 404 error)
- [ ] Citizen can see dashboard
- [ ] Created officer test account in Auth
- [ ] Inserted officer record in database
- [ ] Officer login works
- [ ] Officer can see dashboard
- [ ] Report complaint shows map in Step 3
- [ ] GPS coordinates can be captured

---

## Code Changes Made

### Files Modified by Agent:
1. `src/integrations/supabase/client.ts` - ✅ Uses environment variables now
2. `src/components/ComplaintWizard.tsx` - ✅ Uses `photo_url` field
3. `package.json` - ✅ Added leaflet & react-leaflet

### New Files Created:
1. `src/components/LocationPicker.tsx` - Interactive map component
2. `COMPLETE_SCHEMA.sql` - Full database schema
3. `AUTH_SETUP.md` - Authentication setup guide
4. `UPDATES.md` - Feature summary

---

## Next Steps

1. **Run the Schema SQL** (CRITICAL!)
2. **Create test officer account** (in Supabase Auth)
3. **Insert officer record** (using SQL query above)
4. **Test both login flows**
5. **Test complaint reporting with map**

---

## Questions?

- 📖 Supabase Docs: https://supabase.com/docs
- 🗺️ Leaflet Docs: https://leafletjs.com
- 🔐 RLS Guide: https://supabase.com/docs/guides/auth/row-level-security

---

**Important**: The schema includes RLS (Row Level Security) which ensures:
- Citizens can only see their profiles
- Officers can only access their city's data
- Contractors can only see assigned work
- Everyone follows the security rules automatically ✅
