BALAJI HOME NEEDS — SUPABASE SETUP

IMPORTANT
This project is not ready for public production use until the steps below are completed and tested.

1. In the project folder, create a file named .env (copy .env.example).
2. Paste your Supabase Publishable Key into VITE_SUPABASE_PUBLISHABLE_KEY. Do not use a Secret/service_role key.
3. In Supabase Dashboard > SQL Editor, run supabase-setup.sql.
4. In Supabase Dashboard > Authentication > URL Configuration, set Site URL to your deployed website URL. Add your local URL (for example http://localhost:5173) and deployed URL to Redirect URLs.
5. In Authentication > Providers, enable Email. In Authentication settings, configure email OTP/magic link.
6. Admin login email is vijay.ca444@gmail.com. Only this email is allowed by the SQL RLS policies. Sign in from the Admin page and verify the email link.
7. Run: npm install
8. Run: npm run dev
9. Before deployment run: npm run build
10. For Cloudflare Pages, set the same VITE_ environment variables in Pages > Settings > Environment variables, then redeploy.

SUPABASE PROJECT URL
https://mkmenxlmfcevtyzbnvfk.supabase.co

STORE WHATSAPP
+91 8019621852

SECURITY
Never put Supabase Secret/service_role keys in this project or share them. The publishable key is intended for browser use and relies on the SQL Row Level Security policies.


ADMIN PASSWORD LOGIN
The Admin screen now uses email + password (no email login link). In Supabase Dashboard open Authentication > Users > Add user > Create new user. Enter vijay.ca444@gmail.com and set a strong password that only you know. Confirm/create the user, then use that same email and password on the website Admin login. Do not put the password in .env or share it in chat.
