import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useExpenses } from "../../context/ExpenseContext";

const DATE_PRESETS = [
  { label: "Today", days: 0 },
  { label: "This Week", days: 7 },
  { label: "This Month", days: 30 },
  { label: "Last 3 Months", days: 90 },
  { label: "This Year", days: 365 },
];

const ExpenseTimeFilter: React.FC = ({}) => {
  const { filters, setFilters } = useExpenses();
  const getDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();

    if (days === 0) {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(end.getDate() - days);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }
    return { start, end };
  };
  const handleDatePreset = (days: number) => {
    const dateRange = getDatePreset(days);
    setFilters({
      ...filters,
      type: "date",
      dateRange,
    });
  };
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Time Period</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {DATE_PRESETS.map((preset) => {
          const isSelected =
            filters.type !== "all" &&
            getDatePreset(preset.days).start.getTime() ===
              filters.dateRange?.start.getTime();
          return (
            <TouchableOpacity
              key={preset.label}
              style={[
                styles.filterButton,
                styles.dateButton,
                isSelected ? styles.selectedFilter : undefined,
              ]}
              onPress={() => handleDatePreset(preset.days)}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected ? styles.selectedFilterText : undefined,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
  },
  selectedFilterText: {
    color: "white",
  },
  dateButton: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 1,
  },
});

export default ExpenseTimeFilter;
