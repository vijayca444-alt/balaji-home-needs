BALAJI HOME NEEDS — PROJECT SETUP

FRONTEND
- React + Vite
- Cloudflare Pages hosting
- Supabase database and authentication
- PWA installable web app

ENVIRONMENT
1. Keep your existing .env file in the project root, next to package.json.
2. Required browser variables:
   VITE_SUPABASE_URL=your Supabase project URL
   VITE_SUPABASE_PUBLISHABLE_KEY=your Supabase publishable key
   VITE_ADMIN_EMAIL=the authorised store admin email
   VITE_STORE_WHATSAPP=your store WhatsApp number
3. Never put the Supabase service-role/secret key in VITE_ variables or frontend code.

DATABASE
1. Run supabase-setup.sql if setting up the database for the first time.
2. Run CUSTOMER-LOGIN-SUPABASE-MIGRATION.sql for customer accounts and private order history.

CUSTOMER LOGIN
Read CUSTOMER-LOGIN-SETUP.txt. Customers register with full name, unique username, email, mobile and password. Email confirmation is disabled in Supabase, so they can log in immediately. Login accepts username or email plus password. Forgot-password requests go to the store; the authorised admin can issue a temporary password from Customers & Passwords. Guest checkout remains available.

BUILD
PowerShell:
   npm.cmd install
   npm.cmd run build
   npm.cmd run dev

DEPLOY
Push the updated project to the GitHub repository connected to Cloudflare Pages. Set the same VITE_ variables in Cloudflare Pages and redeploy.
