export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
};

export interface AddExpenseForm {
  amount: string;
  category: string;
  description: string;
}