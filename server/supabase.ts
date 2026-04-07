import { createClient } from "@supabase/supabase-js";

// Vercel 上环境变量由平台注入，本地靠 dotenv（在 app.ts 中加载）
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
  );
  // 不使用 process.exit() 以兼容 Vercel Serverless
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
