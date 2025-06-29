// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://ynuhmfsllswgghlicpjn.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludWhtZnNsbHN3Z2dobGljcGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjI1MDgsImV4cCI6MjA2NjMzODUwOH0.8MVQPWajuxHqEg0M-a3-bYzpMjDLwi7f7Vbz9cEl9ZA",
  },
  site: {
    url: import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? "http://localhost:5173" : "https://purpose-pixels-craft.vercel.app"),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}; 