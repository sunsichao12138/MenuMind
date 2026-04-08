import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl as string, supabaseKey as string);

async function main() {
  const { data: recipes, error: recipesError } = await supabase.from('recipes').select('*').limit(100);
  
  if (recipesError) {
    console.error("Error fetching recipes:", recipesError);
  } else if (recipes && recipes.length > 0) {
    console.log("Recipes found:");
    recipes.forEach((r: any) => console.log("- " + (r.name || r.id)));
  } else {
    console.log("No recipes found.");
  }
}

main();
