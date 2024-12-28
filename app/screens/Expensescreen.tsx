// ExpenseScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import GenericTopBar from '../components/GenericTopBar';
import ExpenseList from '../components/ExpenseList';
import Constants from 'expo-constants';
import { jwtDecode } from 'jwt-decode';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL ?? '';

interface ExpenseScreenProps {
  navigation: NavigationProp<any>;
  user: { token: string };
}

// Define a type for your Expense
interface Expense {
  id: number;
  created_at: string;
  user_id: number;
  updated_at: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  receipt_image_url: string;
}

const ExpenseScreen = ({ navigation, user }: ExpenseScreenProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [expandedExpenseIds, setExpandedExpenseIds] = useState<number[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all time');
  const [sortOption, setSortOption] = useState('date-latest');

  useFocusEffect(
    React.useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    setLoading(true);
    try {
      const expenseData = await getUserExpenses(user.token);
      setExpenses(expenseData);
    } catch (error: any) {
      Alert.alert('User Expense Request Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId: number) => {
    try {
      const response = await fetch(`${SERVER_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense.');
      }
      setExpenses((prevExpenses) => prevExpenses.filter(e => e.id !== expenseId));
    } catch (error: any) {
      throw error;
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedExpenseIds.includes(id)) {
      setExpandedExpenseIds(expandedExpenseIds.filter(expenseId => expenseId !== id));
    } else {
      setExpandedExpenseIds([...expandedExpenseIds, id]);
    }
  };

  const resetFilters = () => {
    setSelectedDateFilter('all time');
    setSortOption('date-latest');
  };

  // Use the safe array (expenses ?? [])
  const filteredAndSortedExpenses = (expenses ?? [])
    .filter(expense => {
      const now = new Date();
      const createdAt = new Date(expense.created_at);

      switch (selectedDateFilter) {
        case 'day':
          return createdAt.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return createdAt >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return createdAt >= monthAgo;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return createdAt >= yearAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (sortOption === 'date-latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOption === 'date-earliest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortOption === 'amount-high-low') {
        return b.amount - a.amount;
      } else if (sortOption === 'amount-low-high') {
        return a.amount - b.amount;
      }
      return 0;
    });

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <GenericTopBar heightPercentage={9} title={'Expenses'} />

      <ScrollView contentContainerStyle={styles.mainContainer}>
        <ExpenseList
          expenses={filteredAndSortedExpenses}
          onDeleteExpense={deleteExpense}
          expandedExpenseIds={expandedExpenseIds}
          toggleExpand={toggleExpand}
        />
      </ScrollView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => navigation.navigate('NewExpense')}>
          <Text style={styles.filterButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isFilterModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Expenses</Text>
            {/* Filter & Sort Buttons */}
            {/* ... */}
            <View style={styles.buttonGroup}>
              <Button title="Reset" onPress={resetFilters} />
              <Button title="Close" onPress={() => setIsFilterModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Updated to ensure data.expenses is an array
async function getUserExpenses(token: string): Promise<Expense[]> {
  try {
    const decodedToken: any = jwtDecode(token);
    const { userId, role } = decodedToken;
    const response = await fetch(`${SERVER_URL}/expenses/users/income/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch expenses.');
    }
    const data = await response.json();
    return data || [];
  } catch (error: any) {
    throw error;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  mainContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  addExpenseButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default ExpenseScreen;
