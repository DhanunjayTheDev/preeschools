import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, LoadingScreen, EmptyState } from '../../components/ui';
import api from '../../lib/api';

const statusColors = {
  PENDING: 'warning',
  PARTIAL: 'info',
  PAID: 'success',
  OVERDUE: 'danger',
};

export default function ParentFeesScreen({ navigation }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFees = useCallback(async () => {
    try {
      const { data } = await api.get('/fees/my-fees');
      // API returns { studentFees: [{ student, fees: [FeeAssignment] }] }
      const studentFees = data?.studentFees || [];
      const allAssignments = studentFees.flatMap((sf) =>
        (Array.isArray(sf.fees) ? sf.fees : []).map((fee) => ({
          ...fee,
          student: fee.student || sf.student,
        }))
      );
      setFees(allAssignments);
    } catch (error) {
      console.error('Error fetching fees:', error);
      setFees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFees();
  }, [fetchFees]);

  if (loading) return <LoadingScreen />;

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Fee Details</Text>

        {fees.length === 0 ? (
          <EmptyState icon="wallet-outline" title="No Fee Records" message="No fee assignments found for your children" />
        ) : (
          fees.map((assignment) => (
            <Card key={assignment._id} className="mb-4" onPress={() => navigation.navigate('FeeDetail', { assignment })}>
              {/* Student info */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">
                    {assignment.student?.name || 'Student'}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {assignment.feePlan?.name} • {assignment.academicYear}
                  </Text>
                </View>
                <Badge variant={statusColors[assignment.status] || 'default'}>
                  {assignment.status}
                </Badge>
              </View>

              {/* Amount summary */}
              <View className="bg-gray-50 rounded-xl p-3 mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-500">Total</Text>
                  <Text className="text-sm font-semibold text-gray-900">₹{assignment.totalAmount?.toLocaleString()}</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-500">Paid</Text>
                  <Text className="text-sm font-semibold text-green-600">₹{assignment.paidAmount?.toLocaleString()}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Due</Text>
                  <Text className="text-sm font-bold text-red-600">₹{assignment.dueAmount?.toLocaleString()}</Text>
                </View>
              </View>

              {/* Installments */}
              {assignment.schedule?.length > 0 && (
                <View>
                  <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">Installments</Text>
                  {assignment.schedule.map((inst, idx) => (
                    <View key={idx} className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <View className="flex-row items-center flex-1">
                        <View className={`w-2 h-2 rounded-full mr-2 ${inst.status === 'PAID' ? 'bg-green-500' : inst.status === 'PARTIAL' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        <View>
                          <Text className="text-sm text-gray-800">{inst.label}</Text>
                          <Text className="text-[10px] text-gray-400">
                            Due: {new Date(inst.dueDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-semibold text-gray-900">₹{inst.amount?.toLocaleString()}</Text>
                        {inst.paidAmount > 0 && (
                          <Text className="text-[10px] text-green-600">Paid: ₹{inst.paidAmount?.toLocaleString()}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Pay button */}
              {assignment.dueAmount > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('FeeDetail', { assignment })}
                  className="bg-primary-600 rounded-xl py-3 mt-3 items-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-semibold text-sm">View Payment Options</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}
