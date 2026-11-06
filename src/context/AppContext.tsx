'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { appStore } from '@/lib/store';
import {
  UserProfile,
  Group,
  Expense,
  Settlement,
  InnovationProject,
  Transaction,
  AppNotification,
} from '@/types';

interface AppContextType {
  isHydrated: boolean;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  groups: Group[];
  expenses: Expense[];
  settlements: Settlement[];
  projects: InnovationProject[];
  transactions: Transaction[];
  notifications: AppNotification[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setCurrentUser: (user: UserProfile) => void;
  createGroup: (name: string, description: string, imageUrl?: string) => Group;
  joinGroupByCode: (code: string) => { success: boolean; group?: Group; message: string };
  createExpense: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  deleteExpense: (expenseId: string) => boolean;
  createSettlement: (settlementData: Omit<Settlement, 'id' | 'createdAt'>) => Settlement;
  markSettlementCompleted: (settlementId: string) => boolean;
  createProject: (projectData: any) => InnovationProject;
  updateProjectStatus: (projectId: string, status: InnovationProject['status']) => boolean;
  submitMilestone: (projectId: string, milestoneId: string, submission: any) => any;
  reviewMilestone: (projectId: string, milestoneId: string, submissionId: string, approved: boolean, feedback: string) => boolean;
  contributeToProject: (projectId: string, amountPaise: number, contributorName: string, paypalOrderId?: string, paypalCaptureId?: string, message?: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUserBalanceSummary: () => { totalPaidPaise: number; totalSharePaise: number; netPaise: number; isReceivable: boolean };
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(appStore.getCurrentUser());
  const [allUsers] = useState<UserProfile[]>(appStore.getAllUsers());
  const [groups, setGroups] = useState<Group[]>(appStore.getGroups());
  const [expenses, setExpenses] = useState<Expense[]>(appStore.getExpenses());
  const [settlements, setSettlements] = useState<Settlement[]>(appStore.getSettlements());
  const [projects, setProjects] = useState<InnovationProject[]>(appStore.getProjects());
  const [transactions, setTransactions] = useState<Transaction[]>(appStore.getTransactions());
  const [notifications, setNotifications] = useState<AppNotification[]>(appStore.getNotifications());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync state with store updates and initialize from storage on client mount
  useEffect(() => {
    // Initialize persisted store from localStorage
    appStore.initialize();
    setIsHydrated(true);

    // Sync state immediately with loaded store data
    setCurrentUserState(appStore.getCurrentUser());
    setGroups([...appStore.getGroups()]);
    setExpenses([...appStore.getExpenses()]);
    setSettlements([...appStore.getSettlements()]);
    setProjects([...appStore.getProjects()]);
    setTransactions([...appStore.getTransactions()]);
    setNotifications([...appStore.getNotifications()]);

    const unsubscribe = appStore.subscribe(() => {
      setCurrentUserState(appStore.getCurrentUser());
      setGroups([...appStore.getGroups()]);
      setExpenses([...appStore.getExpenses()]);
      setSettlements([...appStore.getSettlements()]);
      setProjects([...appStore.getProjects()]);
      setTransactions([...appStore.getTransactions()]);
      setNotifications([...appStore.getNotifications()]);
    });

    const savedTheme = localStorage.getItem('gf_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light-theme');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('gf_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleSetCurrentUser = (user: UserProfile) => {
    appStore.setCurrentUser(user);
    setCurrentUserState(user);
  };

  return (
    <AppContext.Provider
      value={{
        isHydrated,
        currentUser,
        allUsers,
        groups,
        expenses,
        settlements,
        projects,
        transactions,
        notifications,
        theme,
        toggleTheme,
        setCurrentUser: handleSetCurrentUser,
        createGroup: (name, description, imageUrl) => appStore.addGroup(name, description, imageUrl),
        joinGroupByCode: (code) => appStore.joinGroupByCode(code),
        createExpense: (data) => appStore.addExpense(data),
        deleteExpense: (id) => appStore.deleteExpense(id),
        createSettlement: (data) => appStore.createSettlement(data),
        markSettlementCompleted: (id) => appStore.markSettlementCompleted(id),
        createProject: (data) => appStore.addProject(data),
        updateProjectStatus: (id, status) => appStore.updateProjectStatus(id, status),
        submitMilestone: (pid, mid, sub) => appStore.submitMilestoneEvidence(pid, mid, sub),
        reviewMilestone: (pid, mid, sid, app, fbk) => appStore.reviewMilestoneSubmission(pid, mid, sid, app, fbk),
        contributeToProject: (pid, amt, name, ordId, capId, msg) => appStore.addContribution(pid, amt, name, ordId, capId, msg),
        markNotificationRead: (id) => appStore.markNotificationRead(id),
        markAllNotificationsRead: () => appStore.markAllNotificationsRead(),
        getUserBalanceSummary: () => appStore.getUserNetBalanceSummary(),
        resetDemoData: () => appStore.resetToDemoData(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
