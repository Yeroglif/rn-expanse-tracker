import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
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
  addExpenses: (expenses: Expense[]) => void;
  deleteExpense: (id: string) => void;
  clearStorage: () => void;
  setFilter: (category: string) => void;
  updateExpenseCategory: (id: string, category: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const {
    isLoading,
    saveExpenses,
    loadExpenses,
    clearStorage: clearAsyncStorage,
  } = useAsyncStorage();
  const currentExpensesIds = useRef(new Set(expenses.map((e) => e.id)));

  useEffect(() => {
    const initializeData = async () => {
      const loadedExpenses = await loadExpenses();
      setExpenses(loadedExpenses);
      currentExpensesIds.current = new Set(loadedExpenses.map((e) => e.id));
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    if (currentExpensesIds.current.has(expense.id)) return;
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
    currentExpensesIds.current.add(expense.id);
  };

  const addExpenses = (expensesToAdd: Expense[]) => {
    const uniqueExpenses = expensesToAdd.filter(
      (e) => !currentExpensesIds.current.has(e.id)
    );
    if (uniqueExpenses.length === 0) return;

    setExpenses((prev) => {
      const newExpenses = [...prev, ...uniqueExpenses];

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

    uniqueExpenses.forEach((e) => currentExpensesIds.current.add(e.id));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const clearStorage = () => {
    setExpenses([]);
    currentExpensesIds.current = new Set();
    clearAsyncStorage();
  };

  const setFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const updateExpenseCategory = (id: string, category: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, category } : expense
      )
    );
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
    addExpenses,
    deleteExpense,
    clearStorage,
    setFilter,
    updateExpenseCategory,
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
