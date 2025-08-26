import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from "react-native";
import FormInput from "../components/AddExpense/FormInput";
import { useState } from "react";
import { Expense } from "../types";
import { fetchMonobankTransactions } from "../services/monobankService";
import { useExpenses } from "../context/ExpenseContext";

interface AddMonobankScreenProps {
  navigation: any;
}

const AddMonobankScreen: React.FC<AddMonobankScreenProps> = ({
  navigation,
}) => {
  const [monoToken, setMonoToken] = useState<string>("");
  const { addExpense } = useExpenses();

  const handleSubmit = async () => {
    const newExpenses: Expense[] = await fetchMonobankTransactions(monoToken);
    newExpenses.map((expense) => {
      addExpense(expense);
    });

    Alert.alert("Success", "Expense added successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <FormInput
          label="Mono token"
          value={monoToken}
          onChangeText={(text) => setMonoToken(text)}
          placeholder="xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxx"
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.helpText}>
        Don't have a token?{" "}
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL("https://api.monobank.ua/")}
        >
          Activate it here
        </Text>
      </Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Mono Expenses</Text>
      </TouchableOpacity>
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
  helpText: {
    fontSize: 14,
    paddingHorizontal: 20,
    color: "#666",
    marginBottom: 20,
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
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

export default AddMonobankScreen;
