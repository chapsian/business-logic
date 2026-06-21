import { TaxDeadline, ComplianceQuestion, ConsultationSlot } from '../types';

export const KENYAN_TAX_DEADLINES: TaxDeadline[] = [
  {
    id: 'dl-paye',
    title: 'PAYE (Pay As You Earn) Internal Preparation',
    dueDate: '2026-07-09',
    category: 'PAYE',
    description: 'Internal calculations of employee salary PAYE rates and preparing the monthly payroll ledger schedules.',
    penaltyEstimate: 'Estimated payroll delays can lead to standard statutory employee disputes.'
  },
  {
    id: 'dl-sha',
    title: 'Social Health Insurance (SHIF/SHA) Calculation',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Processing internal schedules representing 2.75% household health deduction requirements to keep payroll immaculate.',
    penaltyEstimate: 'Delayed payroll reporting impacts organizational compliance audits.'
  },
  {
    id: 'dl-nssf',
    title: 'Pension Fund (NSSF) Tier Schedules',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Calculating the exact Tier I and Tier II employee/employer provident ledger matching structures.',
    penaltyEstimate: 'Late employer processing attracts compound interest on the outstanding balance.'
  },
  {
    id: 'dl-levy',
    title: 'Housing Levy Allocation Reconciliations',
    dueDate: '2026-07-09',
    category: 'Statutory',
    description: 'Determining the internal 1.5% employee deductions paired with matched employer shares for record keeping.',
    penaltyEstimate: 'Miscalculated salary items will cause structural discrepancy reports.'
  },
  {
    id: 'dl-vat',
    title: 'Monthly Sales & Input Tax Reconciliation',
    dueDate: '2026-07-20',
    category: 'VAT',
    description: 'Reconciling Sales invoices and Input purchase vouchers for the preceding month on your general ledger.',
    penaltyEstimate: 'Unreconciled tax ledgers attract audit scrutiny and penalty reviews.'
  },
  {
    id: 'dl-corp',
    title: 'Corporate Financial Statement Readiness',
    dueDate: '2026-06-30',
    category: 'Income Tax',
    description: 'Finalizing company balance sheets, tax calculation sheets, and audited statement drafts for your company year-end.',
    penaltyEstimate: 'Outstanding company accounts carry compound audit fees and late review penalties.'
  }
];

export const COMPLIANCE_QUESTIONS: ComplianceQuestion[] = [
  {
    id: 'q-structure',
    question: 'How does your business track its year-end corporate financial statements?',
    category: 'filing',
    options: [
      { text: 'We prepare independent corporate statements and balance sheets annually', points: 25, tip: 'Excellent! Regular year-end accounting prevents heavy review penalties.' },
      { text: 'We lack structured annual statements, leading to tax prep delays', points: 10, tip: 'Caution: Delaying your financial statements makes year-end preparative audits extremely complex.' },
      { text: 'We do not have a tracking ledger setup yet', points: 0, tip: 'Action Plan: A basic bookkeeping schedule is needed immediately to organize your transactions.' }
    ]
  },
  {
    id: 'q-tax-pin',
    question: 'How are your company daily transactions and accounts receivable ledger organized?',
    category: 'filing',
    options: [
      { text: 'We organize and compile every voucher, invoice, and bill weekly', points: 25, tip: 'Outstanding! Well-kept folders ensure you can easily prepare strategic statements at any time.' },
      { text: 'We store receipts but lack a master general ledger or double-entry cash book', points: 10, tip: 'Recommendation: Move to computerized or outsourced bookkeeping to save hours of stress later.' },
      { text: 'No structured recording; we review statements manually at the end of the year', points: 0, tip: 'Vulnerability: Mixing professional records with personal accounts makes auditing difficult.' }
    ]
  },
  {
    id: 'q-stat',
    question: 'How regularly do you calculate statutory portions (PAYE, SHA, NSSF, Housing Levy) for payroll?',
    category: 'employees',
    options: [
      { text: 'Every month before releasing salaries, with accurate pay slips generated', points: 25, tip: 'Perfect! Standard payroll record-keeping ensures professional labor relations.' },
      { text: 'We calculate them roughly but often discover discrepancies or late deductions', points: 10, tip: 'Careful: Discrepancies in payroll calculators require expensive professional hours to correct.' },
      { text: 'Not applicable (0 employees) or we do not run structured salary payrolls', points: 20, tip: 'Valid for solo operators. If you hire in the future, we recommend automated payroll tools.' }
    ]
  },
  {
    id: 'q-records',
    question: 'Which method do you currently use for tracking monthly expense categories?',
    category: 'bookkeeping',
    options: [
      { text: 'Outsourced to CPA specialists or updated on high-end ledger software', points: 25, tip: 'Excellent choice. Clean records unlock banking options and commercial valuation opportunities.' },
      { text: 'Basic records kept in Excel spreadsheets by our own staff', points: 10, tip: 'A good start! Ensure you reconcile entries monthly with bank statements to catch hidden fees.' },
      { text: 'Paper files in boxes, or no consistent tracking structure', points: 0, tip: 'High risk! Box-bound invoicing can result in lost expense deductions, increasing taxable income.' }
    ]
  }
];

export const CONSULTATION_SLOTS: ConsultationSlot[] = [
  {
    id: 'slot-1',
    time: '10:00 AM - 11:00 AM',
    advisor: 'Gladys Wanjiku, CPA',
    role: 'Senior Accounting Consultant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-2',
    time: '11:30 AM - 12:30 PM',
    advisor: 'David Omondi',
    role: 'Business Operations Principal',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-3',
    time: '02:00 PM - 03:00 PM',
    advisor: 'Gladys Wanjiku, CPA',
    role: 'Senior Accounting Consultant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'slot-4',
    time: '03:30 PM - 04:30 PM',
    advisor: 'Arnold Kiprop',
    role: 'Payroll & Advisory Specialist',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
  }
];

export const BOOKKEEPING_PLANS = [
  {
    id: 'micro',
    title: 'Micro Business',
    price: 'Ksh 6,000',
    cap: '0–3 employees',
    services: [
      'Bookkeeping Services',
      'Tax Preparation Support',
      'Payroll Calculations',
      'Monthly Return Preparation'
    ],
    popular: false
  },
  {
    id: 'small',
    title: 'Small Business',
    price: 'Ksh 12,000',
    cap: '3–10 employees',
    services: [
      'Bookkeeping Services',
      'Tax Preparation Support',
      'Payroll Calculations',
      'Monthly Return Preparation'
    ],
    popular: true
  },
  {
    id: 'growing',
    title: 'Growing SME',
    price: 'Ksh 25,000',
    cap: 'More than 10 employees',
    services: [
      'Bookkeeping Services',
      'Tax Preparation Support',
      'Payroll Calculations',
      'Monthly Return Preparation'
    ],
    popular: false
  }
];
