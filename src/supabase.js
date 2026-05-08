import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxuvcshkbgtqnjjjpakl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dXZjc2hrYmd0cW5qampwYWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTA1MzIsImV4cCI6MjA5MDg2NjUzMn0.NI7wgqLY9bPr96fH9MGPsoBIQHGp2uBWyJQ25E5EyQk';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
