import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Expances</Text>
      <Text style={styles.placeholder}>No expenses yet</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddExpense");
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  placeholder: {
    textAlign: "center",
    color: "#666",
    marginTop: 50,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default HomeScreen;
