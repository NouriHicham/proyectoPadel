import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndzzdinmqmhmexyaorac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kenpkaW5tcW1obWV4eWFvcmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTgwNjAsImV4cCI6MjA1NTk5NDA2MH0.YoV4jqtmRrXq-ZHLxMWgHKGRIVwYNz7KRVhnkYOxYIs';
export const supabase = createClient(supabaseUrl, supabaseKey);

