'use client';

import {
  UserProfile,
  Group,
  Expense,
  Settlement,
  InnovationProject,
  Transaction,
  AppNotification,
  MilestoneSubmission,
} from '@/types';
import { calculateGroupBalances, calculateSimplifiedSettlements } from './financial';

// Demo seed users
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-daksh',
    fullName: 'Daksh Sharma',
    email: 'daksh@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    institution: 'IIT Bombay',
    areaOfInterest: 'Robotics & AI',
    role: 'user',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-rahul',
    fullName: 'Rahul Verma',
    email: 'rahul@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    institution: 'IIT Bombay',
    areaOfInterest: 'Hardware & IoT',
    role: 'user',
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'user-jay',
    fullName: 'Jay Patel',
    email: 'jay@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    institution: 'BITS Pilani',
    areaOfInterest: 'Software & Cloud',
    role: 'user',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-meet',
    fullName: 'Meet Joshi',
    email: 'meet@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    institution: 'BITS Pilani',
    areaOfInterest: 'Bioengineering',
    role: 'user',
    createdAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'user-harsh',
    fullName: 'Harsh Mehta',
    email: 'harsh@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    institution: 'IIT Delhi',
    areaOfInterest: 'Clean Energy & EV',
    role: 'user',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'user-sneha',
    fullName: 'Sneha Reddy',
    email: 'sneha@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    institution: 'IIT Madras',
    areaOfInterest: 'Robotics & Automation',
    role: 'user',
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'user-admin',
    fullName: 'Platform Administrator',
    email: 'admin@groupfund.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    institution: 'GroupFund AI HQ',
    areaOfInterest: 'Platform Security & Audits',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// Initial Groups
export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group-goa-2026',
    name: 'College Trip Goa 2026',
    description: 'Shared expenses for graduation beach trip, villa booking, rental cars, and seafood dinners.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    inviteCode: 'GOA2026',
    createdBy: 'user-daksh',
    createdAt: '2026-02-01T10:00:00Z',
    totalSpentPaise: 1000000, // ₹10,000.00 (from prompt example)
    members: [
      {
        userId: 'user-daksh',
        fullName: 'Daksh Sharma',
        email: 'daksh@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin',
        joinedAt: '2026-02-01T10:00:00Z',
      },
      {
        userId: 'user-rahul',
        fullName: 'Rahul Verma',
        email: 'rahul@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'member',
        joinedAt: '2026-02-01T10:30:00Z',
      },
      {
        userId: 'user-jay',
        fullName: 'Jay Patel',
        email: 'jay@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'member',
        joinedAt: '2026-02-01T11:00:00Z',
      },
      {
        userId: 'user-meet',
        fullName: 'Meet Joshi',
        email: 'meet@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
        role: 'member',
        joinedAt: '2026-02-01T11:30:00Z',
      },
      {
        userId: 'user-harsh',
        fullName: 'Harsh Mehta',
        email: 'harsh@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        role: 'member',
        joinedAt: '2026-02-01T12:00:00Z',
      },
    ],
  },
  {
    id: 'group-robolab',
    name: 'Robotics Lab & Hostel',
    description: 'Shared lab groceries, filament rolls, sensors, and dinner orders.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    inviteCode: 'ROBOLAB',
    createdBy: 'user-daksh',
    createdAt: '2026-01-15T10:00:00Z',
    totalSpentPaise: 425000, // ₹4,250.00
    members: [
      {
        userId: 'user-daksh',
        fullName: 'Daksh Sharma',
        email: 'daksh@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin',
        joinedAt: '2026-01-15T10:00:00Z',
      },
      {
        userId: 'user-rahul',
        fullName: 'Rahul Verma',
        email: 'rahul@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'member',
        joinedAt: '2026-01-15T10:30:00Z',
      },
      {
        userId: 'user-sneha',
        fullName: 'Sneha Reddy',
        email: 'sneha@groupfund.ai',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        role: 'member',
        joinedAt: '2026-01-16T10:00:00Z',
      },
    ],
  },
];

