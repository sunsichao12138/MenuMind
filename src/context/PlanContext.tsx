import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe } from "../types";
import { api } from "../api/client";

interface PlanContextType {
  plannedRecipes: Recipe[];
  addToPlan: (recipe: Recipe) => void;
  removeFromPlan: (recipeId: string) => void;
  isInPlan: (recipeId: string) => boolean;
  loading: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plannedRecipes, setPlannedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 API 加载计划
  useEffect(() => {
    api.get<Recipe[]>("/plans")
      .then(setPlannedRecipes)
      .catch((err) => console.error("Failed to load plans:", err))
      .finally(() => setLoading(false));
  }, []);

  const addToPlan = useCallback((recipe: Recipe) => {
    setPlannedRecipes((prev) => {
      if (prev.some((r) => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
    api.post("/plans", { recipeId: recipe.id }).catch((err) => {
      console.error("Failed to add to plan:", err);
      setPlannedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    });
  }, []);

  const removeFromPlan = useCallback((recipeId: string) => {
    setPlannedRecipes((prev) => {
      const removed = prev.find((r) => r.id === recipeId);
      const next = prev.filter((r) => r.id !== recipeId);
      api.delete(`/plans/${recipeId}`).catch((err) => {
        console.error("Failed to remove from plan:", err);
        if (removed) setPlannedRecipes((p) => [...p, removed]);
      });
      return next;
    });
  }, []);

  const isInPlan = useCallback(
    (recipeId: string) => plannedRecipes.some((r) => r.id === recipeId),
    [plannedRecipes]
  );

  return (
    <PlanContext.Provider value={{ plannedRecipes, addToPlan, removeFromPlan, isInPlan, loading }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
