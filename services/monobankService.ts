import { Expense } from "../types";

const mapMccToCategory = (mcc: number): string => {
  if ((mcc >= 5411 && mcc <= 5499) || (mcc >= 5812 && mcc <= 5814))
    return "Food";
  if (
    (mcc >= 4000 && mcc <= 4199) ||
    (mcc >= 4784 && mcc <= 4789) ||
    mcc === 4121
  )
    return "Transport";
  if ((mcc >= 7800 && mcc <= 7999) || (mcc >= 7832 && mcc <= 7999))
    return "Entertainment";
  if (
    (mcc >= 4900 && mcc <= 4999) ||
    (mcc >= 4812 && mcc <= 4814) ||
    mcc === 6012
  )
    return "Bills";
  if ((mcc >= 5000 && mcc <= 5999) || (mcc >= 5300 && mcc <= 5399))
    return "Shopping";
  if ((mcc >= 8011 && mcc <= 8099) || (mcc >= 8041 && mcc <= 8049))
    return "Health";
  return "Other";
};

export const fetchMonobankAccounts = async (token: string) => {
  const res = await fetch("https://api.monobank.ua/personal/client-info", {
    headers: { "X-Token": token },
  });
  if (!res.ok) throw new Error("Failed to fetch accounts");
  const data = await res.json();
  return data.accounts.filter((acc: any) => acc.type === "black");
};

export const fetchMonobankTransactions = async (
  token: string
): Promise<Expense[]> => {
  const now = Date.now();
  const threeMonthsAgo = now - 30 * 24 * 60 * 60 * 1000;

  const accounts = await fetchMonobankAccounts(token);
  if (accounts.length === 0)
    throw new Error("No card accounts found for this user");

  const accountId = accounts[0].id;

  const response = await fetch(
    `https://api.monobank.ua/personal/statement/${accountId}/${Math.floor(
      threeMonthsAgo / 1000
    )}/${Math.floor(now / 1000)}`,
    {
      method: "GET",
      headers: { "X-Token": token },
    }
  );

  if (!response.ok) throw new Error(`Monobank API error: ${response.status}`);

  const data = await response.json();

  return data
    .filter((tx: { amount: number }) => tx.amount < 0)
    .map(
      (tx: {
        id: { toString: () => any };
        amount: number;
        mcc: number;
        description: any;
        time: number;
      }) => ({
        id: tx.id.toString(),
        amount: Math.abs(tx.amount / 100),
        category: mapMccToCategory(tx.mcc),
        description: tx.description,
        date: new Date(tx.time * 1000),
      })
    );
};
