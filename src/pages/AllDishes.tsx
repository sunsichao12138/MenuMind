import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, Clock, Package } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { usePlan } from "../context/PlanContext";
import { Recipe } from "../types";
import { api } from "../api/client";

export default function AllDishes() {
  const navigate = useNavigate();
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Recipe[]>("/recipes")
      .then((data) => {
        // 过滤掉 AI 生成的临时菜谱，只保留种子菜谱
        const seedRecipes = data.filter((r) => !r.id.startsWith("ai_"));
        setRecipes(seedRecipes);
      })
      .catch((err) => console.error("Failed to load recipes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface max-w-md mx-auto flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // 分成两列实现瀑布流
  const col1: Recipe[] = [];
  const col2: Recipe[] = [];
  recipes.forEach((r, i) => {
    if (i % 2 === 0) col1.push(r);
    else col2.push(r);
  });

  const RecipeCard = ({ recipe, index }: { recipe: Recipe; index: number }) => {
    const planned = isInPlan(recipe.id);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.03 } }}
        className="rounded-2xl overflow-hidden bg-white border border-zinc-100 shadow-sm mb-3"
      >
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-3">
            <h4 className="text-sm font-bold text-zinc-900 truncate mb-1">{recipe.name}</h4>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
              <span className="flex items-center gap-0.5">
                <Clock size={10} /> {recipe.time}
              </span>
              {recipe.inventoryMatch !== undefined && recipe.inventoryMatch !== null && recipe.inventoryMatch > 0 && (
                <span className="flex items-center gap-0.5 text-emerald-500">
                  <Package size={10} /> {recipe.inventoryMatch}种库存
                </span>
              )}
            </div>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {recipe.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-zinc-50 text-[9px] text-zinc-500 rounded-full border border-zinc-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-3 pb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (planned) {
                removeFromPlan(recipe.id);
              } else {
                addToPlan(recipe);
              }
            }}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95",
              planned
                ? "bg-zinc-100 text-zinc-400 border border-zinc-200"
                : "bg-black text-white"
            )}
          >
            {planned ? <Check size={14} /> : <Plus size={14} />}
            {planned ? "已加入计划" : "加入计划"}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-surface max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">全部菜品</h1>
        <span className="text-xs text-zinc-400 font-medium ml-auto">{recipes.length} 道菜</span>
      </header>

      <div className="px-4 pb-12">
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col">
            {col1.map((recipe, i) => (
              <div key={recipe.id}><RecipeCard recipe={recipe} index={i * 2} /></div>
            ))}
          </div>
          <div className="flex-1 flex flex-col">
            {col2.map((recipe, i) => (
              <div key={recipe.id}><RecipeCard recipe={recipe} index={i * 2 + 1} /></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
