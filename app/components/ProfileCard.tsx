import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { jwtDecode } from 'jwt-decode';

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL ?? '';
const screenHeight = Dimensions.get('window').height;

type User = {
  name: string;
  email: string;
  token: string;
};

interface HomeCardProps {
  heightPercentage: number;
  navigation: StackNavigationProp<any>;
  user: User;
}

// 1. Helper function to convert YYYY-MM-DD (or any valid date string) to DD-MM-YYYY
const formatDateDDMMYYYY = (dateString: string) => {
  const dateObj = new Date(dateString);
  // If it's not a valid date, just return the original
  if (isNaN(dateObj.getTime())) {
    return dateString;
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

const ProfileCard: React.FC<HomeCardProps> = ({ heightPercentage, navigation, user }) => {
  const height = screenHeight * (heightPercentage / 100);
  const [userInformation, setUserInformation] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const decodedToken: any = jwtDecode(user?.token);
        const { userId } = decodedToken;

        const response = await axios.get(`${SERVER_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setUserInformation(response.data);
          console.log('Success', 'User data fetched successfully: ', response.data);
        } else {
          console.log('Error', 'User data not fetched: ', response);
        }
      } catch (error) {
        console.log('Error', 'An error occurred while trying to fetch user', error);
      }
    };
    fetchUserInformation();
  }, [user]);

  const fieldsToDisplay = [
    { label: 'First Name', key: 'fname' },
    { label: 'Middle Name', key: 'mname' },
    { label: 'Surname', key: 'sname' },
    { label: 'Email', key: 'email' },
    { label: 'Date of Birth', key: 'date_of_birth' },
    { label: 'Phone Number', key: 'phone_number' },
    { label: 'PPSNO', key: 'ppsno' },
    { label: 'Occupation', key: 'occupation' },
    { label: 'Address Line 1', key: 'address_line1' },
    { label: 'Address Line 2', key: 'address_line2' },
    { label: 'City', key: 'city' },
    { label: 'County', key: 'county' },
    { label: 'Country', key: 'country' },
    { label: 'Postal Code', key: 'postal_code' },
    { label: 'Marital Status', key: 'marital_status' },
    { label: 'Tax Status', key: 'tax_status' },
  ];

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.titleText}>Profile</Text>
      {userInformation && (
        <ScrollView style={styles.tableContainer}>
          {fieldsToDisplay.map((field, index) => {
            const rowStyle = index % 2 === 0 ? styles.evenRow : styles.oddRow;
            
            // 2. If it's the date_of_birth key, we format the date. Otherwise, use original.
            let displayValue = userInformation[field.key] || '';
            if (field.key === 'date_of_birth' && displayValue) {
              displayValue = formatDateDDMMYYYY(displayValue);
            }
            
            return (
              <View key={index} style={[styles.tableRow, rowStyle]}>
                <Text style={styles.tableLabel}>{field.label}</Text>
                <Text style={styles.tableValue}>{displayValue.toString()}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  evenRow: {
    backgroundColor: '#efefef',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  tableLabel: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tableValue: {
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
});

export default ProfileCard;
