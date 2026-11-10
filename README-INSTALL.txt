BALAJI HOME NEEDS — UPDATED PROJECT INSTALL

1. Extract this ZIP into a new folder.
2. Copy your existing .env file into this folder (same level as package.json). Do not upload it to GitHub.
3. Run in PowerShell:
     npm.cmd install
     npm.cmd run build
     npm.cmd run dev
4. Complete the Supabase steps in CUSTOMER-LOGIN-SETUP.txt before testing customer registration, username login or admin password reset.
5. Run CUSTOMER-LOGIN-SUPABASE-MIGRATION.sql once in Supabase SQL Editor.
6. Deploy the customer-login and admin-customer-management Edge Functions using Supabase CLI.
7. Turn OFF Supabase Email "Confirm email" so customers can create accounts without a verification email.
8. Test locally, then publish to the existing GitHub repository and deploy through Cloudflare Pages.

IMPORTANT
- Keep your current .env values private.
- Do not replace or expose the Supabase service-role key in frontend code.
- Keep your current Admin login credentials safe.
- Guest checkout remains available.
