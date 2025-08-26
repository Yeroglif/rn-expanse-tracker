import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CATEGORIES } from "../../types";

const FilterCategories = ["All", ...CATEGORIES];

interface ExpenseFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {FilterCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.selectedFilter,
            ]}
            onPress={() => onCategoryChange(category)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category && styles.selectedFilterText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
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
});

export default ExpenseFilter;
