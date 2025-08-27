import "react-native-gesture-handler";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ExpenseProvider } from "./context/ExpenseContext";
import HomeScreen from "./screens/HomeScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import SettingsScreen from "./screens/SettingScreen";
import AddMonobankScreen from "./screens/AddMonobankScreen";
import { CloudDownload, Settings, Upload } from "lucide-react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ExpenseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "Expenses",
              headerLeft: () => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AddMonobank")}
                    style={{ marginRight: 16 }}
                  >
                    <Text style={{ fontSize: 18, color: "white" }}>
                      <CloudDownload />
                    </Text>
                  </TouchableOpacity>
                );
              },

              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={{ marginRight: 16 }}
                >
                  <Text style={{ fontSize: 18 }}>
                    <Settings />
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ title: "Add Expense" }}
          />
          <Stack.Screen
            name="AddMonobank"
            component={AddMonobankScreen}
            options={{ title: "Add Monobank" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}
