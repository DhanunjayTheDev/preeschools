import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, Button, LoadingScreen, Divider } from '../../components/ui';
import api from '../../lib/api';

export default function FeeDetailScreen({ route, navigation }) {
  const { assignment } = route.params;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingLink, setGeneratingLink] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      const { data } = await api.get(`/fees/payments/student/${assignment.student?._id || assignment.student}`);
      setPayments(data.payments || data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [assignment]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handlePayOnline = async (installmentIdx) => {
    setGeneratingLink(true);
    try {
      const { data } = await api.post(`/fees/payment-link/${assignment._id}/generate`, {
        installmentIdx,
        paymentMethod: 'upi',
      });
      if (data.paymentLink?.short_url) {
        await Linking.openURL(data.paymentLink.short_url);
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
    } finally {
      setGeneratingLink(false);
    }
  };

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Summary card */}
        <Card className="mb-4">
          <View className="items-center mb-4">
            <Text className="text-sm text-gray-500">Total Fee</Text>
            <Text className="text-3xl font-bold text-gray-900">₹{assignment.totalAmount?.toLocaleString()}</Text>
          </View>
          <View className="flex-row">
            <View className="flex-1 items-center py-3 bg-green-50 rounded-xl mr-2">
              <Text className="text-xs text-green-600 mb-1">Paid</Text>
              <Text className="text-lg font-bold text-green-700">₹{assignment.paidAmount?.toLocaleString()}</Text>
            </View>
            <View className="flex-1 items-center py-3 bg-red-50 rounded-xl ml-2">
              <Text className="text-xs text-red-600 mb-1">Due</Text>
              <Text className="text-lg font-bold text-red-700">₹{assignment.dueAmount?.toLocaleString()}</Text>
            </View>
          </View>
        </Card>

        {/* Installments */}
        {assignment.schedule?.length > 0 && (
          <Card className="mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">Installments</Text>
            {assignment.schedule.map((inst, idx) => (
              <View key={idx} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Ionicons
                        name={inst.status === 'PAID' ? 'checkmark-circle' : 'time'}
                        size={18}
                        color={inst.status === 'PAID' ? '#16a34a' : '#f59e0b'}
                      />
                      <Text className="text-sm font-semibold text-gray-800 ml-2">{inst.label}</Text>
                    </View>
                    <Text className="text-xs text-gray-400 ml-7">
                      Due: {new Date(inst.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-gray-900">₹{inst.amount?.toLocaleString()}</Text>
                    <Badge variant={inst.status === 'PAID' ? 'success' : inst.status === 'PARTIAL' ? 'info' : 'warning'} className="mt-1">
                      {inst.status}
                    </Badge>
                  </View>
                </View>
                {inst.status !== 'PAID' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handlePayOnline(idx)}
                    loading={generatingLink}
                    className="mt-2 ml-7"
                    icon="card-outline"
                  >
                    Pay Online
                  </Button>
                )}
                {idx < assignment.schedule.length - 1 && <Divider />}
              </View>
            ))}
          </Card>
        )}

        {/* Payment History */}
        <Card className="mb-4">
          <Text className="text-base font-bold text-gray-900 mb-3">Payment History</Text>
          {loading ? (
            <View className="py-4 items-center">
              <Text className="text-sm text-gray-400">Loading payments...</Text>
            </View>
          ) : payments.length === 0 ? (
            <View className="py-4 items-center">
              <Ionicons name="receipt-outline" size={32} color="#d1d5db" />
              <Text className="text-sm text-gray-400 mt-2">No payments recorded yet</Text>
            </View>
          ) : (
            payments.map((payment) => (
              <View key={payment._id} className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                  <View className="w-9 h-9 rounded-full bg-green-50 items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={18} color="#16a34a" />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-gray-800">₹{payment.amount?.toLocaleString()}</Text>
                    <Text className="text-[10px] text-gray-400">
                      {payment.method} • {new Date(payment.paidAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-400">{payment.receiptNumber}</Text>
              </View>
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
}
