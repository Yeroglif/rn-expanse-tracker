export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  photoUri?: string;
}

export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
};

export interface AddExpenseForm {
  amount: string;
  category: string;
  description: string;
  photoUri?: string;
}

export type FilterType = "all" | "category" | "date";

export interface ExpenseFilters {
  type: FilterType;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Other",
];
