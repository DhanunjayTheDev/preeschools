import { useEffect, useState } from 'react';
import useFeeStore from '../../stores/feeStore';
import useStudentStore from '../../stores/studentStore';
import useAuthStore from '../../stores/authStore';
import { Button, Card, Table, Badge, Modal, Input, DropdownTable, Pagination, ActionButton, ConfirmDialog } from '../../components/ui';
import { CLASSES, formatCurrency, formatDate, PAYMENT_STATUSES, getStatusColor } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi_bank',      label: 'UPI (Bank)',          icon: '📲', chargeRate: 0.02,  chargeLabel: '~2% + GST' },
  { id: 'upi_credit',   label: 'UPI (Credit Card)',   icon: '💳', chargeRate: 0.035, chargeLabel: '~3.5% + GST' },
  { id: 'card_india',   label: 'Debit/Credit Card',   icon: '🏧', chargeRate: 0.02,  chargeLabel: '~2% + GST' },
  { id: 'international',label: 'International Card',  icon: '🌍', chargeRate: 0.03,  chargeLabel: '~3% + GST' },
  { id: 'netbanking',   label: 'Net Banking',         icon: '🏦', chargeRate: 0.02,  chargeLabel: '~2% + GST' },
  { id: 'wallet',       label: 'Wallets',             icon: '👛', chargeRate: 0.02,  chargeLabel: '~2% + GST' },
];

