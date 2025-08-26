import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SetStateAction, useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FF6384",
  Transport: "#36A2EB",
  Entertainment: "#FFCE56",
  Bills: "#4BC0C0",
  Shopping: "#9966FF",
  Health: "#FF9F40",
  Other: "#C9CBCF",
};

const ExpenseChart: React.FC = () => {
  const { expenses, totalExpenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    value: amount,
    color: CATEGORY_COLORS[category] || "#ccc",
    text: category,
  }));

  const chartData = data.map((item) => ({
    value: item.value,
    color: item.color,
    text: item.text,
    shiftX: selectedCategory === item.text ? 2 : 0,
    shiftY: selectedCategory === item.text ? 8 : 0,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        semiCircle
        textColor="black"
        textSize={12}
        radius={190}
        innerRadius={0}
        onPress={(item: any) => {
          if (item?.text) {
            setSelectedCategory((prev) =>
              prev === item.text ? null : item.text
            );
          }
        }}
      />

      <View style={{ marginTop: 20 }}>
        {data.map((item) => (
          <View
            key={item.text}
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                textDecorationLine:
                  selectedCategory === item.text ? "underline" : "none",
              }}
            >
              {item.text}: {item.value.toFixed(2)} (
              {((item.value / totalExpenses) * 100).toFixed(2)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ExpenseChart;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 20,
  },
});
