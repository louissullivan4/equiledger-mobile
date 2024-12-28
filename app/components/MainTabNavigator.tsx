import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/Homescreen';
import ExpenseScreen from '../screens/Expensescreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import IncomeScreen from '../screens/Incomescreen';
import CreateIncome from '../screens/CreateIncomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

type User = {
  name: string;
  email: string;
  token: string;
};

type MainTabNavigatorProps = {
  user: User;
  setUser: (user: User) => void;
};

const Tab = createBottomTabNavigator();
const ExpenseStack = createStackNavigator();
const IncomeStack = createStackNavigator();

// --- Option B: Pass stack navigation to the screen via the render prop ---
function ExpenseStackNavigator({ user }: { user: User }) {
  return (
    <ExpenseStack.Navigator screenOptions={{ headerShown: false }}>
      <ExpenseStack.Screen name="ExpenseMain">
        {(stackProps) => (
          <ExpenseScreen 
            {...stackProps}
            user={user} 
          />
        )}
      </ExpenseStack.Screen>
      <ExpenseStack.Screen name="NewExpense">
        {(stackProps) => (
          <CreateExpenseScreen 
            {...stackProps}
            user={user} 
          />
        )}
      </ExpenseStack.Screen>
    </ExpenseStack.Navigator>
  );
}

function IncomeStackNavigator({ user }: { user: User }) {
  return (
    <IncomeStack.Navigator screenOptions={{ headerShown: false }}>
      <IncomeStack.Screen name="IncomeMain">
        {(stackProps) => (
          <IncomeScreen 
            {...stackProps} 
            user={user} 
          />
        )}
      </IncomeStack.Screen>
      <IncomeStack.Screen name="CreateIncome">
        {(stackProps) => (
          <CreateIncome 
            {...stackProps} 
            user={user} 
          />
        )}
      </IncomeStack.Screen>
    </IncomeStack.Navigator>
  );
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ user, setUser }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'ExpenseStack':
              iconName = 'receipt-long';
              break;
            case 'IncomeStack':
              iconName = 'account-balance-wallet';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D7CBED',
        tabBarInactiveTintColor: '#B59CE0',
        headerShown: false,
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} user={user} setUser={setUser} />}
      </Tab.Screen>

      <Tab.Screen
        name="ExpenseStack"
        options={{ title: 'Expense' }}
      >
        {(props) => <ExpenseStackNavigator {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="IncomeStack"
        options={{ title: 'Income' }}
      >
        {(props) => <IncomeStackNavigator {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} user={user} setUser={setUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