// Initial Expenses matching Section 6.E example:
// Daksh pays ₹5,000, Rahul ₹2,000, Jay ₹1,500, Meet ₹1,000, Harsh ₹500. Total = ₹10,000.
// All 5 participants split equally (₹2,000 each).
export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    groupId: 'group-goa-2026',
    groupName: 'College Trip Goa 2026',
    title: 'Beach Villa Booking (Advance)',
    description: '3 nights stay near Candolim Beach for 5 people',
    amountPaise: 500000, // ₹5,000.00 paid by Daksh
    category: 'Accommodation',
    paidByUserId: 'user-daksh',
    paidByUserName: 'Daksh Sharma',
    date: '2026-02-02',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    receiptData: {
      merchantName: 'Candolim Palms Villa',
      purchaseDate: '2026-02-02',
      items: [{ name: 'Villa Reservation Deposit', pricePaise: 500000 }],
      subtotalPaise: 500000,
      taxPaise: 0,
      discountPaise: 0,
      totalPaise: 500000,
    },
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 100000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 100000 },
      { userId: 'user-jay', userName: 'Jay Patel', amountPaise: 100000 },
      { userId: 'user-meet', userName: 'Meet Joshi', amountPaise: 100000 },
      { userId: 'user-harsh', userName: 'Harsh Mehta', amountPaise: 100000 },
    ],
    createdAt: '2026-02-02T14:30:00Z',
  },
  {
    id: 'exp-2',
    groupId: 'group-goa-2026',
    groupName: 'College Trip Goa 2026',
    title: 'Self-Drive Car Rental & Fuel',
    description: 'Mahindra Thar for 3 days',
    amountPaise: 200000, // ₹2,000.00 paid by Rahul
    category: 'Transportation',
    paidByUserId: 'user-rahul',
    paidByUserName: 'Rahul Verma',
    date: '2026-02-03',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 40000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 40000 },
      { userId: 'user-jay', userName: 'Jay Patel', amountPaise: 40000 },
      { userId: 'user-meet', userName: 'Meet Joshi', amountPaise: 40000 },
      { userId: 'user-harsh', userName: 'Harsh Mehta', amountPaise: 40000 },
    ],
    createdAt: '2026-02-03T09:15:00Z',
  },
  {
    id: 'exp-3',
    groupId: 'group-goa-2026',
    groupName: 'College Trip Goa 2026',
    title: 'Seafood Shack Welcome Dinner',
    description: 'Dinner at Britto’s Baga',
    amountPaise: 150000, // ₹1,500.00 paid by Jay
    category: 'Food & Drinks',
    paidByUserId: 'user-jay',
    paidByUserName: 'Jay Patel',
    date: '2026-02-03',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 30000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 30000 },
      { userId: 'user-jay', userName: 'Jay Patel', amountPaise: 30000 },
      { userId: 'user-meet', userName: 'Meet Joshi', amountPaise: 30000 },
      { userId: 'user-harsh', userName: 'Harsh Mehta', amountPaise: 30000 },
    ],
    createdAt: '2026-02-03T21:40:00Z',
  },
  {
    id: 'exp-4',
    groupId: 'group-goa-2026',
    groupName: 'College Trip Goa 2026',
    title: 'Water Sports Combo (Parasailing + Jet Ski)',
    description: 'Calangute beach adventure sports package',
    amountPaise: 100000, // ₹1,000.00 paid by Meet
    category: 'Entertainment',
    paidByUserId: 'user-meet',
    paidByUserName: 'Meet Joshi',
    date: '2026-02-04',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 20000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 20000 },
      { userId: 'user-jay', userName: 'Jay Patel', amountPaise: 20000 },
      { userId: 'user-meet', userName: 'Meet Joshi', amountPaise: 20000 },
      { userId: 'user-harsh', userName: 'Harsh Mehta', amountPaise: 20000 },
    ],
    createdAt: '2026-02-04T16:00:00Z',
  },
  {
    id: 'exp-5',
    groupId: 'group-goa-2026',
    groupName: 'College Trip Goa 2026',
    title: 'Snacks, Coconut Water & Groceries',
    description: 'Local supermarket supplies',
    amountPaise: 50000, // ₹500.00 paid by Harsh
    category: 'Groceries',
    paidByUserId: 'user-harsh',
    paidByUserName: 'Harsh Mehta',
    date: '2026-02-04',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 10000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 10000 },
      { userId: 'user-jay', userName: 'Jay Patel', amountPaise: 10000 },
      { userId: 'user-meet', userName: 'Meet Joshi', amountPaise: 10000 },
      { userId: 'user-harsh', userName: 'Harsh Mehta', amountPaise: 10000 },
    ],
    createdAt: '2026-02-04T18:20:00Z',
  },
  {
    id: 'exp-robolab-1',
    groupId: 'group-robolab',
    groupName: 'Robotics Lab & Hostel',
    title: 'PLA 3D Printer Filament & Soldering Flux',
    description: '2 rolls black PLA filament and rosin core solder wire for chassis prototype',
    amountPaise: 185000, // ₹1,850.00 paid by Daksh
    category: 'Equipment',
    paidByUserId: 'user-daksh',
    paidByUserName: 'Daksh Sharma',
    date: '2026-01-20',
    receiptUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 61667 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 61667 },
      { userId: 'user-sneha', userName: 'Sneha Reddy', amountPaise: 61666 },
    ],
    createdAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'exp-robolab-2',
    groupId: 'group-robolab',
    groupName: 'Robotics Lab & Hostel',
    title: 'Ultrasonic Sensors & Breadboard Wires',
    description: '4x HC-SR04 distance sensors and 120-piece DuPont jumper wire kit',
    amountPaise: 120000, // ₹1,200.00 paid by Rahul
    category: 'Components',
    paidByUserId: 'user-rahul',
    paidByUserName: 'Rahul Verma',
    date: '2026-01-24',
    receiptUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 40000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 40000 },
      { userId: 'user-sneha', userName: 'Sneha Reddy', amountPaise: 40000 },
    ],
    createdAt: '2026-01-24T14:30:00Z',
  },
  {
    id: 'exp-robolab-3',
    groupId: 'group-robolab',
    groupName: 'Robotics Lab & Hostel',
    title: 'Late-Night Lab Pizza & Cold Drinks',
    description: 'Dinner order during sprint hack night',
    amountPaise: 120000, // ₹1,200.00 paid by Sneha
    category: 'Food & Drinks',
    paidByUserId: 'user-sneha',
    paidByUserName: 'Sneha Reddy',
    date: '2026-01-28',
    receiptUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    splitType: 'equal',
    splits: [
      { userId: 'user-daksh', userName: 'Daksh Sharma', amountPaise: 40000 },
      { userId: 'user-rahul', userName: 'Rahul Verma', amountPaise: 40000 },
      { userId: 'user-sneha', userName: 'Sneha Reddy', amountPaise: 40000 },
    ],
    createdAt: '2026-01-28T22:15:00Z',
  },
];

