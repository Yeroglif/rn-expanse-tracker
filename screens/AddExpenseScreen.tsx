import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { useAddExpenseForm } from "../hooks/useAddExpenseForm";
import { useExpenses } from "../context/ExpenseContext";
import FormInput from "../components/AddExpense/FormInput";
import CategoryPicker from "../components/AddExpense/CategoryPicker";
import type { Expense } from "../types";
import PhotoPicker from "../components/AddExpense/PhotoPicker";

interface AddExpenseScreenProps {
  navigation: any;
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ navigation }) => {
  const { form, errors, updateField, validateForm, resetForm } =
    useAddExpenseForm();
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const { addExpense } = useExpenses();

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      date: new Date(),
      photoUri,
    };

    addExpense(newExpense);

    Alert.alert("Success", "Expense added successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);

    resetForm();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <FormInput
          label="Amount"
          value={form.amount}
          onChangeText={(text) => updateField("amount", text)}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.amount}
        />

        <CategoryPicker
          selectedCategory={form.category}
          onSelectCategory={(category) => updateField("category", category)}
          error={errors.category}
        />

        <FormInput
          label="Description"
          value={form.description}
          onChangeText={(text) => updateField("description", text)}
          placeholder="What did you spend on?"
          error={errors.description}
        />

        <PhotoPicker
          photoUri={photoUri}
          onPhotoSelected={(uri) => setPhotoUri(uri)}
          onPhotoRemoved={() => setPhotoUri(undefined)}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddExpenseScreen;
