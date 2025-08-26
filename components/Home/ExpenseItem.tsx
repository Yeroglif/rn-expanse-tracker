import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Expense } from "../../types";
import { CATEGORIES } from "../../types";
import { X } from "lucide-react-native";

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onDelete,
  onCategoryChange,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(expense.category);

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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(expense.id, category);
    setPickerVisible(false);
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
          <Text style={styles.amount}>₴{expense.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => setPickerVisible((prev) => !prev)}
          >
            <Text style={styles.category}>{selectedCategory}</Text>
          </TouchableOpacity>

          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>

        {isPickerVisible && (
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => handleCategoryChange(itemValue)}
            style={styles.picker}
          >
            {CATEGORIES.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>
          <X color={"white"} strokeWidth={3} />
        </Text>
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
  picker: {
    marginTop: 4,
    width: 150,
    borderRadius: 100,
    color: "white",
    padding: 3,
    backgroundColor: "#007AFF",
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
