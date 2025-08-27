import * as Sharing from "expo-sharing";
import { printToFileAsync } from "expo-print";
import * as FileSystem from "expo-file-system";
import { Expense } from "../types";

export async function generateExpensePdf(expenses: Expense[]) {
  const html = buildExpenseHtml(expenses);
  const { uri } = await printToFileAsync({ html });
  return uri;
}

export async function shareFile(uri: string) {
  if (await Sharing.isAvailableAsync()) {
    try {
      await Sharing.shareAsync(uri);
    } finally {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (deleteError) {
        console.error("Error deleting the file:", deleteError);
      }
    }
  } else {
    throw new Error("Sharing not supported on this device");
  }
}

function buildExpenseHtml(expenses: Expense[]) {
  return `
    <html>
      <body>
        <h1>Expense Report</h1>
        <ul>
          ${expenses
            .map((e) => `<li>${e.date} – ${e.category} – ${e.amount} UAH</li>`)
            .join("")}
        </ul>
      </body>
    </html>
  `;
}
