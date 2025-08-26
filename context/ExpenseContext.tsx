import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import type { Expense, ExpenseFilters } from "../types";
import { NotificationService } from "../services/notificationService";

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  totalExpenses: number;
  filters: ExpenseFilters;
  isLoading: boolean;
  addExpense: (expense: Expense) => void;
  addExpenses: (expenses: Expense[]) => void;
  deleteExpense: (id: string) => void;
  clearStorage: () => void;
  setFilters: (filters: ExpenseFilters) => void;
  updateExpenseCategory: (id: string, category: string) => void;
  selectedCategory: string;
  setFilter: (category: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    type: "all",
  });

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

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    if (filters.category) {
      filtered = filtered.filter(
        (expense) => expense.category === filters.category
      );
    }
    if (filters.dateRange) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= filters.dateRange!.start &&
          expenseDate <= filters.dateRange!.end
        );
      });
    }
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
      );
    }
    if (filters.amountRange) {
      filtered = filtered.filter(
        (expense) =>
          expense.amount >= filters.amountRange!.min &&
          expense.amount <= filters.amountRange!.max
      );
    }
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filtered;
  }, [expenses, filters]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
    setExpenses((prev) => {
      const newExpenses = prev.filter((expense) => expense.id !== id);
      currentExpensesIds.current.delete(id);
      return newExpenses;
    });
  };

  const clearStorage = () => {
    setExpenses([]);
    currentExpensesIds.current = new Set();
    clearAsyncStorage();
  };

  const setFiltersHandler = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  const updateExpenseCategory = (id: string, category: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, category } : expense
      )
    );
  };

  const selectedCategory = filters.category || "All";

  const setFilter = (category: string) => {
    setFilters({
      type: category === "All" ? "all" : "category",
      category: category === "All" ? undefined : category,
    });
  };

  const value: ExpenseContextType = {
    expenses,
    filteredExpenses,
    totalExpenses,
    filters,
    isLoading,
    addExpense,
    addExpenses,
    deleteExpense,
    clearStorage,
    setFilters: setFiltersHandler,
    updateExpenseCategory,
    selectedCategory,
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
