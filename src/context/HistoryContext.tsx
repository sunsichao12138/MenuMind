import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe } from "../types";
import { api } from "../api/client";

interface HistoryContextType {
  history: Recipe[];
  addToHistory: (recipe: Recipe) => void;
  clearHistory: () => void;
  loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 API 加载历史
  useEffect(() => {
    api.get<Recipe[]>("/history")
      .then(setHistory)
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, []);

  const addToHistory = useCallback((recipe: Recipe) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 20);
    });
    api.post("/history", { recipeId: recipe.id }).catch((err) => {
      console.error("Failed to record history:", err);
    });
  }, []);

  const clearHistory = useCallback(() => {
    const backup = [...history];
    setHistory([]);
    api.delete("/history").catch((err) => {
      console.error("Failed to clear history:", err);
      setHistory(backup);
    });
  }, [history]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, loading }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
