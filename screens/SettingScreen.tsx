import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { NotificationService } from "../services/notificationService";
import { useExpenses } from "../context/ExpenseContext";

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [dailyReminders, setDailyReminders] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [spendingAlerts, setSpendingAlerts] = useState(false);
  const { clearStorage } = useExpenses();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const notifications = await NotificationService.getScheduledNotifications();
    setDailyReminders(
      notifications.some((n) => n.content.data?.type === "daily_reminder")
    );
    setWeeklyReports(
      notifications.some((n) => n.content.data?.type === "weekly_summary")
    );
  };

  const handleDailyReminders = async (enabled: boolean) => {
    if (enabled) {
      const success = await NotificationService.scheduleDailyReminder(20, 0);
      if (success) {
        setDailyReminders(true);
        Alert.alert("Enabled", "Daily reminders set for 8:00 PM");
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable notifications in Settings"
        );
      }
    } else {
      await NotificationService.cancelDailyReminder();
      setDailyReminders(false);
      Alert.alert("Disabled", "Daily reminders turned off");
    }
  };

  const handleWeeklyReports = async (enabled: boolean) => {
    if (enabled) {
      await NotificationService.scheduleWeeklySummary();
      setWeeklyReports(true);
      Alert.alert("Enabled", "Weekly reports set for Monday 9:00 AM");
    } else {
      await NotificationService.cancelWeeklySummary();
      setWeeklyReports(false);
      Alert.alert("Disabled", "Weekly reports turned off");
    }
  };

  const handleSpendingAlerts = (enabled: boolean) => {
    setSpendingAlerts(enabled);
    if (enabled) {
      Alert.alert("Enabled", "You'll get alerts for high spending days");
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your expenses permanently. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            await clearStorage();
            Alert.alert("Cleared", "All data has been deleted");
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Daily Reminders</Text>
            <Text style={styles.settingDescription}>
              Get reminded to log expenses at 8 PM
            </Text>
          </View>
          <Switch value={dailyReminders} onValueChange={handleDailyReminders} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Weekly Reports</Text>
            <Text style={styles.settingDescription}>
              Get spending summaries every Monday
            </Text>
          </View>
          <Switch value={weeklyReports} onValueChange={handleWeeklyReports} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Spending Alerts</Text>
            <Text style={styles.settingDescription}>
              Get notified for high spending days
            </Text>
          </View>
          <Switch value={spendingAlerts} onValueChange={handleSpendingAlerts} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Text style={styles.dangerButtonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    marginTop: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  testButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#ff4444",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
