import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Sparkles, Clock, Plus, Check, Trash2, Circle, CheckCircle2, Utensils, Camera, X, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePlan } from "../context/PlanContext";
import { cn } from "../lib/utils";
import { Recipe } from "../types";
import { api } from "../api/client";

export default function Plan() {
  const navigate = useNavigate();
  const { plannedRecipes, removeFromPlan, addToPlan, isInPlan } = usePlan();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string>>({});
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);

  // 从 API 加载推荐菜谱
  useEffect(() => {
    api.get<Recipe[]>("/recipes")
      .then(setSuggestedRecipes)
      .catch((err) => console.error("Failed to load recipes:", err));
  }, []);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === plannedRecipes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(plannedRecipes.map(r => r.id));
    }
  };

  const handleCookingComplete = () => {
    setShowCompletionModal(true);
  };

  const confirmCompletion = () => {
    selectedIds.forEach(id => removeFromPlan(id));
    setSelectedIds([]);
    setShowCompletionModal(false);
    setUploadedPhotos({});
  };

  const selectedRecipes = plannedRecipes.filter(r => selectedIds.includes(r.id));
  const consumedIngredients = selectedRecipes.flatMap(r => 
    [...r.ingredients.have, ...r.ingredients.missing]
  );

  return (
    <div className="px-6 py-12 space-y-8 animate-in fade-in duration-500 pb-32">
      <section className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">今日计划</h1>
        {plannedRecipes.length > 0 && (
          <button 
            onClick={toggleSelectAll}
            className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2"
          >
            {selectedIds.length === plannedRecipes.length ? "取消全选" : "全选所有"}
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              selectedIds.length === plannedRecipes.length ? "bg-black border-black text-white" : "border-zinc-300"
            )}>
              {selectedIds.length === plannedRecipes.length ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
              )}
            </div>
          </button>
        )}
      </section>

      {plannedRecipes.length > 0 ? (
        <section className="space-y-4">
          <AnimatePresence mode="popLayout">
            {plannedRecipes.map((recipe) => (
              <motion.article
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className={cn(
                  "p-3 bg-white border rounded-3xl shadow-sm flex items-center gap-4 cursor-pointer transition-all editorial-shadow relative group",
                  selectedIds.includes(recipe.id) ? "border-black ring-1 ring-black" : "border-zinc-100"
                )}
              >
                <div 
                  onClick={(e) => toggleSelect(recipe.id, e)}
                  className="flex-shrink-0"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedIds.includes(recipe.id) ? "bg-black border-black text-white" : "border-zinc-200"
                  )}>
                    {selectedIds.includes(recipe.id) && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div className="w-20 h-20 flex-shrink-0 bg-zinc-50 rounded-2xl overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col mb-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-bold text-zinc-900 truncate">{recipe.name}</h5>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-tight line-clamp-1">{recipe.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-[10px] text-zinc-400 font-medium">
                      <Clock size={12} className="mr-1" />
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlan(recipe.id);
                  }}
                  className="flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 w-8 h-8 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
              <Calendar size={40} className="text-zinc-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">计划表空空如也</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                您还没有选择任何菜品，去首页看看 AI 为您推荐了什么？
              </p>
            </div>
            <button 
              onClick={() => navigate("/filters")}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              <Sparkles size={18} />
              <span>去发现美味</span>
            </button>
          </div>
        </section>
      )}

      <section className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg">猜你喜欢</h4>
          <button 
            onClick={() => navigate("/")}
            className="text-zinc-400 text-xs font-bold flex items-center gap-1"
          >
            查看更多 <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {suggestedRecipes.slice(0, 6).map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-3xl p-3 border border-zinc-100 shadow-sm cursor-pointer group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-grow">
                  <h5 className="font-bold text-sm truncate">{recipe.name}</h5>
                  <span className="text-[10px] text-zinc-400">{recipe.time}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isInPlan(recipe.id)) {
                      removeFromPlan(recipe.id);
                    } else {
                      addToPlan(recipe);
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 flex-shrink-0 ${
                    isInPlan(recipe.id) ? "bg-zinc-100 text-zinc-400" : "bg-black text-white"
                  }`}
                >
                  {isInPlan(recipe.id) ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 固定底部按钮 - 始终显示 */}
      {plannedRecipes.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
          <button 
            onClick={handleCookingComplete}
            disabled={selectedIds.length === 0}
            className={cn(
              "w-full py-5 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-3 transition-all",
              selectedIds.length > 0
                ? "bg-black text-white active:scale-95"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            )}
          >
            <Utensils size={20} />
            <span>开始烹饪{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}</span>
          </button>
        </div>
      )}

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
                  {consumedIngredients.slice(0, 12).map((ing, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-zinc-100 rounded-full text-[11px] font-medium text-zinc-600 shadow-sm">
                      {ing.name} <span className="text-zinc-400 ml-0.5">{ing.amount}</span>
                    </span>
                  ))}
                  {consumedIngredients.length > 12 && (
                    <span className="px-3 py-1.5 bg-white border border-zinc-100 rounded-full text-[11px] font-medium text-zinc-400 shadow-sm">
                      +{consumedIngredients.length - 12}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <h3 className="text-sm font-bold text-zinc-900 sticky top-0 bg-white py-1">上传成果</h3>
                {selectedRecipes.map((recipe) => (
                  <div key={recipe.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-xs font-bold text-zinc-700 truncate">{recipe.name}</span>
                    </div>
                    <div 
                      className="aspect-video w-full rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-300 transition-colors overflow-hidden relative"
                      onClick={() => {
                        setUploadedPhotos(prev => ({
                          ...prev,
                          [recipe.id]: `https://picsum.photos/seed/${recipe.id}/800/600`
                        }));
                      }}
                    >
                      {uploadedPhotos[recipe.id] ? (
                        <img src={uploadedPhotos[recipe.id]} className="w-full h-full object-cover" alt="Result" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Camera className="text-zinc-400" size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">点击拍照或上传</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
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
