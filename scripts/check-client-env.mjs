import { config } from "dotenv";

// Local files are useful for development; Netlify injects the same values into
// process.env from Site configuration → Environment variables.
config({ path: ".env.local", override: false });
config({ path: ".env", override: false });

const required = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("\nMissing required client environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error("\nSet them in Netlify → Site configuration → Environment variables.");
  process.exit(1);
}
