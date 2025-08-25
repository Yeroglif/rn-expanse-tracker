import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useExpenses } from "../context/ExpenseContext";

const ExpenseSummary: React.FC = () => {
  const { totalExpenses, expenses } = useExpenses();

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.label}>Total Expenses</Text>
        <Text style={styles.amount}>${totalExpenses.toFixed(2)}</Text>
      </View>
      <View style={styles.countCard}>
        <Text style={styles.countLabel}>Transactions</Text>
        <Text style={styles.count}>{expenses.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 2,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  countCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  count: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ExpenseSummary;
