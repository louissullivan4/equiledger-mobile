import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,  // <--- import Modal
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { jwtDecode } from 'jwt-decode';
import DateTimePicker from '@react-native-community/datetimepicker';

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

// Helper to format date as DD-MM-YYYY
const formatDateDDMMYYYY = (dateString: string) => {
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    return dateString; // fallback if invalid
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

const ProfileCard: React.FC<HomeCardProps> = ({
  heightPercentage,
  navigation,
  user,
}) => {
  const height = screenHeight * (heightPercentage / 100);

  // Decode token to get userId
  const decodedToken: any = jwtDecode(user?.token);
  const { userId } = decodedToken;

  const [userInformation, setUserInformation] = useState<any | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  // For date picker
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          setUserInformation(response.data);
        }
      } catch (error) {
        console.log('Error', 'An error occurred while trying to fetch user', error);
      }
    };
    fetchUserInformation();
  }, [user]);

  // The fields we display
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

  // Begin editing a field
  const handleEditRow = (fieldKey: string) => {
    setEditingKey(fieldKey);
    setTempValue(userInformation[fieldKey] || '');
  };

  // Called when saving a field
  const handleSaveRow = async (fieldKey: string) => {
    try {
      const response = await axios.patch(
        `${SERVER_URL}/users/${userId}`,
        { [fieldKey]: tempValue },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setUserInformation((prev: any) => ({
          ...prev,
          [fieldKey]: tempValue,
        }));
        setEditingKey(null);
        setShowDatePicker(false);
      }
    } catch (error) {
      console.log('Error', 'An error occurred while updating field', error);
    }
  };

  // Cancel editing
  const handleCancelRow = () => {
    setTempValue('');
    setEditingKey(null);
    setShowDatePicker(false);
  };

  // Date picker handlers (only relevant for date_of_birth)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, user might press "cancel". In that case, selectedDate is undefined
    if (Platform.OS !== 'ios') {
      // Hide after selection on Android
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const isoString = selectedDate.toISOString();
      setTempValue(isoString);
    }
  };

  const openDatePicker = () => setShowDatePicker(true);

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.titleText}>Profile</Text>
      {userInformation && (
        <ScrollView style={styles.tableContainer}>
          {fieldsToDisplay.map((field, index) => {
            const rowStyle = index % 2 === 0 ? styles.evenRow : styles.oddRow;
            const isEditingThisRow = editingKey === field.key;

            // Format the date of birth if not editing
            let displayValue = userInformation[field.key]?.toString() || '';
            if (!isEditingThisRow && field.key === 'date_of_birth' && displayValue) {
              displayValue = formatDateDDMMYYYY(displayValue);
            }

            return (
              <View key={field.key} style={[styles.tableRow, rowStyle]}>
                <Text style={styles.tableLabel}>{field.label}</Text>

                {/* Editing Date of Birth => Show a special "Open date picker" button */}
                {isEditingThisRow && field.key === 'date_of_birth' ? (
                  <View style={styles.editContainer}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={openDatePicker}
                    >
                      <Text style={styles.tableValue}>
                        {tempValue
                          ? formatDateDDMMYYYY(tempValue)
                          : formatDateDDMMYYYY(userInformation[field.key] || '')}
                      </Text>
                    </TouchableOpacity>

                    {/* Save & Cancel Buttons */}
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveRow(field.key)}
                    >
                      <Text style={styles.saveButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelRow}
                    >
                      <Text style={styles.cancelButtonText}>X</Text>
                    </TouchableOpacity>

                    {/* The Modal for iOS “slide up from bottom” style */}
                    <Modal
                      transparent={true}
                      visible={showDatePicker}
                      animationType="slide"
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                          <DateTimePicker
                            mode="date"
                            display="spinner" // iOS spinner style (slides from bottom)
                            value={
                              tempValue
                                ? new Date(tempValue)
                                : new Date(userInformation[field.key] || Date.now())
                            }
                            onChange={handleDateChange}
                          />
                          {/* "Done" button to close modal on iOS */}
                          {Platform.OS === 'ios' && (
                            <View style={styles.modalButtonContainer}>
                              <TouchableOpacity
                                style={styles.doneButton}
                                onPress={() => setShowDatePicker(false)}
                              >
                                <Text style={styles.doneButtonText}>Done</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </Modal>
                  </View>
                ) : isEditingThisRow ? (
                  /* Editing any other field => normal TextInput */
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.input}
                      value={tempValue}
                      onChangeText={setTempValue}
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveRow(field.key)}
                    >
                      <Text style={styles.saveButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelRow}
                    >
                      <Text style={styles.cancelButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Not editing => show text with press to edit */
                  <TouchableOpacity
                    onPress={() => handleEditRow(field.key)}
                    style={styles.valueContainer}
                  >
                    <Text style={styles.tableValue}>{displayValue}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default ProfileCard;

/* --- STYLES --- */
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
    alignItems: 'center',
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
    textAlign: 'right',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    textAlign: 'right',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  datePickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginRight: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  /* Modal overlay to dim background */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // push modal to bottom
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  modalButtonContainer: {
    alignItems: 'flex-end',
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
