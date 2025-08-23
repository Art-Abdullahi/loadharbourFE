export interface Broker {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  paymentTerms: number; // Net days (e.g., Net 30)
  mc: string; // Motor Carrier number
}

export interface BillingStatus {
  id: string;
  loadId: string;
  invoiceNumber: string;
  invoiceDate: string | null;
  dueDate: string | null;
  amount: number;
  status: 'pending' | 'billed' | 'paid' | 'overdue' | 'disputed';
  billedDate: string | null;
  paidDate: string | null;
  documents: {
    type: 'bol' | 'pod' | 'invoice' | 'lumper' | 'detention' | 'other';
    url: string;
    uploadedAt: string;
  }[];
  notes: string;
  quickPayAvailable: boolean;
  quickPayFee: number;
  factored: boolean;
}

export interface AccountReceivable {
  id: string;
  loadId: string;
  brokerId: string;
  broker: Broker;
  rateConfirmation: string;
  amount: number;
  pickupDate: string;
  deliveryDate: string;
  status: BillingStatus;
  additionalCharges: {
    type: 'detention' | 'lumper' | 'tonu' | 'other';
    amount: number;
    description: string;
    approved: boolean;
  }[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