// Initial Settlements
export const INITIAL_SETTLEMENTS: Settlement[] = [];

// Initial Innovation Projects
export const INITIAL_PROJECTS: InnovationProject[] = [
  {
    id: 'proj-agribot',
    title: 'AgriBot: Autonomous Precision Agricultural Robot',
    shortDescription: 'Solar-powered autonomous rover detecting crop weeds with computer vision and spot-spraying organic biopesticides.',
    problemStatement: 'Modern farming relies on indiscriminate chemical spraying that wastes 70% of chemicals, contaminates groundwater, and costs smallholder farmers thousands.',
    proposedSolution: 'AgriBot navigates crop rows using RTK GPS and stereo cameras, identifies individual weeds using lightweight edge AI models, and sprays micro-droplets exclusively on target vegetation.',
    category: 'Robotics',
    targetAmountPaise: 35000000, // ₹3,50,000.00
    raisedAmountPaise: 24500000, // ₹2,45,000.00 (70% funded)
    completionDate: '2026-12-15',
    institution: 'IIT Bombay Robotics Club',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    creatorId: 'user-daksh',
    creatorName: 'Daksh Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    budgetBreakdown: [
      { item: 'Rocker-Bogie Chassis & Motors', amountPaise: 8000000, notes: 'Planetary gear motors and CNC aluminum' },
      { item: 'Edge Computing Jetson Orin Nano', amountPaise: 6500000, notes: 'Real-time YOLOv8 weed detection' },
      { item: 'Stereo Vision & RTK-GPS Modules', amountPaise: 7500000, notes: 'Sub-centimeter furrow tracking' },
      { item: 'High-Pressure Micro Solenoid Valves', amountPaise: 5000000, notes: 'Targeted biopesticide micro-jets' },
      { item: 'Solar Panels & LiFePO4 Battery Pack', amountPaise: 8000000, notes: '6-hour field continuous autonomy' },
    ],
    milestones: [
      {
        id: 'ms-1',
        projectId: 'proj-agribot',
        orderIndex: 1,
        title: 'Mechanical Design & Simulation',
        description: 'Complete CAD modeling of four-wheel rocker-bogie chassis and stress analysis in ANSYS.',
        targetDate: '2026-08-15',
        budgetAllocatedPaise: 5000000,
        status: 'completed',
        submissions: [
          {
            id: 'sub-1',
            milestoneId: 'ms-1',
            title: 'CAD Package & Finite Element Analysis Report',
            notes: 'Completed structural stress simulations with safety factor 2.4.',
            evidenceUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
            reviewerStatus: 'approved',
            reviewerFeedback: 'Excellent structural analysis and ground clearance specs verified.',
            submittedBy: 'user-daksh',
            submittedAt: '2026-08-10T12:00:00Z',
            reviewedAt: '2026-08-14T15:00:00Z',
          },
        ],
      },
      {
        id: 'ms-2',
        projectId: 'proj-agribot',
        orderIndex: 2,
        title: 'Chassis Prototype & Motor Drives',
        description: 'Fabrication of lightweight aluminum extrusion frame and integration of planetary gear motors.',
        targetDate: '2026-09-30',
        budgetAllocatedPaise: 8000000,
        status: 'completed',
        submissions: [
          {
            id: 'sub-2',
            milestoneId: 'ms-2',
            title: 'Chassis Rolling Test Video & Drive Circuit Schematics',
            notes: 'Motor driver tested under 40kg payload on simulated soil testbed.',
            evidenceUrls: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
            reviewerStatus: 'approved',
            reviewerFeedback: 'Payload benchmark passed with zero motor thermal throttle.',
            submittedBy: 'user-daksh',
            submittedAt: '2026-09-28T10:00:00Z',
            reviewedAt: '2026-09-29T16:30:00Z',
          },
        ],
      },
      {
        id: 'ms-3',
        projectId: 'proj-agribot',
        orderIndex: 3,
        title: 'Sensor Integration & Edge AI Camera',
        description: 'Mounting stereo depth cameras, Jetson Orin Nano, and testing weed segmentation neural network.',
        targetDate: '2026-10-31',
        budgetAllocatedPaise: 10000000,
        status: 'submitted',
        submissions: [
          {
            id: 'sub-3',
            milestoneId: 'ms-3',
            title: 'Edge AI Benchmark & Precision Spraying Verification',
            notes: 'Trained YOLOv8-tiny weed detection model achieves 94.2% mAP at 28 FPS on Jetson Orin Nano.',
            evidenceUrls: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
            aiAnalysis: {
              progressSummary: 'Edge model inference validated with high precision (94.2% mAP). Camera calibration and latency under 35ms satisfy real-time field tracking.',
              riskAssessment: 'low',
              budgetUtilization: '₹98,500 spent of ₹1,00,000 allocated budget (98.5% efficiency).',
              remainingWork: 'Connect solenoid trigger signals to ROS2 node and calibrate nozzle pressure.',
              verificationScore: 92,
              disclaimer: 'AI assessment generated from submitted test logs and image evidence. Final approval pending mentor review.',
            },
            reviewerStatus: 'pending',
            submittedBy: 'user-daksh',
            submittedAt: '2026-10-29T18:00:00Z',
          },
        ],
      },
      {
        id: 'ms-4',
        projectId: 'proj-agribot',
        orderIndex: 4,
        title: 'Autonomous Navigation & RTK-GPS',
        description: 'Testing path planning algorithms on crop furrows using Nav2 ROS2 stack.',
        targetDate: '2026-11-20',
        budgetAllocatedPaise: 7000000,
        status: 'upcoming',
      },
      {
        id: 'ms-5',
        projectId: 'proj-agribot',
        orderIndex: 5,
        title: 'Field Testing & Farmer Demonstration',
        description: 'Live 10-acre trial run with organic farm partners and metric validation report.',
        targetDate: '2026-12-15',
        budgetAllocatedPaise: 5000000,
        status: 'upcoming',
      },
    ],
    updates: [
      {
        id: 'upd-1',
        projectId: 'proj-agribot',
        title: 'Milestone 2 Cleared: Chassis Test Successful!',
        content: 'We successfully ran the rocker-bogie chassis over gravel and uneven furrows! The planetary motors handled slopes up to 25 degrees with ease.',
        createdAt: '2026-09-30T10:00:00Z',
      },
      {
        id: 'upd-2',
        projectId: 'proj-agribot',
        title: 'YOLOv8 Edge Model reaching 28 FPS on Jetson!',
        content: 'Huge progress: our weed detection pipeline is running in real-time under natural sunlight variations. Milestone 3 submitted for mentor approval!',
        createdAt: '2026-10-30T14:00:00Z',
      },
    ],
    contributions: [
      {
        id: 'cont-1',
        projectId: 'proj-agribot',
        projectTitle: 'AgriBot: Autonomous Precision Agricultural Robot',
        contributorId: 'user-rahul',
        contributorName: 'Rahul Verma',
        amountPaise: 5000000, // ₹50,000
        paypalOrderId: 'SANDBOX-ORDER-9812A',
        paypalCaptureId: 'SANDBOX-CAP-1192B',
        status: 'completed',
        isAnonymous: false,
        message: 'Proud of our robotics lab team! Let us change agriculture.',
        createdAt: '2026-02-10T12:00:00Z',
      },
      {
        id: 'cont-2',
        projectId: 'proj-agribot',
        projectTitle: 'AgriBot: Autonomous Precision Agricultural Robot',
        contributorId: 'user-jay',
        contributorName: 'Jay Patel',
        amountPaise: 2500000, // ₹25,000
        paypalOrderId: 'SANDBOX-ORDER-4421C',
        status: 'completed',
        isAnonymous: false,
        message: 'Super impressed with the weed detection demo. Best of luck!',
        createdAt: '2026-02-12T15:30:00Z',
      },
    ],
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'proj-biowear',
    title: 'BioWear: Continuous Non-Invasive Glucose Patch',
    shortDescription: 'Wearable optical sensor patch that monitors glucose levels in real-time through reverse iontophoresis without finger pricking.',
    problemStatement: 'Diabetic patients must endure painful skin punctures 3-5 times a day or purchase expensive single-use continuous glucose monitor needles.',
    proposedSolution: 'BioWear uses multi-wavelength near-infrared spectroscopy and low-voltage interstitial fluid extraction to provide continuous painless readings transmitted over BLE.',
    category: 'Healthcare Technology',
    targetAmountPaise: 50000000, // ₹5,00,000.00
    raisedAmountPaise: 32000000, // ₹3,20,000.00 (64% funded)
    completionDate: '2027-01-20',
    institution: 'BITS Pilani Innovation Lab',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    ],
    creatorId: 'user-meet',
    creatorName: 'Meet Joshi',
    creatorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    budgetBreakdown: [
      { item: 'Micro-NIR Optical Sensors & Laser Diodes', amountPaise: 15000000 },
      { item: 'Flexible PCB Fabrication & Hydrogel Electrodes', amountPaise: 12000000 },
      { item: 'Clinical Reference Blood Glucose Calibration', amountPaise: 13000000 },
      { item: 'iOS/Android Flutter Bluetooth App', amountPaise: 10000000 },
    ],
    milestones: [
      {
        id: 'ms-bio-1',
        projectId: 'proj-biowear',
        orderIndex: 1,
        title: 'Spectroscopic Optical Sensor Calibration',
        description: 'In-vitro glucose aqueous solution spectral absorption testing at 940nm and 1300nm wavelengths.',
        targetDate: '2026-09-15',
        budgetAllocatedPaise: 10000000,
        status: 'completed',
      },
      {
        id: 'ms-bio-2',
        projectId: 'proj-biowear',
        orderIndex: 2,
        title: 'Skin Hydrogel Patch & BLE Motherboard',
        description: 'Miniaturizing analog front-end onto flexible polyimide substrate.',
        targetDate: '2026-11-30',
        budgetAllocatedPaise: 15000000,
        status: 'in_progress',
      },
    ],
    updates: [
      {
        id: 'upd-bio-1',
        projectId: 'proj-biowear',
        title: 'First In-Vitro Test Achieves 97% Correlation with Clinical Meters',
        content: 'Our spectroscopic prototype passed bench trials with synthetic interstitial fluid solutions.',
        createdAt: '2026-09-16T12:00:00Z',
      },
    ],
    contributions: [
      {
        id: 'cont-bio-1',
        projectId: 'proj-biowear',
        projectTitle: 'BioWear: Continuous Non-Invasive Glucose Patch',
        contributorName: 'Dr. Ananya Sen',
        amountPaise: 10000000,
        status: 'completed',
        isAnonymous: false,
        message: 'This will change lives for elderly diabetic patients.',
        createdAt: '2026-02-14T09:00:00Z',
      },
    ],
    createdAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'proj-aeroclean',
    title: 'AeroClean: Autonomous Drone for Rooftop Solar Farms',
    shortDescription: 'Tethered dust-sweeping UAV system that increases solar panel efficiency by 25% using waterless electrodynamic cleaning.',
    problemStatement: 'Dust accumulation reduces solar panel yield by up to 30%, while manual cleaning on industrial roofs poses fall hazards and wastes potable water.',
    proposedSolution: 'AeroClean hovers along panel rows discharging electrostatic fields and micro-brushes to dislodge arid dust without water usage or structural stress.',
    category: 'Renewable Energy',
    targetAmountPaise: 28000000, // ₹2,80,000.00
    raisedAmountPaise: 14000000, // ₹1,40,000.00 (50% funded)
    completionDate: '2026-11-30',
    institution: 'IIT Delhi Energy Group',
    status: 'published',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
    ],
    creatorId: 'user-harsh',
    creatorName: 'Harsh Mehta',
    creatorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    budgetBreakdown: [
      { item: 'Carbon Fiber Hexacopter Frame & Heavy Lift Motors', amountPaise: 10000000 },
      { item: 'Electrodynamic Dust Shield Generator', amountPaise: 8000000 },
      { item: 'LiDAR Terrain Following & Autonomous Docking Station', amountPaise: 10000000 },
    ],
    milestones: [
      {
        id: 'ms-aero-1',
        projectId: 'proj-aeroclean',
        orderIndex: 1,
        title: 'Autonomous Flight Controller & LiDAR Obstacle Avoidance',
        description: 'Tuning ArduPilot hexacopter for stable 1-meter altitude hold along angled solar arrays.',
        targetDate: '2026-08-30',
        budgetAllocatedPaise: 8000000,
        status: 'completed',
      },
      {
        id: 'ms-aero-2',
        projectId: 'proj-aeroclean',
        orderIndex: 2,
        title: 'Waterless Electrodynamic Brush Deployment',
        description: 'Testing electrostatic repulsion on desert dust particles in wind tunnel chamber.',
        targetDate: '2026-10-15',
        budgetAllocatedPaise: 12000000,
        status: 'in_progress',
      },
    ],
    updates: [],
    contributions: [],
    createdAt: '2026-01-28T16:00:00Z',
  },
];

