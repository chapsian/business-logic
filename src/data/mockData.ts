import { TaxDeadline, ComplianceQuestion, ConsultationSlot } from '../types';

export const KENYAN_TAX_DEADLINES: TaxDeadline[] = [
  {
    id: 'dl-paye',
    title: 'PAYE (Pay As You Earn) Filing',
    dueDate: '2026-07-09',
    category: 'PAYE',
    description: 'Deduction of PAYE from employee salaries and submission of monthly returns through the e-Tax portal.',
    penaltyEstimate: 'Penalty of KSh 10,000 or 25% of tax due, whichever is higher.'
  },
  {
    id: 'dl-sha',
    title: 'Social Health Authority (SHA/NHIF) Payment',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Submission of 2.75% household income contribution schemas to the new Social Health Authority.',
    penaltyEstimate: 'Penalty of 2.9% rate or compound interest on delay.'
  },
  {
    id: 'dl-nssf',
    title: 'NSSF Deductions & Returns',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Provident pension fund contributions for Tier I and Tier II employee rates matching.',
    penaltyEstimate: 'Penalty of 5% of employer and employee contributions due per month.'
  },
  {
    id: 'dl-levy',
    title: 'Affordable Housing Levy return',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Filing 1.5% of gross salary deducted from employees paired with 1.5% employer contribution.',
    penaltyEstimate: '2% monthly penalty on any unpaid levy balances.'
  },
  {
    id: 'dl-vat',
    title: 'Monthly VAT Return Submission',
    dueDate: '2026-07-20',
    category: 'VAT',
    description: 'Declaration of Input vs Output VAT for the preceding month on the tax e-portal.',
    penaltyEstimate: 'Penalty of KSh 10,000 or 5% of tax due, plus interest at 1% per month.'
  },
  {
    id: 'dl-corp',
    title: 'Annual Income Tax Return (Companies)',
    dueDate: '2026-06-30',
    category: 'Annual',
    description: 'Submission of Audited Accounts and Self-Assessment returns for companies ending December 31st.',
    penaltyEstimate: 'KSh 20,000 standard penalty plus interest compounding at 1% per month.'
  }
];

export const COMPLIANCE_QUESTIONS: ComplianceQuestion[] = [
  {
    id: 'q-structure',
    question: 'What is the current corporate tax compliance structure of your business?',
    category: 'filing',
    options: [
      { text: 'We file and reconcile corporate taxes annually', points: 25, tip: 'Superb! Annual compliance prevents severe iTax penalties.' },
      { text: 'We are registered for taxes but have not filed annual returns recently', points: 10, tip: 'Caution! Outstanding corporate returns attract KSh 20,000 annual penalty.' },
      { text: 'We do not have a corporate configuration tracking system yet', points: 0, tip: 'Necessary Task: Get started with simple bookkeeping setup to track annual performance.' }
    ]
  },
  {
    id: 'q-tax-pin',
    question: 'Does your business have a Tax PIN activated for taxes, and is your Tax Compliance Certificate (TCC) active?',
    category: 'filing',
    options: [
      { text: 'Yes, we have a Tax PIN and an active, valid TCC', points: 25, tip: 'Superb! An active TCC is critical for bidding on tenders and maintaining corporate trust.' },
      { text: 'We have a Tax PIN but our TCC has expired or is blocked due to unresolved dues', points: 10, tip: 'Urgent: Apply for a waiver or file pending returns to reactivate your Tax Compliance status.' },
      { text: 'No Tax PIN exists for the business yet', points: 0, tip: 'Necessary Task: Tax PIN setup must be done when setting up the accounting systems.' }
    ]
  },
  {
    id: 'q-stat',
    question: 'If you have employees, how regularly do you remit PAYE, SHA (NHIF), NSSF, and Affordable Housing Levy?',
    category: 'employees',
    options: [
      { text: 'Every month by the 9th deadline, without fail', points: 25, tip: 'Outstanding! This protects you from heavy compliance audits and labor prosecution.' },
      { text: 'We fail to meet deadlines frequently, or miss some obligations (e.g. Housing Levy or SHA)', points: 10, tip: 'Warning: Deducting statutory portions but failing to remit is a criminal offense in Kenya.' },
      { text: 'Not applicable (0 employees) or we do not remit any statutory returns', points: 20, tip: 'Valid if operating purely solo, but keep NSSF/SHA registered individually.' }
    ]
  },
  {
    id: 'q-records',
    question: 'How do you keep track of your daily business transactions and bank statements?',
    category: 'bookkeeping',
    options: [
      { text: 'Professional bookkeeping updated weekly with monthly Profit & Loss statements', points: 25, tip: 'Perfect! Clean books are your gateway to bank financing, audits, and investor valuation.' },
      { text: 'Basic records in Excel spreadsheets or mixed manual paper receipts', points: 10, tip: 'Consider outsourcing bookkeeping to keep clean balances, reconciled cash registers, and proper ledger matching.' },
      { text: 'No structured recording; we use our personal bank account for everything', points: 0, tip: 'Critical: Co-mingling business and personal finances violates accounting rules and leads to audits.' }
    ]
  }
];

export const CONSULTATION_SLOTS: ConsultationSlot[] = [
  {
    id: 'slot-1',
    time: '10:00 AM - 11:00 AM',
    advisor: 'Gladys Wanjiku, CPA(K)',
    role: 'Senior Accounting & Tax Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-2',
    time: '11:30 AM - 12:30 PM',
    advisor: 'David Omondi',
    role: 'Corporate Registrar & Business Architect',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-3',
    time: '02:00 PM - 03:00 PM',
    advisor: 'Gladys Wanjiku, CPA(K)',
    role: 'Senior Accounting & Tax Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-4',
    time: '03:30 PM - 04:30 PM',
    advisor: 'Arnold Kiprop',
    role: 'Accounting & Statutory Auditor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
  }
];

export const BOOKKEEPING_PLANS = [
  {
    id: 'micro',
    title: 'Micro Business',
    price: 'KSh 6,000',
    cap: '0-3 employees',
    services: ['Bookkeeping', 'Tax filing', 'Payroll support', 'Monthly returns']
  },
  {
    id: 'small',
    title: 'Small Business',
    price: 'KSh 12,000',
    cap: '3-10 employees',
    services: ['Bookkeeping', 'Tax filing', 'Payroll support', 'Monthly returns'],
    popular: true
  },
  {
    id: 'growing',
    title: 'Growing SME',
    price: 'KSh 25,000',
    cap: 'more than 10 employees',
    services: ['Bookkeeping', 'Tax filing', 'Payroll support', 'Monthly returns']
  }
];
