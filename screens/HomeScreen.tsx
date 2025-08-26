import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import ExpenseSummary from "../components/Home/ExpenseSummary";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseChart from "../components/Home/ExpenseChart";
import ExpenseItem from "../components/Home/ExpenseItem";
import { Plus } from "lucide-react-native";
import ExpenseFilter from "../components/Home/ExpenseFilter";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { filteredExpenses, deleteExpense, updateExpenseCategory } =
    useExpenses();

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onDelete={deleteExpense}
            onCategoryChange={updateExpenseCategory}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={{ marginBottom: 30 }}>
              <ExpenseSummary />
            </View>
            <ExpenseChart />
            <View style={{ marginTop: 30 }}>
              <ExpenseFilter />
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.monoButton}
        onPress={() => navigation.navigate("AddMonobank")}
      >
        <Text style={styles.monoButtonText}>Mono</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddExpense")}
      >
        <Plus color={"white"} strokeWidth={3} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  monoButton: {
    position: "absolute",
    bottom: 45,
    left: 30,
    backgroundColor: "#000000",
    width: 100,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  monoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 45,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;
