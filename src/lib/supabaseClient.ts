import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ijqfezqknxiyrphceeop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcWZlenFrbnhpeXJwaGNlZW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzE5ODIsImV4cCI6MjA5NDAwNzk4Mn0.gI449HGAYprmlmKLyZb9hrjDY-cXmejZXc_7SOYGz6s';

export const supabase = createClient(supabaseUrl, supabaseKey);
