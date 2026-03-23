import { useEffect } from 'react';
import useFeeStore from '../../stores/feeStore';
import { Table, Loading } from '../../components/ui';
import { formatCurrency, formatDate, PAYMENT_STATUSES, getStatusColor } from '../../lib/utils';

const STATUS_STYLES = {
  PAID:     'bg-emerald-100 text-emerald-700',
  PENDING:  'bg-amber-100 text-amber-700',
  PARTIAL:  'bg-blue-100 text-blue-700',
  OVERDUE:  'bg-red-100 text-red-700',
  FAILED:   'bg-gray-100 text-gray-600',
};

export default function ParentFees() {
  const { assignments, payments, loading, fetchAssignments, fetchPayments } = useFeeStore();

  useEffect(() => {
    fetchAssignments();
    fetchPayments();
  }, [fetchAssignments, fetchPayments]);

  const totalDue  = assignments.reduce((s, a) => s + (a.dueAmount || 0), 0);
  const totalPaid = assignments.reduce((s, a) => s + (a.paidAmount || 0), 0);
  const total     = totalPaid + totalDue;
  const paidPct   = total > 0 ? Math.round((totalPaid / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Status</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track your fee payments and history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Fees</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Paid</span><span>{paidPct}%</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{width: `${paidPct}%`}} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wide mb-2">Paid</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
          <p className="text-sm text-emerald-200 mt-1">✓ Cleared</p>
        </div>
        <div className={`rounded-2xl p-5 text-white shadow-sm ${totalDue > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
          <p className="text-xs font-semibold text-red-200 uppercase tracking-wide mb-2">Due</p>
          <p className="text-2xl font-bold">{formatCurrency(totalDue)}</p>
          <p className="text-sm text-red-200 mt-1">{totalDue > 0 ? '⚠ Pending' : '✓ Clear'}</p>
        </div>
      </div>

      {/* Assignments table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Fee Assignments</h3>
        </div>
        {loading ? (
          <div className="p-8"><Loading /></div>
        ) : assignments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm">No fee assignments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {['Student','Plan','Total','Paid','Due','Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {assignments.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{r.studentData?.name || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{r.feePlan?.name || '-'}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{formatCurrency(r.totalAmount)}</td>
                    <td className="px-5 py-3.5 text-emerald-600 font-semibold">{formatCurrency(r.paidAmount)}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{color: r.dueAmount > 0 ? '#ef4444' : '#10b981'}}>{formatCurrency(r.dueAmount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || STATUS_STYLES.PENDING}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="text-3xl mb-2">💳</div>
            <p className="text-sm">No payments made yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {['Receipt #','Amount','Method','Status','Date'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-700">{r.receiptNumber || '-'}</td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{formatCurrency(r.amount)}</td>
                    <td className="px-5 py-3.5 text-gray-600 capitalize">{r.method?.toLowerCase() || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || STATUS_STYLES.PENDING}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(r.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