// Initial Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-daksh',
    type: 'expense_payment',
    title: 'Beach Villa Booking (Advance)',
    amountPaise: 500000,
    direction: 'debit',
    status: 'completed',
    referenceId: 'exp-1',
    createdAt: '2026-02-02T14:30:00Z',
  },
  {
    id: 'tx-2',
    userId: 'user-rahul',
    type: 'project_contribution',
    title: 'Contributed to AgriBot Robotics',
    amountPaise: 5000000,
    direction: 'debit',
    status: 'completed',
    referenceId: 'cont-1',
    createdAt: '2026-02-10T12:00:00Z',
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-daksh',
    title: 'Pending Settlements Available',
    message: 'Simplified settlement plan calculated for "College Trip Goa 2026". You are owed ₹3,000.',
    type: 'settlement_request',
    link: '/groups/group-goa-2026',
    isRead: false,
    createdAt: '2026-02-04T19:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-daksh',
    title: 'Milestone 3 Ready for Review',
    message: 'Sensor Integration & Edge AI Camera submission generated AI verification score of 92%.',
    type: 'milestone_update',
    link: '/projects/manage',
    isRead: false,
    createdAt: '2026-10-29T18:05:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-daksh',
    title: 'New Contribution Received',
    message: 'Rahul Verma backed AgriBot with ₹50,000 via PayPal Sandbox Checkout!',
    type: 'project_contribution',
    link: '/projects/proj-agribot',
    isRead: true,
    createdAt: '2026-02-10T12:01:00Z',
  },
];

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  CURRENT_USER: 'gf_current_user_v1',
  GROUPS: 'gf_groups_v1',
  EXPENSES: 'gf_expenses_v1',
  SETTLEMENTS: 'gf_settlements_v1',
  PROJECTS: 'gf_projects_v1',
  TRANSACTIONS: 'gf_transactions_v1',
  NOTIFICATIONS: 'gf_notifications_v1',
};

