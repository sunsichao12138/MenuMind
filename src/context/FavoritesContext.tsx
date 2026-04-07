import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe } from "../types";
import { api } from "../api/client";

interface FavoritesContextType {
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipe: Recipe) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 API 加载收藏列表
  useEffect(() => {
    api.get<Recipe[]>("/favorites")
      .then(setFavorites)
      .catch((err) => console.error("Failed to load favorites:", err))
      .finally(() => setLoading(false));
  }, []);

  const addToFavorites = useCallback((recipe: Recipe) => {
    setFavorites((prev) => {
      if (prev.find((r) => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
    api.post("/favorites", { recipeId: recipe.id }).catch((err) => {
      console.error("Failed to add favorite:", err);
      // 回滚
      setFavorites((prev) => prev.filter((r) => r.id !== recipe.id));
    });
  }, []);

  const removeFromFavorites = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const removed = prev.find((r) => r.id === recipeId);
      const next = prev.filter((r) => r.id !== recipeId);
      api.delete(`/favorites/${recipeId}`).catch((err) => {
        console.error("Failed to remove favorite:", err);
        if (removed) setFavorites((p) => [...p, removed]);
      });
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (recipeId: string) => favorites.some((r) => r.id === recipeId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (recipe: Recipe) => {
      if (isFavorite(recipe.id)) {
        removeFromFavorites(recipe.id);
      } else {
        addToFavorites(recipe);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
