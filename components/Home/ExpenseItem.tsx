import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Expense } from "../../types";

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(expense.id),
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {expense.photoUri && (
        <Image source={{ uri: expense.photoUri }} style={styles.photo} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{expense.category}</Text>
          </View>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    paddingStart: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 16,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  category: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ExpenseItem;
