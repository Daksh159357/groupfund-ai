export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  institution?: string;
  areaOfInterest?: string;
  role: UserRole;
  createdAt: string;
}

export type SplitType = 'equal' | 'custom' | 'percentage';

export interface ExpenseSplit {
  userId: string;
  userName: string;
  amountPaise: number; // strict integer paise
  percentage?: number;
}

export interface ExpenseItem {
  name: string;
  quantity?: number;
  pricePaise: number;
}

export interface ReceiptScanData {
  merchantName: string;
  purchaseDate: string;
  items: ExpenseItem[];
  subtotalPaise: number;
  taxPaise: number;
  discountPaise: number;
  totalPaise: number;
  confidenceScore?: number;
  rawNotes?: string;
  mock?: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  groupName?: string;
  title: string;
  description?: string;
  amountPaise: number; // integer paise
  category: string;
  paidByUserId: string;
  paidByUserName: string;
  date: string;
  receiptUrl?: string;
  receiptData?: ReceiptScanData;
  splitType: SplitType;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  inviteCode: string;
  createdBy: string;
  members: GroupMember[];
  createdAt: string;
  totalSpentPaise: number;
}

export type SettlementStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'paypal' | 'bank_transfer' | 'other';

export interface Settlement {
  id: string;
  groupId: string;
  groupName?: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amountPaise: number;
  status: SettlementStatus;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface NetBalance {
  userId: string;
  userName: string;
  avatarUrl: string;
  totalPaidPaise: number;
  totalSharePaise: number;
  netPaise: number; // positive = receives, negative = owes
}

export interface DebtTransaction {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amountPaise: number;
}

export type ProjectCategory =
  | 'Robotics'
  | 'Artificial Intelligence'
  | 'Internet of Things'
  | 'Agriculture Technology'
  | 'Electric Vehicles'
  | 'Renewable Energy'
  | 'Healthcare Technology'
  | 'Embedded Systems'
  | 'Software Development'
  | 'Other Engineering Innovations';

export type ProjectStatus = 'draft' | 'published' | 'approved' | 'rejected' | 'funded';

export interface BudgetItem {
  item: string;
  amountPaise: number;
  notes?: string;
}

export type MilestoneStatus = 'upcoming' | 'in_progress' | 'submitted' | 'approved' | 'completed';

export interface MilestoneSubmission {
  id: string;
  milestoneId: string;
  title: string;
  notes: string;
  evidenceUrls: string[];
  aiAnalysis?: {
    progressSummary: string;
    riskAssessment: 'low' | 'moderate' | 'high';
    budgetUtilization: string;
    remainingWork: string;
    verificationScore: number;
    disclaimer: string;
    mock?: boolean;
  };
  reviewerStatus: 'pending' | 'approved' | 'rejected';
  reviewerFeedback?: string;
  submittedBy: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  orderIndex: number;
  title: string;
  description: string;
  targetDate: string;
  budgetAllocatedPaise: number;
  status: MilestoneStatus;
  submissions?: MilestoneSubmission[];
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  projectId: string;
  projectTitle: string;
  contributorId?: string;
  contributorName: string;
  amountPaise: number;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  status: 'pending' | 'completed' | 'failed';
  isAnonymous: boolean;
  message?: string;
  createdAt: string;
}

export interface InnovationProject {
  id: string;
  title: string;
  shortDescription: string;
  problemStatement: string;
  proposedSolution: string;
  category: ProjectCategory;
  targetAmountPaise: number;
  raisedAmountPaise: number;
  completionDate: string;
  institution: string;
  status: ProjectStatus;
  images: string[];
  videoUrl?: string;
  budgetBreakdown: BudgetItem[];
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  milestones: Milestone[];
  updates: ProjectUpdate[];
  contributions: Contribution[];
  createdAt: string;
}

export type TransactionType = 'expense_payment' | 'settlement_payout' | 'settlement_received' | 'project_contribution';
export type TransactionDirection = 'debit' | 'credit';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  amountPaise: number;
  direction: TransactionDirection;
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type NotificationType =
  | 'group_invite'
  | 'new_expense'
  | 'settlement_request'
  | 'payment_confirmed'
  | 'project_contribution'
  | 'milestone_update'
  | 'admin_notice';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextTag?: 'group_expenses' | 'innovation_funding' | 'general';
  mock?: boolean;
}
