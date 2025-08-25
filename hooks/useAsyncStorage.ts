import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Expense } from "../types";

const STORAGE_KEY = "expenses";

export const useAsyncStorage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const saveExpenses = async (expenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  };

  const loadExpenses = async (): Promise<Expense[]> => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const expenses = JSON.parse(stored);
        return expenses.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading expenses:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  return {
    isLoading,
    saveExpenses,
    loadExpenses,
    clearStorage,
  };
};
