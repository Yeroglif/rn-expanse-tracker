import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import type { Expense } from "../types";

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  totalExpenses: number;
  selectedCategory: string;
  isLoading: boolean;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
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
    setExpenses((prev) => [...prev, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
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
