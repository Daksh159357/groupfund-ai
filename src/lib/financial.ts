import { Expense, Settlement, NetBalance, DebtTransaction, GroupMember } from '@/types';

/**
 * Converts a decimal rupee string or number to integer paise (1 INR = 100 paise)
 * Avoids IEEE 754 floating point imprecision
 */
export function rupeesToPaise(rupees: number | string): number {
  if (typeof rupees === 'string') {
    const cleaned = rupees.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return 0;
    return Math.round(parsed * 100);
  }
  return Math.round(rupees * 100);
}

/**
 * Converts integer paise to rupee decimal
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Formats integer paise into localized currency display (e.g. ₹1,250.50)
 */
export function formatPaise(paise: number, currency: string = 'INR'): string {
  const rupees = paise / 100;
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rupees);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format currency without symbol (e.g. 1,250.50)
 */
export function formatPaiseNumber(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Computes an equal split among N participants.
 * Guarantees that the sum of all participant shares equals the original expense amount
 * with exact paise-level rounding (distributing remainder paise 1-by-1).
 */
export function calculateEqualSplit(
  totalPaise: number,
  participants: { userId: string; userName: string }[]
): { userId: string; userName: string; amountPaise: number }[] {
  const count = participants.length;
  if (count === 0) return [];

  const baseShare = Math.floor(totalPaise / count);
  let remainder = totalPaise % count;

  return participants.map((p) => {
    let share = baseShare;
    if (remainder > 0) {
      share += 1;
      remainder -= 1;
    }
    return {
      userId: p.userId,
      userName: p.userName,
      amountPaise: share,
    };
  });
}

/**
 * Computes a percentage split, distributing any 1-paise rounding delta to ensure exact sum.
 */
export function calculatePercentageSplit(
  totalPaise: number,
  participants: { userId: string; userName: string; percentage: number }[]
): { userId: string; userName: string; amountPaise: number; percentage: number }[] {
  let allocated = 0;
  const result = participants.map((p) => {
    const share = Math.round((totalPaise * p.percentage) / 100);
    allocated += share;
    return {
      userId: p.userId,
      userName: p.userName,
      amountPaise: share,
      percentage: p.percentage,
    };
  });

  // Adjust any rounding discrepancy on the largest share
  const delta = totalPaise - allocated;
  if (delta !== 0 && result.length > 0) {
    let maxIdx = 0;
    for (let i = 1; i < result.length; i++) {
      if (result[i].amountPaise > result[maxIdx].amountPaise) {
        maxIdx = i;
      }
    }
    result[maxIdx].amountPaise += delta;
  }

  return result;
}

/**
 * Validates whether custom splits exactly match the total expense
 */
export function validateSplitSum(totalPaise: number, shares: number[]): boolean {
  const sum = shares.reduce((acc, curr) => acc + curr, 0);
  return sum === totalPaise;
}

/**
 * Computes the Net Balances for each member in a group, factoring in expenses and settled payments.
 */
export function calculateGroupBalances(
  members: GroupMember[],
  expenses: Expense[],
  settlements: Settlement[]
): NetBalance[] {
  const memberMap = new Map<string, NetBalance>();

  for (const m of members) {
    memberMap.set(m.userId, {
      userId: m.userId,
      userName: m.fullName,
      avatarUrl: m.avatarUrl,
      totalPaidPaise: 0,
      totalSharePaise: 0,
      netPaise: 0,
    });
  }

  // Aggregate expenses
  for (const exp of expenses) {
    const payer = memberMap.get(exp.paidByUserId);
    if (payer) {
      payer.totalPaidPaise += exp.amountPaise;
    }

    for (const split of exp.splits) {
      const participant = memberMap.get(split.userId);
      if (participant) {
        participant.totalSharePaise += split.amountPaise;
      }
    }
  }

  // Adjust for completed settlements
  // If Alice paid Bob ₹500: Alice's net increases by ₹500 (less owed), Bob's decreases by ₹500 (already received)
  for (const s of settlements) {
    if (s.status === 'completed') {
      const fromMember = memberMap.get(s.fromUserId);
      const toMember = memberMap.get(s.toUserId);
      if (fromMember) {
        fromMember.totalPaidPaise += s.amountPaise;
      }
      if (toMember) {
        toMember.totalSharePaise += s.amountPaise;
      }
    }
  }

  // Compute net balance: positive = receives, negative = owes
  for (const item of memberMap.values()) {
    item.netPaise = item.totalPaidPaise - item.totalSharePaise;
  }

  return Array.from(memberMap.values());
}

/**
 * Mathematically correct Debt Simplification Algorithm (Min-Cash-Flow).
 * Greedily resolves largest creditor and debtor pairs to produce the minimum
 * number of transactions needed to settle all debts in the group.
 */
export function calculateSimplifiedSettlements(balances: NetBalance[]): DebtTransaction[] {
  // Deep clone to avoid mutating input
  const creditors: { userId: string; userName: string; amount: number }[] = [];
  const debtors: { userId: string; userName: string; amount: number }[] = [];

  for (const b of balances) {
    if (b.netPaise > 0) {
      creditors.push({ userId: b.userId, userName: b.userName, amount: b.netPaise });
    } else if (b.netPaise < 0) {
      debtors.push({ userId: b.userId, userName: b.userName, amount: -b.netPaise });
    }
  }

  const transactions: DebtTransaction[] = [];

  // Sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    if (settleAmount > 0) {
      transactions.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
        amountPaise: settleAmount,
      });

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;
    }

    if (creditor.amount === 0) cIdx++;
    if (debtor.amount === 0) dIdx++;
  }

  return transactions;
}
