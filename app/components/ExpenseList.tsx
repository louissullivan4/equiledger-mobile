// ExpenseList.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface Expense {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  receipt_image_url: string;
  created_at: string;
  updated_at: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: number) => Promise<void>;
  expandedExpenseIds: number[];
  toggleExpand: (id: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onDeleteExpense, 
  expandedExpenseIds, 
  toggleExpand 
}) => {
  
  // We'll get navigation from a hook for convenience
  const navigation = useNavigation<NavigationProp<any>>();

  // Left swipe (Edit)
  const renderLeftActions = (expense: Expense) => {
    return (
      <View style={styles.editContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(expense)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Right swipe (Delete)
  const renderRightActions = (expenseId: number) => {
    return (
      <View style={styles.deleteContainer}>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(expenseId)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Called when user taps "Edit" after swiping right
  const handleEdit = (expense: Expense) => {
    if (expense.category === 'income') {
      console.log('Navigating to CreateIncome');
      navigation.navigate('CreateIncome', { expenseToEdit: expense });
    } else {
      navigation.navigate('NewExpense', { expenseToEdit: expense });
    }
  };

  // Called when user taps "Delete" after swiping left
  const handleDelete = async (expenseId: number) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await onDeleteExpense(expenseId);
            } catch (err: any) {
              Alert.alert('Delete Failed', err.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View>
      {expenses.map((expense) => (
        <ReanimatedSwipeable
          key={expense.id}
          // Render left actions for "Edit"
          renderLeftActions={() => renderLeftActions(expense)}
          // Render right actions for "Delete"
          renderRightActions={() => renderRightActions(expense.id)}
          overshootRight={false}
          overshootLeft={false}
        >
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => toggleExpand(expense.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{expense.title}</Text>
              <Text style={styles.amount}>
                {expense.amount} {expense.currency}
              </Text>
            </View>
            <Text style={styles.date}>
              {new Date(expense.created_at).toLocaleDateString()}
            </Text>
            {expandedExpenseIds.includes(expense.id) && (
              <View style={styles.expandedSection}>
                <Text style={styles.description}>{expense.description}</Text>
                <Text style={styles.category}>Category: {expense.category}</Text>
              </View>
            )}
          </TouchableOpacity>
        </ReanimatedSwipeable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007BFF',
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  expandedSection: {
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },

  // Left (Edit) styles
  editContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500', // orange for "Edit"
    width: 80,
    borderRadius: 10,
    marginBottom: 15,
  },
  editButton: {
    padding: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Right (Delete) styles
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4d4f',
    width: 80,
    borderRadius: 10,
    marginBottom: 15,
    
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExpenseList;
