import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, CheckCircle, ShoppingBasket, Plus, Utensils, Check, X, ChefHat, Camera } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { usePlan } from "../context/PlanContext";
import { useFavorites } from "../context/FavoritesContext";
import { useHistory } from "../context/HistoryContext";
import { Recipe } from "../types";
import { api } from "../api/client";

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">("ingredients");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const { addToPlan, removeFromPlan, isInPlan } = usePlan();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // 从 API 加载菜谱详情
  useEffect(() => {
    if (!id) return;
    api.get<Recipe>(`/recipes/${id}`)
      .then((data) => {
        setRecipe(data);
        addToHistory(data);
      })
      .catch((err) => console.error("Failed to load recipe:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex items-center justify-center">
        <p className="text-zinc-400 font-bold">菜谱未找到</p>
      </div>
    );
  }

  const isPlanned = isInPlan(recipe.id);
  const favorited = isFavorite(recipe.id);

  const handleCookingComplete = () => {
    setShowCompletionModal(true);
  };

  const confirmCompletion = () => {
    removeFromPlan(recipe.id);
    setShowCompletionModal(false);
    setUploadedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative shadow-2xl animate-in fade-in duration-500">
      <header className="fixed top-0 w-full max-w-md z-50 bg-white/70 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => toggleFavorite(recipe)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90",
            favorited ? "text-red-500 bg-red-50" : "text-zinc-900 hover:bg-zinc-100"
          )}
        >
          <Heart size={24} fill={favorited ? "currentColor" : "none"} />
        </button>
      </header>

      <main className="px-6 pt-24 pb-48">
        <section className="mb-8">
          <div className="aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden bg-zinc-100 editorial-shadow">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        <section className="mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-2">
            {recipe.name}
          </h1>
          <p className="text-zinc-500 text-base">
            {recipe.description}
          </p>
        </section>

        <section className="flex flex-wrap gap-2 mb-8">
          <span className="px-4 py-1.5 bg-black text-white text-[11px] font-bold rounded-full">
            {recipe.tags[0]}
          </span>
          <span className="px-4 py-1.5 bg-zinc-50 text-zinc-500 text-[11px] font-bold rounded-full border border-zinc-100">
            {recipe.time}
          </span>
          <span className="px-4 py-1.5 bg-zinc-50 text-zinc-500 text-[11px] font-bold rounded-full border border-zinc-100">
            {recipe.difficulty}
          </span>
          <span className="px-4 py-1.5 bg-zinc-50 text-zinc-500 text-[11px] font-bold rounded-full border border-zinc-100">
            约 {recipe.calories}
          </span>
        </section>

        <section className="mb-10">
          <div className="bg-[#F7FBF9] p-6 rounded-3xl border border-[#E8F3ED]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Sparkles className="text-[#4CAF50]" size={16} />
              </div>
              <p className="text-zinc-700 leading-relaxed text-sm">
                <span className="font-bold text-zinc-900">推荐理由：</span>{recipe.recommendationReason}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-end gap-8 mb-6">
            <button
              onClick={() => setActiveTab("ingredients")}
              className={cn(
                "pb-2 text-xl font-bold transition-all relative",
                activeTab === "ingredients" ? "text-zinc-900" : "text-zinc-300 hover:text-zinc-400"
              )}
            >
              食材清单
              {activeTab === "ingredients" && (
                <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-1 bg-black rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("steps")}
              className={cn(
                "pb-2 text-xl font-bold transition-all relative",
                activeTab === "steps" ? "text-zinc-900" : "text-zinc-300 hover:text-zinc-400"
              )}
            >
              做法步骤
              {activeTab === "steps" && (
                <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-1 bg-black rounded-full" />
              )}
            </button>
          </div>

          {activeTab === "ingredients" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50/50 p-5 rounded-[2rem] border border-zinc-100">
                <h3 className="text-[10px] font-bold text-zinc-400 mb-4 tracking-widest flex items-center gap-2 uppercase">
                  <CheckCircle size={12} className="text-zinc-300" />
                  你已有
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.have.map((ing, i) => (
                    <li key={i} className="flex flex-col gap-0.5">
                      <span className="text-zinc-900 font-bold text-sm">{ing.name}</span>
                      <span className="text-zinc-400 text-[10px]">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-50/50 p-5 rounded-[2rem] border border-zinc-100">
                <h3 className="text-[10px] font-bold text-zinc-400 mb-4 tracking-widest flex items-center gap-2 uppercase">
                  <ShoppingBasket size={12} className="text-zinc-300" />
                  你还缺
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.missing.map((ing, i) => (
                    <li key={i} className="flex flex-col gap-0.5">
                      <span className="text-zinc-900 font-bold text-sm">{ing.name}</span>
                      <span className="text-zinc-400 text-[10px]">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {(recipe.steps && recipe.steps.length > 0 ? recipe.steps : ['大火快炒，锁住食材水分，保持口感。', '加入调料翻炒均匀。', '出锅装盘即可。']).map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (isPlanned) {
                  removeFromPlan(recipe.id);
                } else {
                  addToPlan(recipe);
                }
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all active:scale-95 border-2 shadow-xl",
                isPlanned 
                  ? "bg-zinc-50 border-zinc-200 text-zinc-400" 
                  : "bg-white border-black text-black"
              )}
            >
              {isPlanned ? <Check size={18} /> : <Plus size={18} />}
              <span>{isPlanned ? "已在菜单" : "加入菜单"}</span>
            </button>
            <button 
              onClick={handleCookingComplete}
              className="flex-[1.5] flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-bold text-base hover:scale-[0.98] transition-transform active:scale-95 shadow-2xl"
            >
              <Utensils size={18} />
              <span>开始烹饪</span>
            </button>
          </div>
        </section>
      </main>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompletionModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-8 overflow-hidden"
            >
              <button 
                onClick={() => setShowCompletionModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#F7FBF9] rounded-full flex items-center justify-center mx-auto border border-[#E8F3ED]">
                  <ChefHat className="text-[#4CAF50]" size={40} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">用餐完成！</h2>
                  <p className="text-zinc-500 text-sm">恭喜你又完成了一次美味的烹饪</p>
                </div>
              </div>

              <div className="bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100">
                <h3 className="text-[10px] font-bold text-zinc-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={4} />
                  </div>
                  已消耗食材
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...recipe.ingredients.have, ...recipe.ingredients.missing].map((ing, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-zinc-100 rounded-full text-[11px] font-medium text-zinc-600 shadow-sm">
                      {ing.name} <span className="text-zinc-400 ml-0.5">{ing.amount}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900">上传成果</h3>
                <div 
                  className="aspect-video w-full rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-300 transition-colors overflow-hidden relative"
                  onClick={() => {
                    setUploadedPhoto(`https://picsum.photos/seed/${recipe.id}/800/600`);
                  }}
                >
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} className="w-full h-full object-cover" alt="Result" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Camera className="text-zinc-400" size={24} />
                      </div>
                      <span className="text-xs font-bold text-zinc-400">点击拍照或上传</span>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={confirmCompletion}
                className="w-full bg-black text-white py-5 rounded-full font-bold text-lg shadow-xl active:scale-95 transition-all"
              >
                确认并完成
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
