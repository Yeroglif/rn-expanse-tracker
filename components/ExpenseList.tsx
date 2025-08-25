import React from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import ExpenseItem from "./ExpenseItem";
import { useExpenses } from "../context/ExpenseContext";
import type { Expense } from "../types";

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();

  const renderExpense = ({ item }: { item: Expense }) => (
    <ExpenseItem expense={item} onDelete={deleteExpense} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No expenses yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to add your first expense
      </Text>
    </View>
  );

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpense}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default ExpenseList;