class Store {
  private currentUser: UserProfile = DEMO_USERS[0]; // Daksh Sharma by default
  private groups: Group[] = INITIAL_GROUPS;
  private expenses: Expense[] = INITIAL_EXPENSES;
  private settlements: Settlement[] = INITIAL_SETTLEMENTS;
  private projects: InnovationProject[] = INITIAL_PROJECTS;
  private transactions: Transaction[] = INITIAL_TRANSACTIONS;
  private notifications: AppNotification[] = INITIAL_NOTIFICATIONS;
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    // Note: Do NOT load synchronously from localStorage in constructor on module evaluation,
    // as that causes SSR/client initial render divergence (hydration mismatch).
    // Storage is initialized during client hydration in AppProvider's useEffect via initialize().
  }

  public initialize() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      this.loadFromStorage();
    }
  }

  public loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) this.currentUser = JSON.parse(storedUser);

      const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      if (storedGroups) {
        const parsed: Group[] = JSON.parse(storedGroups);
        const existingIds = new Set(parsed.map((g) => g.id));
        const missingInitial = INITIAL_GROUPS.filter((g) => !existingIds.has(g.id));
        this.groups = [...parsed, ...missingInitial];
      }

      const storedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (storedExpenses) {
        const parsed: Expense[] = JSON.parse(storedExpenses);
        const existingIds = new Set(parsed.map((e) => e.id));
        const missingInitial = INITIAL_EXPENSES.filter((e) => !existingIds.has(e.id));
        this.expenses = [...parsed, ...missingInitial];
      }

      const storedSettlements = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
      if (storedSettlements) this.settlements = JSON.parse(storedSettlements);

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        const parsed: InnovationProject[] = JSON.parse(storedProjects);
        const updated = parsed.map((p) => {
          if (p.id === 'proj-aeroclean') {
            const has404 = p.images?.some(
              (img) => img.includes('1509391365360') || img.includes('1508873696983')
            );
            if (has404 || !p.images || p.images.length === 0) {
              return {
                ...p,
                images: [
                  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
                  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
                ],
              };
            }
          }
          return p;
        });
        const existingIds = new Set(updated.map((p) => p.id));
        const missingInitial = INITIAL_PROJECTS.filter((p) => !existingIds.has(p.id));
        this.projects = [...updated, ...missingInitial];
      }

      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTransactions) this.transactions = JSON.parse(storedTransactions);

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) this.notifications = JSON.parse(storedNotifs);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(this.groups));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(this.expenses));
      localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(this.settlements));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // Current User Management
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.saveToStorage();
  }

  public getAllUsers(): UserProfile[] {
    return DEMO_USERS;
  }

  // Groups
  public getGroups(): Group[] {
    return this.groups;
  }

  public getGroupById(groupId: string): Group | undefined {
    return this.groups.find((g) => g.id === groupId);
  }

  public addGroup(name: string, description: string, imageUrl?: string): Group {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      inviteCode,
      createdBy: this.currentUser.id,
      createdAt: new Date().toISOString(),
      totalSpentPaise: 0,
      members: [
        {
          userId: this.currentUser.id,
          fullName: this.currentUser.fullName,
          email: this.currentUser.email,
          avatarUrl: this.currentUser.avatarUrl,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    this.groups = [newGroup, ...this.groups];
    this.addNotification({
      userId: this.currentUser.id,
      title: 'Group Created',
      message: `Group "${name}" is ready. Share code ${inviteCode} to invite friends.`,
      type: 'group_invite',
      link: `/groups/${newGroup.id}`,
    });
    this.saveToStorage();
    return newGroup;
  }

  public joinGroupByCode(code: string): { success: boolean; group?: Group; message: string } {
    const group = this.groups.find(
      (g) => g.inviteCode.trim().toUpperCase() === code.trim().toUpperCase()
    );
    if (!group) {
      return { success: false, message: 'Invalid invitation code. Group not found.' };
    }

    const alreadyMember = group.members.some((m) => m.userId === this.currentUser.id);
    if (alreadyMember) {
      return { success: true, group, message: 'You are already a member of this group.' };
    }

    group.members.push({
      userId: this.currentUser.id,
      fullName: this.currentUser.fullName,
      email: this.currentUser.email,
      avatarUrl: this.currentUser.avatarUrl,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });

    this.addNotification({
      userId: group.createdBy,
      title: 'New Member Joined',
      message: `${this.currentUser.fullName} joined "${group.name}".`,
      type: 'group_invite',
      link: `/groups/${group.id}`,
    });

    this.saveToStorage();
    return { success: true, group, message: `Successfully joined ${group.name}!` };
  }

  // Expenses
  public getExpenses(groupId?: string): Expense[] {
    if (groupId) {
      return this.expenses.filter((e) => e.groupId === groupId);
    }
    return this.expenses;
  }

  public getExpenseById(expenseId: string): Expense | undefined {
    return this.expenses.find((e) => e.id === expenseId);
  }

  public addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.expenses = [newExpense, ...this.expenses];

    // Update group total
    const group = this.groups.find((g) => g.id === expenseData.groupId);
    if (group) {
      group.totalSpentPaise += expenseData.amountPaise;
    }

    // Record transaction
    this.transactions = [
      {
        id: `tx-${Date.now()}`,
        userId: expenseData.paidByUserId,
        type: 'expense_payment',
        title: expenseData.title,
        amountPaise: expenseData.amountPaise,
        direction: 'debit',
        status: 'completed',
        referenceId: newExpense.id,
        createdAt: new Date().toISOString(),
      },
      ...this.transactions,
    ];

    // Notify split members
    for (const split of newExpense.splits) {
      if (split.userId !== expenseData.paidByUserId) {
        this.addNotification({
          userId: split.userId,
          title: 'New Expense Added',
          message: `${expenseData.paidByUserName} added "${expenseData.title}". Your share is ₹${(split.amountPaise / 100).toFixed(2)}.`,
          type: 'new_expense',
          link: `/groups/${expenseData.groupId}`,
        });
      }
    }

    this.saveToStorage();
    return newExpense;
  }

  public deleteExpense(expenseId: string): boolean {
    const exp = this.expenses.find((e) => e.id === expenseId);
    if (!exp) return false;

    const group = this.groups.find((g) => g.id === exp.groupId);
    if (group) {
      group.totalSpentPaise = Math.max(0, group.totalSpentPaise - exp.amountPaise);
    }

    this.expenses = this.expenses.filter((e) => e.id !== expenseId);
    this.saveToStorage();
    return true;
  }

  // Settlements
  public getSettlements(groupId?: string): Settlement[] {
    if (groupId) {
      return this.settlements.filter((s) => s.groupId === groupId);
    }
    return this.settlements;
  }

  public createSettlement(settlementData: Omit<Settlement, 'id' | 'createdAt'>): Settlement {
    const newSettlement: Settlement = {
      ...settlementData,
      id: `settle-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.settlements = [newSettlement, ...this.settlements];

    this.addNotification({
      userId: settlementData.toUserId,
      title: 'Settlement Requested / Recorded',
      message: `${settlementData.fromUserName} recorded a payment of ₹${(settlementData.amountPaise / 100).toFixed(2)} to you.`,
      type: 'settlement_request',
      link: `/settlements`,
    });

    this.saveToStorage();
    return newSettlement;
  }

  public markSettlementCompleted(settlementId: string): boolean {
    const settlement = this.settlements.find((s) => s.id === settlementId);
    if (!settlement) return false;

    settlement.status = 'completed';
    settlement.completedAt = new Date().toISOString();

    // Log transactions
    this.transactions = [
      {
        id: `tx-${Date.now()}-payout`,
        userId: settlement.fromUserId,
        type: 'settlement_payout',
        title: `Settled payment to ${settlement.toUserName}`,
        amountPaise: settlement.amountPaise,
        direction: 'debit',
        status: 'completed',
        referenceId: settlement.id,
        createdAt: new Date().toISOString(),
      },
      {
        id: `tx-${Date.now()}-rec`,
        userId: settlement.toUserId,
        type: 'settlement_received',
        title: `Received settlement from ${settlement.fromUserName}`,
        amountPaise: settlement.amountPaise,
        direction: 'credit',
        status: 'completed',
        referenceId: settlement.id,
        createdAt: new Date().toISOString(),
      },
      ...this.transactions,
    ];

    this.addNotification({
      userId: settlement.fromUserId,
      title: 'Settlement Confirmed',
      message: `Your payment of ₹${(settlement.amountPaise / 100).toFixed(2)} to ${settlement.toUserName} has been confirmed.`,
      type: 'payment_confirmed',
      link: `/settlements`,
    });

    this.saveToStorage();
    return true;
  }

  // Innovation Projects
  public getProjects(): InnovationProject[] {
    return this.projects;
  }

  public getProjectById(projectId: string): InnovationProject | undefined {
    return this.projects.find((p) => p.id === projectId);
  }

  public addProject(projectData: Omit<InnovationProject, 'id' | 'createdAt' | 'raisedAmountPaise' | 'updates' | 'contributions'>): InnovationProject {
    const newProject: InnovationProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      raisedAmountPaise: 0,
      updates: [],
      contributions: [],
      createdAt: new Date().toISOString(),
    };

    this.projects = [newProject, ...this.projects];

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Innovation Project Created',
      message: `"${newProject.title}" has been published and is now open for discovery and crowdfunding!`,
      type: 'project_contribution',
      link: `/projects/${newProject.id}`,
    });

    this.saveToStorage();
    return newProject;
  }

  public updateProjectStatus(projectId: string, status: InnovationProject['status']): boolean {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return false;
    project.status = status;
    this.saveToStorage();
    return true;
  }

  public addProjectUpdate(projectId: string, title: string, content: string): boolean {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return false;

    project.updates = [
      {
        id: `upd-${Date.now()}`,
        projectId,
        title,
        content,
        createdAt: new Date().toISOString(),
      },
      ...project.updates,
    ];

    this.saveToStorage();
    return true;
  }

  public submitMilestoneEvidence(
    projectId: string,
    milestoneId: string,
    submission: Omit<MilestoneSubmission, 'id' | 'milestoneId' | 'submittedAt'>
  ): MilestoneSubmission | null {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return null;

    const newSub: MilestoneSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      milestoneId,
      submittedAt: new Date().toISOString(),
    };

    if (!milestone.submissions) milestone.submissions = [];
    milestone.submissions.push(newSub);
    milestone.status = 'submitted';

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Milestone Submitted for AI Review',
      message: `Submission "${newSub.title}" sent for progress evaluation.`,
      type: 'milestone_update',
      link: `/projects/manage`,
    });

    this.saveToStorage();
    return newSub;
  }

  public reviewMilestoneSubmission(
    projectId: string,
    milestoneId: string,
    submissionId: string,
    approved: boolean,
    feedback: string
  ): boolean {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return false;

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone || !milestone.submissions) return false;

    const sub = milestone.submissions.find((s) => s.id === submissionId);
    if (!sub) return false;

    sub.reviewerStatus = approved ? 'approved' : 'rejected';
    sub.reviewerFeedback = feedback;
    sub.reviewedAt = new Date().toISOString();

    if (approved) {
      milestone.status = 'approved';
    }

    this.addNotification({
      userId: project.creatorId,
      title: approved ? 'Milestone Approved' : 'Milestone Review Feedback',
      message: `Your submission for "${milestone.title}" was ${approved ? 'approved' : 'returned with feedback'}.`,
      type: 'milestone_update',
      link: `/projects/${projectId}`,
    });

    this.saveToStorage();
    return true;
  }

  // Contributions & PayPal
  public addContribution(
    projectId: string,
    amountPaise: number,
    contributorName: string,
    paypalOrderId?: string,
    paypalCaptureId?: string,
    message?: string
  ): boolean {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return false;

    project.raisedAmountPaise += amountPaise;

    const newContribution = {
      id: `cont-${Date.now()}`,
      projectId,
      projectTitle: project.title,
      contributorId: this.currentUser.id,
      contributorName: contributorName || this.currentUser.fullName,
      amountPaise,
      paypalOrderId: paypalOrderId || `SANDBOX-${Date.now()}`,
      paypalCaptureId: paypalCaptureId || `CAP-${Date.now()}`,
      status: 'completed' as const,
      isAnonymous: false,
      message,
      createdAt: new Date().toISOString(),
    };

    project.contributions = [newContribution, ...project.contributions];

    // Transaction ledger
    this.transactions = [
      {
        id: `tx-${Date.now()}-contrib`,
        userId: this.currentUser.id,
        type: 'project_contribution',
        title: `Funded: ${project.title}`,
        amountPaise,
        direction: 'debit',
        status: 'completed',
        referenceId: newContribution.id,
        createdAt: new Date().toISOString(),
      },
      ...this.transactions,
    ];

    // Notify project creator
    this.addNotification({
      userId: project.creatorId,
      title: 'New Innovation Contribution!',
      message: `${contributorName || this.currentUser.fullName} backed "${project.title}" with ₹${(amountPaise / 100).toFixed(2)}.`,
      type: 'project_contribution',
      link: `/projects/${projectId}`,
    });

    this.saveToStorage();
    return true;
  }

  // Transactions
  public getTransactions(userId?: string): Transaction[] {
    if (userId) {
      return this.transactions.filter((t) => t.userId === userId);
    }
    return this.transactions;
  }

  // Notifications
  public getNotifications(userId?: string): AppNotification[] {
    const uid = userId || this.currentUser.id;
    return this.notifications.filter((n) => n.userId === uid);
  }

  public addNotification(notifData: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications = [newNotif, ...this.notifications];
    this.saveToStorage();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.isRead = true;
      this.saveToStorage();
    }
  }

  public markAllNotificationsRead(userId?: string) {
    const uid = userId || this.currentUser.id;
    for (const n of this.notifications) {
      if (n.userId === uid) {
        n.isRead = true;
      }
    }
    this.saveToStorage();
  }

  // Balance summaries across all groups for user
  public getUserNetBalanceSummary(userId?: string) {
    const uid = userId || this.currentUser.id;
    let totalPaid = 0;
    let totalShare = 0;

    for (const group of this.groups) {
      const isMember = group.members.some((m) => m.userId === uid);
      if (!isMember) continue;

      const groupExpenses = this.expenses.filter((e) => e.groupId === group.id);
      const groupSettlements = this.settlements.filter((s) => s.groupId === group.id);
      const balances = calculateGroupBalances(group.members, groupExpenses, groupSettlements);
      const myBal = balances.find((b) => b.userId === uid);
      if (myBal) {
        totalPaid += myBal.totalPaidPaise;
        totalShare += myBal.totalSharePaise;
      }
    }

    const netPaise = totalPaid - totalShare;
    return {
      totalPaidPaise: totalPaid,
      totalSharePaise: totalShare,
      netPaise, // positive: owed to user (receivable), negative: user owes (payable)
      isReceivable: netPaise > 0,
    };
  }

  public resetToDemoData() {
    this.currentUser = DEMO_USERS[0];
    this.groups = INITIAL_GROUPS;
    this.expenses = INITIAL_EXPENSES;
    this.settlements = INITIAL_SETTLEMENTS;
    this.projects = INITIAL_PROJECTS;
    this.transactions = INITIAL_TRANSACTIONS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.saveToStorage();
  }
}

// Singleton instance
export const appStore = new Store();
