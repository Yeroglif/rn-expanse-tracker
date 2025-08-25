import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import type { Expense } from "../types";
import { NotificationService } from "../services/notificationService";

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  totalExpenses: number;
  selectedCategory: string;
  isLoading: boolean;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  clearStorage: () => void;
  setFilter: (category: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { isLoading, saveExpenses, loadExpenses } = useAsyncStorage();

  useEffect(() => {
    const initializeData = async () => {
      const loadedExpenses = await loadExpenses();
      setExpenses(loadedExpenses);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => {
      const newExpenses = [...prev, expense];

      const today = new Date().toDateString();
      const todayExpenses = newExpenses.filter(
        (e) => new Date(e.date).toDateString() === today
      );
      const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

      if (todayTotal > 100) {
        NotificationService.scheduleSpendingAlert(todayTotal);
      }

      return newExpenses;
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const clearStorage = () => {
    setExpenses([]);
  };

  const setFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const value: ExpenseContextType = {
    expenses,
    filteredExpenses,
    totalExpenses,
    selectedCategory,
    isLoading,
    addExpense,
    deleteExpense,
    clearStorage,
    setFilter,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
