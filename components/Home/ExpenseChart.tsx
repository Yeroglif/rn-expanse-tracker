import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
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
  const { expenses } = useExpenses();

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

  const chartData =
    data.length > 0
      ? data
      : [
          {
            value: 1,
            color: "#eee",
            text: "No data",
          },
        ];

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        donut
        showText
        textColor="black"
        textSize={12}
        radius={120}
        innerRadius={0}
        focusOnPress
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
            <Text>
              {item.text}: {item.value.toFixed(2)}
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
