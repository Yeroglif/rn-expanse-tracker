import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AddExpenseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <Text>Form coming next hour...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default AddExpenseScreen;
