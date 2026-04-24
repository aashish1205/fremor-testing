import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function updateRole() {
  console.log("Logging in to set role...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'connect@fremorglobal.com',
    password: 'Admin@123$',
  });
  
  if (signInError) {
     console.error("Error signing in:", signInError.message);
     return;
  }
  
  console.log("Updating user metadata...");
  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: { role: 'admin' }
  });

  if (updateError) {
      console.error("Error updating user:", updateError.message);
  } else {
      console.log("User role successfully updated to admin. Role is now:", updateData.user?.user_metadata?.role);
  }
}
updateRole();
