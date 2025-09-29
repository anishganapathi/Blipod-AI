import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Use the correct URL without the + character
const supabaseUrl = 'https://sethozoyxgoarhziwzqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldGhvem95eGdvYXJoeml3enF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTM1NTMsImV4cCI6MjA3NDI2OTU1M30.pMyBNAATHfqInWlZ2eaMStMgeIf_JxTMKgN9HOs-lMg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

// For debugging - you can remove this later
console.log('Supabase URL:', supabaseUrl);