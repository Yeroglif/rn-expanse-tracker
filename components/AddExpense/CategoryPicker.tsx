import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CATEGORIES } from "../../types";

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  error?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  scrollView: {
    flexGrow: 0,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "white",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
  },
});

export default CategoryPicker;
