// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kpvayuwrzhrpppporxfv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdmF5dXdyemhycHBwcG9yeGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQwNzQsImV4cCI6MjA2NjI4MDA3NH0.GuBPfMfuIZsbsiYFQn4wAmtHTMGnT-i34Mx-Zw3vN64';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




