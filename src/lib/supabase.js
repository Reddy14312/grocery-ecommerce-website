import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vehcgqbyyqoxdmvupfqd.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGNncWJ5eXFveGRtdnVwZnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NjAzNDEsImV4cCI6MjA3ODMzNjM0MX0.A3Mx_x_PF3cQSaoQVrWBAr4nUDL7I5Q_VQ-mN3afT50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
