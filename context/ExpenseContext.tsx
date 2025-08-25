import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Expense } from "../types";

interface ExpenseState {
  expenses: Expense[];
  totalExpenses: number;
}

type ExpenseAction =
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "SET_EXPENSES"; payload: Expense[] };

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setExpenses: (expenses: Expense[]) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const expenseReducer = (
  state: ExpenseState,
  action: ExpenseAction
): ExpenseState => {
  switch (action.type) {
    case "ADD_EXPENSE":
      const newExpenses = [...state.expenses, action.payload];
      return {
        expenses: newExpenses,
        totalExpenses: newExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ),
      };

    case "DELETE_EXPENSE":
      const filteredExpenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
      return {
        expenses: filteredExpenses,
        totalExpenses: filteredExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ),
      };

    case "SET_EXPENSES":
      return {
        expenses: action.payload,
        totalExpenses: action.payload.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ),
      };

    default:
      return state;
  }
};

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    totalExpenses: 0,
  });

  const addExpense = (expense: Expense) => {
    dispatch({ type: "ADD_EXPENSE", payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  const setExpenses = (expenses: Expense[]) => {
    dispatch({ type: "SET_EXPENSES", payload: expenses });
  };

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        addExpense,
        deleteExpense,
        setExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
