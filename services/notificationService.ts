import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  }

  static async scheduleDailyReminder(hour: number = 20, minute: number = 0) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return false;

    // Cancel existing daily reminders
    await this.cancelDailyReminder();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💰 Daily Expense Check",
        body: "Don't forget to log today's expenses!",
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });

    return true;
  }

  static async cancelDailyReminder() {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const dailyReminders = scheduledNotifications.filter(
      (notification) => notification.content.data?.type === "daily_reminder"
    );

    for (const notification of dailyReminders) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  static async scheduleSpendingAlert(amount: number, category?: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    const title = category
      ? `High ${category} Spending!`
      : "High Spending Alert!";

    const body = `You've spent $${amount.toFixed(2)} ${
      category ? `on ${category}` : "today"
    }. Consider reviewing your budget.`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: "spending_alert", amount, category },
      },
      trigger: null,
    });
  }

  static async scheduleWeeklySummary() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    await this.cancelWeeklySummary();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📊 Weekly Expense Summary",
        body: "Check out your spending patterns from this week!",
        data: { type: "weekly_summary" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: 1,
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }

  static async cancelWeeklySummary() {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const weeklySummaries = scheduledNotifications.filter(
      (notification) => notification.content.data?.type === "weekly_summary"
    );

    for (const notification of weeklySummaries) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}
