import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { AccountReceivable } from '../types/billing';
import { debug } from '../utils/debug';

const AccountReceivables: React.FC = () => {
  const [receivables, setReceivables] = useState<AccountReceivable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnbilled, setTotalUnbilled] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // This will be replaced with actual API call
      const mockData: AccountReceivable[] = [
        {
          id: 'ar_1',
          loadId: 'load_1',
          brokerId: 'broker_1',
          broker: {
            id: 'broker_1',
            name: 'John Broker',
            company: 'ABC Logistics',
            email: 'john@abclogistics.com',
            phone: '123-456-7890',
            paymentTerms: 30,
            mc: 'MC123456'
          },
          rateConfirmation: 'RC123456',
          amount: 2500,
          pickupDate: '2024-02-20T14:00:00Z',
          deliveryDate: '2024-02-21T14:00:00Z',
          status: {
            id: 'status_1',
            loadId: 'load_1',
            invoiceNumber: 'INV-2024-001',
            invoiceDate: '2024-02-21',
            dueDate: '2024-03-22',
            amount: 2500,
            status: 'pending',
            billedDate: null,
            paidDate: null,
            documents: [],
            notes: '',
            quickPayAvailable: true,
            quickPayFee: 50,
            factored: false
          },
          additionalCharges: [
            {
              type: 'detention',
              amount: 150,
              description: '3 hours detention at delivery',
              approved: true
            }
          ],
          totalAmount: 2650,
          createdAt: '2024-02-21T14:00:00Z',
          updatedAt: '2024-02-21T14:00:00Z'
        },
        // Add more mock data as needed
      ];

      setReceivables(mockData);
      calculateTotals(mockData);
    } catch (error) {
      debug.error('AccountReceivables', 'Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (data: AccountReceivable[]) => {
    const unbilled = data
      .filter(r => r.status.status === 'pending')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const overdue = data
      .filter(r => r.status.status === 'overdue')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    setTotalUnbilled(unbilled);
    setTotalOverdue(overdue);
  };

  const columns = [
    {
      header: 'Load Info',
      accessor: (ar: AccountReceivable) => (
        <div>
          <div className="font-medium text-gray-900">
            Load #{ar.loadId}
          </div>
          <div className="text-sm text-gray-500">
            RC: {ar.rateConfirmation}
          </div>
        </div>
      )
    },
    {
      header: 'Broker',
      accessor: (ar: AccountReceivable) => (
        <div>
          <div className="font-medium text-gray-900">
            {ar.broker.company}
          </div>
          <div className="text-sm text-gray-500">
            MC: {ar.broker.mc}
          </div>
        </div>
      )
    },
    {
      header: 'Dates',
      accessor: (ar: AccountReceivable) => (
        <div>
          <div className="text-sm">
            Pickup: {new Date(ar.pickupDate).toLocaleDateString()}
          </div>
          <div className="text-sm">
            Delivery: {new Date(ar.deliveryDate).toLocaleDateString()}
          </div>
          {ar.status.dueDate && (
            <div className="text-xs text-gray-500">
              Due: {new Date(ar.status.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Amount',
      accessor: (ar: AccountReceivable) => (
        <div>
          <div className="font-medium text-gray-900">
            ${ar.totalAmount.toLocaleString()}
          </div>
          {ar.additionalCharges.length > 0 && (
            <div className="text-xs text-gray-500">
              +${ar.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0).toLocaleString()} extras
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (ar: AccountReceivable) => (
        <div className="space-y-1">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${ar.status.status === 'paid' ? 'bg-success/10 text-success' :
              ar.status.status === 'overdue' ? 'bg-error/10 text-error' :
              ar.status.status === 'billed' ? 'bg-primary/10 text-primary' :
              'bg-gray-100 text-gray-800'}
          `}>
            {ar.status.status.charAt(0).toUpperCase() + ar.status.status.slice(1)}
          </span>
          {ar.status.quickPayAvailable && (
            <div className="text-xs text-success">
              Quick Pay Available
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (ar: AccountReceivable) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={ar.status.status === 'pending' ? 'primary' : 'secondary'}
            onClick={() => console.log('Generate invoice:', ar.id)}
          >
            {ar.status.status === 'pending' ? 'Bill Now' : 'View'}
          </Button>
          {ar.status.quickPayAvailable && (
            <Button
              size="sm"
              variant="success"
              onClick={() => console.log('Quick pay:', ar.id)}
            >
              Quick Pay
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Account Receivables</h1>
          <p className="mt-1 text-gray-500">
            Manage your invoices and track payments
          </p>
        </div>
        <Button
          onClick={() => console.log('Export data')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="text-sm text-gray-500">Total Unbilled</div>
          <div className="text-2xl font-semibold text-primary mt-1">
            ${totalUnbilled.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="text-sm text-gray-500">Total Overdue</div>
          <div className="text-2xl font-semibold text-error mt-1">
            ${totalOverdue.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="text-sm text-gray-500">Average Days to Pay</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            32 days
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow p-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search loads, brokers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="billed">Billed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            placeholder="Start Date"
          />

          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            placeholder="End Date"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Table
          columns={columns}
          data={receivables}
          isLoading={isLoading}
          onRowClick={(ar) => console.log('Row clicked:', ar)}
          emptyMessage="No receivables found."
        />
      </motion.div>
    </div>
  );
};

export default AccountReceivables;