export default function Fees() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  
  const {
    feePlans, assignments, payments, stats, pagination, loading,
    fetchFeePlans, createFeePlan, updateFeePlan, deleteFeePlan, fetchAssignments, fetchPayments,
    assignFeePlan, recordPayment, fetchStats, downloadReceipt, fetchStudentPayments,
  } = useFeeStore();
  
  const { students, fetchStudents } = useStudentStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [paymentLinkMethod, setPaymentLinkMethod] = useState('whatsapp');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [selectedInstallmentIdx, setSelectedInstallmentIdx] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [planForm, setPlanForm] = useState({
    name: '', className: '', academicYear: '2025-26', type: 'INSTALLMENT',
    totalAmount: '', installments: [{ label: 'Term 1', amount: '', dueDate: '' }],
  });

  const [assignForm, setAssignForm] = useState({ studentId: '', feePlanId: '' });
  const [paymentForm, setPaymentForm] = useState({ feeAssignmentId: '', amount: '', method: 'CASH', notes: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ planId: null, planName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchFeePlans();
    fetchStudents();
  }, [fetchStats, fetchFeePlans, fetchStudents]);

  useEffect(() => {
    if (activeTab === 'assignments') fetchAssignments();
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab, fetchAssignments, fetchPayments]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await createFeePlan({ ...planForm, totalAmount: Number(planForm.totalAmount), installments: planForm.installments.map((i) => ({ ...i, amount: Number(i.amount) })) });
      toast.success(`✅ Fee plan "${planForm.name}" created successfully`);
      setShowCreatePlan(false);
      setPlanForm({ name: '', className: '', academicYear: '2025-26', type: 'INSTALLMENT', totalAmount: '', installments: [{ label: 'Term 1', amount: '', dueDate: '' }] });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanForm({
      name: plan.name,
      className: plan.className,
      academicYear: plan.academicYear,
      type: plan.type,
      totalAmount: plan.totalAmount,
      installments: plan.installments || [{ label: 'Term 1', amount: '', dueDate: '' }],
    });
    setShowEditPlan(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      await updateFeePlan(selectedPlan._id, {
        ...planForm,
        totalAmount: Number(planForm.totalAmount),
        installments: planForm.installments.map((i) => ({ ...i, amount: Number(i.amount) })),
      });
      toast.success(`✏️ Fee plan "${planForm.name}" updated successfully`);
      setShowEditPlan(false);
      setSelectedPlan(null);
      setPlanForm({ name: '', className: '', academicYear: '2025-26', type: 'INSTALLMENT', totalAmount: '', installments: [{ label: 'Term 1', amount: '', dueDate: '' }] });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const handleDeletePlanClick = (id, name) => {
    setConfirmData({ planId: id, planName: name });
    setShowConfirm(true);
  };

  const handleDeletePlanConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteFeePlan(confirmData.planId);
      toast.success(`🗑️ Fee plan "${confirmData.planName}" deleted successfully`);
      setShowConfirm(false);
      setConfirmData({ planId: null, planName: '' });
      fetchFeePlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete fee plan');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.studentId || !assignForm.feePlanId) {
      toast.error('Please select both a student and a fee plan');
      return;
    }
    try {
      await assignFeePlan(assignForm.studentId, assignForm.feePlanId);
      const student = students.find(s => s._id === assignForm.studentId);
      const plan = feePlans.find(p => p._id === assignForm.feePlanId);
      toast.success(`✅ Fee plan "${plan?.name}" assigned to "${student?.name}" successfully`);
      setShowAssign(false);
      setAssignForm({ studentId: '', feePlanId: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await recordPayment({ ...paymentForm, amount: Number(paymentForm.amount) });
      const assignment = assignments.find(a => a._id === paymentForm.feeAssignmentId);
      toast.success(`✅ Payment of ${formatCurrency(paymentForm.amount)} recorded for "${assignment?.studentData?.name}" successfully`);
      setShowPayment(false);
      setPaymentForm({ feeAssignmentId: '', amount: '', method: 'CASH', notes: '' });
      fetchStats();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleGeneratePaymentLink = async () => {
    if (!selectedAssignment) return;
    if (!selectedPaymentMethod) { toast.error('Please select a payment method'); return; }
    const hasSchedule = selectedAssignment.schedule?.length > 0;
    if (hasSchedule && selectedInstallmentIdx === null) { toast.error('Please select an installment to send the link for'); return; }
    setGeneratingLink(true);
    try {
      await api.post(`/fees/payment-link/${selectedAssignment._id}/generate`, {
        sendVia: paymentLinkMethod,
        installmentIdx: selectedInstallmentIdx,
        paymentMethod: selectedPaymentMethod,
      });
      toast.success(`✅ Payment link sent via ${paymentLinkMethod}!`);
      setShowPaymentLink(false);
      setSelectedAssignment(null);
      setSelectedInstallmentIdx(null);
      setSelectedPaymentMethod(null);
      setGeneratingLink(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate link');
      setGeneratingLink(false);
    }
  };

  const addInstallment = () => {
    setPlanForm({
      ...planForm,
      installments: [...planForm.installments, { label: '', amount: '', dueDate: '' }],
    });
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      await downloadReceipt(paymentId);
      toast.success('Receipt downloaded');
    } catch { toast.error('Failed to download receipt'); }
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'plans', label: '📋 Fee Plans' },
    { key: 'assignments', label: '📑 Assignments' },
    { key: 'payments', label: '💳 Payments' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Finance</p>
            <h1 className="text-4xl font-bold mb-2">Fee Management</h1>
            <p className="text-emerald-50 text-sm">Manage fees, payments, and generate payment links</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-6xl opacity-20">💰</div>
            <div className="flex flex-col gap-2">
              {isSuperAdmin ? (
                <>
                  <ActionButton onClick={() => setShowCreatePlan(true)} color="emerald">+ Fee Plan</ActionButton>
                  <div className="flex gap-2">
                    <ActionButton onClick={() => setShowAssign(true)} color="emerald" size="sm">Assign</ActionButton>
                    <ActionButton onClick={() => setShowPayment(true)} color="emerald" size="sm">Record 💳</ActionButton>
                  </div>
                </>
              ) : (
                <>
                  <ActionButton onClick={() => setShowAssign(true)} color="emerald">Assign</ActionButton>
                  <ActionButton onClick={() => setShowPayment(true)} color="emerald" size="sm">Record 💳</ActionButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 p-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Total Collected</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{formatCurrency(stats?.totalCollected || 0)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Total Due</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{formatCurrency(stats?.totalDue || 0)}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium">Overdue Students</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats?.overdueCount || 0}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <Card>
          <Table
            columns={[
              { key: 'name', label: 'Plan Name' },
              { key: 'className', label: 'Class' },
              { key: 'academicYear', label: 'Year' },
              { key: 'type', label: 'Type' },
              { key: 'totalAmount', label: 'Amount', render: (r) => <span className="font-semibold text-blue-600">{formatCurrency(r.totalAmount)}</span> },
              { key: 'installments', label: 'Installments', render: (r) => <Badge color="blue">{r.installments?.length || 0}</Badge> },
              { key: 'actions', label: '', render: (r) => (
                <div className="flex gap-2">
                  {isSuperAdmin && (
                    <>
                      <button onClick={() => handleEditPlan(r)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">✏️ Edit</button>
                      <button onClick={() => handleDeletePlanClick(r._id, r.name)} className="text-red-600 hover:text-red-800 text-sm font-medium">🗑️ Delete</button>
                    </>
                  )}
                  {!isSuperAdmin && (
                    <span className="text-xs text-gray-400">View only</span>
                  )}
                </div>
              )},
            ]}
            data={feePlans}
            loading={loading}
          />
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <Card>
          <Table
            columns={[
              { key: 'student', label: 'Student', render: (r) => r.studentData?.name || '-' },
              { key: 'studentId', label: 'ID', render: (r) => r.studentData?.studentId },
              { key: 'class', label: 'Class', render: (r) => r.studentData?.className },
              { key: 'totalAmount', label: 'Total', render: (r) => <span className="font-medium">{formatCurrency(r.totalAmount)}</span> },
              { key: 'dueAmount', label: 'Due', render: (r) => <span className="text-red-600 font-semibold">{formatCurrency(r.dueAmount)}</span> },
              { key: 'status', label: 'Status', render: (r) => <Badge color={getStatusColor(r.status, PAYMENT_STATUSES)}>{r.status}</Badge> },
              { key: 'actions', label: '', render: (r) => (
                <Button size="sm" variant="secondary" onClick={() => { setSelectedAssignment(r); setShowPaymentLink(true); }}>🔗 Send Link</Button>
              )},
            ]}
            data={assignments}
            loading={loading}
          />
          <Pagination pagination={pagination} onPageChange={(p) => fetchAssignments({ page: p })} />
        </Card>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <Card>
          <Table
            columns={[
              { key: 'receiptNumber', label: 'Receipt #' },
              { key: 'student', label: 'Student', render: (r) => r.student?.name },
              { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
              { key: 'method', label: 'Method', render: (r) => <Badge color="blue">{r.method}</Badge> },
              { key: 'status', label: 'Status' },
              { key: 'paidAt', label: 'Date', render: (r) => formatDate(r.paidAt) },
              { key: 'actions', label: '', render: (r) => (
                <Button size="sm" variant="secondary" onClick={() => handleDownloadReceipt(r._id)}>📥 Receipt</Button>
              )},
            ]}
            data={payments}
            loading={loading}
          />
          <Pagination pagination={pagination} onPageChange={(p) => fetchPayments({ page: p })} />
        </Card>
      )}

      {/* Gen Payment Link Modal */}
      {(() => {
        const schedule = selectedAssignment?.schedule || [];
        const hasSchedule = schedule.length > 0;
        const selectedInst = selectedInstallmentIdx !== null ? schedule[selectedInstallmentIdx] : null;
        const baseAmount = selectedInst
          ? selectedInst.amount - (selectedInst.paidAmount || 0)
          : (selectedAssignment?.dueAmount || 0);
        const selMethod = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
        const charges = selMethod ? Math.ceil(baseAmount * selMethod.chargeRate) : 0;
        const gstOnCharges = Math.ceil(charges * 0.18);
        const totalPayable = baseAmount + charges + gstOnCharges;
        const canSend = selectedPaymentMethod && (!hasSchedule || selectedInstallmentIdx !== null);

        return (
          <Modal
            isOpen={showPaymentLink}
            onClose={() => { setShowPaymentLink(false); setSelectedAssignment(null); setSelectedInstallmentIdx(null); setSelectedPaymentMethod(null); }}
            title="🔗 Send Payment Link"
            size="lg"
            footer={<>
              <Button variant="secondary" onClick={() => { setShowPaymentLink(false); setSelectedAssignment(null); setSelectedInstallmentIdx(null); setSelectedPaymentMethod(null); }}>Cancel</Button>
              <Button onClick={handleGeneratePaymentLink} disabled={generatingLink || !canSend} className="bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-50">
                {generatingLink ? '⏳ Sending...' : '🚀 Generate & Send Link'}
              </Button>
            </>}
          >
            <div className="space-y-5">
              {/* Student Info */}
              {selectedAssignment && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Student</p>
                    <p className="font-bold text-gray-900 text-base">{selectedAssignment.studentData?.name}</p>
                    <p className="text-xs text-gray-500">{selectedAssignment.studentData?.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Outstanding</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(selectedAssignment.dueAmount)}</p>
                    <p className="text-xs text-gray-400">{selectedAssignment.feePlanData?.type || selectedAssignment.planType || ''}</p>
                  </div>
                </div>
              )}

              {/* Installment Selection */}
              {hasSchedule ? (
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">📋 Select Installment <span className="text-red-500">*</span></p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {schedule.map((inst, idx) => {
                      const isPaid = inst.status === 'PAID';
                      const isPartial = inst.status === 'PARTIAL';
                      const isSelected = selectedInstallmentIdx === idx;
                      const remaining = inst.amount - (inst.paidAmount || 0);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => !isPaid && setSelectedInstallmentIdx(idx)}
                          disabled={isPaid}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                            isPaid
                              ? 'border-green-200 bg-green-50 cursor-not-allowed'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50 shadow ring-2 ring-blue-200'
                              : 'border-orange-300 bg-orange-50 hover:border-orange-500 cursor-pointer hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">
                                {isPaid ? '✅' : isPartial ? '⚡' : '⏳'}
                              </span>
                              <div>
                                <p className={`font-semibold text-sm ${isPaid ? 'text-green-700' : isSelected ? 'text-blue-700' : 'text-orange-700'}`}>
                                  {inst.label}
                                  {isPaid && <span className="ml-2 text-xs font-normal bg-green-100 text-green-600 px-2 py-0.5 rounded-full">PAID</span>}
                                  {isPartial && <span className="ml-2 text-xs font-normal bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">PARTIAL</span>}
                                  {!isPaid && !isPartial && <span className="ml-2 text-xs font-normal bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">PENDING</span>}
                                </p>
                                {inst.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {formatDate(inst.dueDate)}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                {formatCurrency(inst.amount)}
                              </p>
                              {(isPartial && !isPaid) && (
                                <p className="text-xs text-orange-500">Remaining: {formatCurrency(remaining)}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  ⚠️ No installment schedule. Full due amount <strong>{formatCurrency(selectedAssignment?.dueAmount)}</strong> will be used.
                </div>
              )}

              {/* Payment Method Selection */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">💳 Payment Method <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(Parent can only pay via this method)</span></p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50 shadow ring-2 ring-blue-200'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      <div className="text-lg mb-1">{method.icon}</div>
                      <p className={`font-semibold text-xs ${selectedPaymentMethod === method.id ? 'text-blue-800' : 'text-gray-800'}`}>{method.label}</p>
                      <p className={`text-xs mt-0.5 ${selectedPaymentMethod === method.id ? 'text-blue-500' : 'text-gray-400'}`}>{method.chargeLabel}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              {selMethod && (!hasSchedule || selectedInstallmentIdx !== null) && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">💰 Amount Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Installment Amount</span>
                      <span className="font-medium text-gray-900">{formatCurrency(baseAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Processing Charges ({selMethod.chargeLabel.split(' ')[0]})</span>
                      <span className="font-medium text-orange-600">+ {formatCurrency(charges)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">GST on Charges (18%)</span>
                      <span className="font-medium text-orange-600">+ {formatCurrency(gstOnCharges)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-1 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Payable by Parent</span>
                      <span className="font-bold text-blue-700 text-lg">{formatCurrency(totalPayable)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Via */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">📤 Send Link Via</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: '💬', active: 'border-green-500 bg-green-50 text-green-700', hover: 'hover:border-green-300' },
                    { id: 'sms',      label: 'SMS',       icon: '📱', active: 'border-blue-500 bg-blue-50 text-blue-700',   hover: 'hover:border-blue-300' },
                    { id: 'both',     label: 'Both',      icon: '✉️', active: 'border-purple-500 bg-purple-50 text-purple-700', hover: 'hover:border-purple-300' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentLinkMethod(opt.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-center font-medium text-sm ${
                        paymentLinkMethod === opt.id ? opt.active : `border-gray-200 bg-white text-gray-600 ${opt.hover}`
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Edit Fee Plan Modal - Only for SUPER_ADMIN */}
      {isSuperAdmin && (
      <Modal isOpen={showEditPlan} onClose={() => { setShowEditPlan(false); setSelectedPlan(null); }} title="Edit Fee Plan" size="lg"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => { setShowEditPlan(false); setSelectedPlan(null); }}>Cancel</Button>
          <Button type="submit" form="edit-plan-form" className="bg-gradient-to-r from-blue-500 to-blue-600">Update Plan</Button>
        </>}
      >
        <form id="edit-plan-form" onSubmit={handleUpdatePlan} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Plan Name" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g., Term 1 Plan" required />
            <DropdownTable
              label="Class"
              value={planForm.className}
              onChange={(val) => setPlanForm({ ...planForm, className: val })}
              placeholder="Select Class"
              icon="🏫"
              options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))}
              columns={[{ key: 'label', label: 'Available Classes' }]}
              required
            />
            <Input label="Academic Year" value={planForm.academicYear} onChange={(e) => setPlanForm({ ...planForm, academicYear: e.target.value })} />
            <DropdownTable
              label="Plan Type"
              value={planForm.type}
              onChange={(val) => setPlanForm({ ...planForm, type: val })}
              placeholder="Select Type"
              icon="📊"
              options={[
                { value: 'INSTALLMENT', label: 'Installment Based', searchFields: ['installment'] },
                { value: 'MONTHLY', label: 'Monthly Payment', searchFields: ['monthly'] }
              ]}
              columns={[{ key: 'label', label: 'Payment Type' }]}
            />
            <Input label="Total Amount" type="number" value={planForm.totalAmount} onChange={(e) => setPlanForm({ ...planForm, totalAmount: e.target.value })} placeholder="Enter total fees" required />
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Installment Schedule</h4>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {planForm.installments.map((inst, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input placeholder="Label (e.g., Term 1)" value={inst.label} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].label = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                  <Input type="number" placeholder="Amount" value={inst.amount} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].amount = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                  <Input type="date" value={inst.dueDate} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].dueDate = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addInstallment} className="mt-3">+ Add Installment</Button>
          </div>
        </form>
      </Modal>
      )}

      {/* Create Fee Plan Modal - Only for SUPER_ADMIN */}
      {isSuperAdmin && (
      <Modal isOpen={showCreatePlan} onClose={() => setShowCreatePlan(false)} title="Create New Fee Plan" size="lg"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreatePlan(false)}>Cancel</Button>
          <Button type="submit" form="create-plan-form" className="bg-gradient-to-r from-blue-500 to-blue-600">Create Plan</Button>
        </>}
      >
        <form id="create-plan-form" onSubmit={handleCreatePlan} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Plan Name" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g., Term 1 Plan" required />
            <DropdownTable
              label="Class"
              value={planForm.className}
              onChange={(val) => setPlanForm({ ...planForm, className: val })}
              placeholder="Select Class"
              icon="🏫"
              options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))}
              columns={[{ key: 'label', label: 'Available Classes' }]}
              required
            />
            <Input label="Academic Year" value={planForm.academicYear} onChange={(e) => setPlanForm({ ...planForm, academicYear: e.target.value })} />
            <DropdownTable
              label="Plan Type"
              value={planForm.type}
              onChange={(val) => setPlanForm({ ...planForm, type: val })}
              placeholder="Select Type"
              icon="📊"
              options={[
                { value: 'INSTALLMENT', label: 'Installment Based', searchFields: ['installment'] },
                { value: 'MONTHLY', label: 'Monthly Payment', searchFields: ['monthly'] }
              ]}
              columns={[{ key: 'label', label: 'Payment Type' }]}
            />
            <Input label="Total Amount" type="number" value={planForm.totalAmount} onChange={(e) => setPlanForm({ ...planForm, totalAmount: e.target.value })} placeholder="Enter total fees" required />
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Installment Schedule</h4>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {planForm.installments.map((inst, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input placeholder="Label (e.g., Term 1)" value={inst.label} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].label = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                  <Input type="number" placeholder="Amount" value={inst.amount} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].amount = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                  <Input type="date" value={inst.dueDate} onChange={(e) => { const insts = [...planForm.installments]; insts[idx].dueDate = e.target.value; setPlanForm({ ...planForm, installments: insts }); }} />
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addInstallment} className="mt-3">+ Add Installment</Button>
          </div>

        </form>
      </Modal>
      )}

      {/* Assign Fee Plan Modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Fee Plan to Student" size="md"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowAssign(false)}>Cancel</Button>
          <Button type="submit" form="assign-plan-form" className="bg-gradient-to-r from-emerald-500 to-emerald-600">Assign Plan</Button>
        </>}
      >
        <form id="assign-plan-form" onSubmit={handleAssign} className="space-y-4">
          <DropdownTable
            label="Select Student"
            value={assignForm.studentId}
            onChange={(val) => setAssignForm({ ...assignForm, studentId: val })}
            placeholder="Search student by name or ID"
            icon="👨‍🎓"
            searchable={true}
            columns={[
              { key: 'name', label: 'Student Name' },
              { key: 'studentId', label: 'ID' },
              { key: 'className', label: 'Class' }
            ]}
            options={students.map((s) => ({
              value: s._id,
              label: s.name,
              name: s.name,
              studentId: s.studentId,
              className: s.className,
              searchFields: [s.name, s.studentId, s.className]
            }))}
            required
          />
          <DropdownTable
            label="Select Fee Plan"
            value={assignForm.feePlanId}
            onChange={(val) => setAssignForm({ ...assignForm, feePlanId: val })}
            placeholder="Search fee plan"
            icon="📋"
            searchable={true}
            columns={[
              { key: 'name', label: 'Plan Name' },
              { key: 'className', label: 'For Class' },
              { key: 'totalAmount', label: 'Amount', render: (opt) => formatCurrency(opt.totalAmount) }
            ]}
            options={feePlans.map((p) => ({
              value: p._id,
              label: p.name,
              name: p.name,
              className: p.className,
              totalAmount: p.totalAmount,
              searchFields: [p.name, p.className, formatCurrency(p.totalAmount)]
            }))}
            required
          />
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Record Payment" size="md"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowPayment(false)}>Cancel</Button>
          <Button type="submit" form="record-payment-form" variant="success">Record Payment</Button>
        </>}
      >
        <form id="record-payment-form" onSubmit={handlePayment} className="space-y-4">
          <Input label="Fee Assignment ID *" value={paymentForm.feeAssignmentId} onChange={(e) => setPaymentForm({ ...paymentForm, feeAssignmentId: e.target.value })} placeholder="Paste assignment ID" required />
          <Input label="Amount Paid *" type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="Enter amount" required />
          <DropdownTable
            label="Payment Method"
            value={paymentForm.method}
            onChange={(val) => setPaymentForm({ ...paymentForm, method: val })}
            placeholder="Select payment method"
            icon="💳"
            columns={[{ key: 'label', label: 'Method', render: (opt) => opt.icon + ' ' + opt.label }]}
            options={[
              { value: 'CASH', label: 'Cash', icon: '💵', searchFields: ['cash', 'direct'] },
              { value: 'UPI', label: 'UPI', icon: '📱', searchFields: ['upi', 'digital'] },
              { value: 'CARD', label: 'Card', icon: '🎫', searchFields: ['card', 'credit', 'debit'] },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', searchFields: ['bank', 'transfer'] },
              { value: 'RAZORPAY', label: 'Razorpay', icon: '💳', searchFields: ['razorpay', 'online'] }
            ]}
          />
          <Input label="Additional Notes" value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} placeholder="Optional notes" />
        </form>
      </Modal>
    </div>
  );
}
