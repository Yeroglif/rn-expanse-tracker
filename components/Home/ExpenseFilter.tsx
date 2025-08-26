import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { CATEGORIES } from "../../types";
import ExpenseTimeFilter from "./ExpenseTimeFilter";
import { useExpenses } from "../../context/ExpenseContext";

const FilterCategories = ["All", ...CATEGORIES];

const ExpenseFilter: React.FC = ({}) => {
  const { filters, setFilters } = useExpenses();
  const handleCategoryChange = (category: string) => {
    setFilters({
      ...filters,
      category: category === "All" ? undefined : category,
    });
  };

  const handleSearchChange = (text: string) => {
    setFilters({
      ...filters,
      searchText: text || undefined,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      category: undefined,
      searchText: undefined,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const hasActiveFilters =
    filters.category || filters.dateRange || filters.searchText;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          value={filters.searchText || ""}
          onChangeText={handleSearchChange}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
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
                (filters.category === category ||
                  (category === "All" && !filters.category)) &&
                  styles.selectedFilter,
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  (filters.category === category ||
                    (category === "All" && !filters.category)) &&
                    styles.selectedFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ExpenseTimeFilter />

      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <View style={styles.activeFiltersRow}>
            {filters.category && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  Category: {filters.category}
                </Text>
              </View>
            )}
            {filters.dateRange && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {formatDate(filters.dateRange.start)} -{" "}
                  {formatDate(filters.dateRange.end)}
                </Text>
              </View>
            )}
            {filters.searchText && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  Search: "{filters.searchText}"
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
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
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  activeFiltersTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  activeFilterChip: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeFilterText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  clearFiltersButton: {
    backgroundColor: "#ff4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearFiltersText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ExpenseFilter;
